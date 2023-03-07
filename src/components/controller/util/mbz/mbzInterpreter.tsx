import {decompressSync, Zippable, zipSync} from 'fflate';
// @ts-ignore
import FastXML from 'fast-xml-parser';
import { CalEventType } from '@/components/model/interfaces/events/calEvent';
import { MBZEvent } from '@/components/model/interfaces/events/mbzEvent';
import ArchiveFile from '@/components/model/interfaces/archive/archiveFile';
import MBZArchive from '@/components/model/interfaces/archive/MBZArchive';
import * as mbzConstants from './mbzConstants';

function applyChangesToFile(event:MBZEvent, file: ArchiveFile)  {
    
}

export const applyChangesToArchive = (events: MBZEvent[], data: MBZArchive) => {
    for (let event of events) {
        if (!(event.path in data)) {
            console.log("The ${event} is not in the archive you imported therefore it wont be in the exported archive");
            continue;
        }
        applyChangesToFile(event, data.getActivity(event.path));
    }
}

export const zipData = (data:MBZArchive): Uint8Array => {

  const pathToData: Zippable = {};
  const allFilesToZip = data.getAllFiles();
  for (let path in allFilesToZip) {
    pathToData[path] = getFileDataAsBytes(allFilesToZip[path]);
  }

  const serialized = zipSync(pathToData);

  return serialized;
}

export const extractData = async (file:File): Promise<ArchiveFile[]> => {
    
    const fileArrayBuffer = await readFileAsUint8Array(file);
    const unzip = decompressSync(fileArrayBuffer);
    // @ts-ignore
    const module = await import('js-untar'); // dynamic import because importing the module on the server-side will result in a exception becasue the module is looking for the window attribute
    const untar = module.default;

    return await untar(unzip.buffer);
}

export const parseActivities = (data: ArchiveFile[]): MBZArchive => {
    const extractedMBZ = new MBZArchive();
    
    for (let file of data) {
        if (file.name === "moodle_backup.xml") {
            extractedMBZ.main = file;
        } else {
            extractedMBZ.addFile(file);
        }
    }
    if (typeof extractedMBZ.main === "undefined") {
        throw new Error("No moodle_backup.xml file in provided tar. Make sure to upload a moodle backup file.")
    }

    parseXMLfileToJS(extractedMBZ.main);
    for (let activity of walkDownPath(extractedMBZ.main.parsedData, mbzConstants.INDEX_PATH_TO_ACTIVITIES)) {
        let moduleMBZType:string = activity[mbzConstants.ACTIVITY_TYPE]
        if (moduleMBZType in mbzConstants.ACTIVITY_TO_JS) {
            let activityPath = makeMBZpath(activity, moduleMBZType);
            extractedMBZ.registerFileAsActivity(activityPath);
        }
    }

    return extractedMBZ;
    
}

export const makeEvents = (data:MBZArchive):MBZEvent[] => {
    const calEvents:MBZEvent[] = [];
    
    for (let activityPath in data.activities) {
        let activityFile = data.activities[activityPath];
        parseXMLfileToJS(activityFile)
        let activityContent = activityFile.parsedData[mbzConstants.ACTIVITY_WRAPPER];
        let activityMbzType = activityContent[XML_HANDLER_OPTIONS.attributeNamePrefix + mbzConstants.ACTIVITY_TYPE];
        let id = activityContent[XML_HANDLER_OPTIONS.attributeNamePrefix + mbzConstants.ACTIVITY_ID];
        calEvents.push(mbzToEvent(activityContent[activityMbzType], id, activityPath, activityMbzType));
    }
         
    return calEvents;
};


function mbzDateToJS(mbzDate : string): Date{
    return new Date(parseInt(mbzDate, 10)* 1000);
}

function mbzToEvent(obj:any, id:string, path:string, mbzType: string): MBZEvent {
    let startDate;
    let endDate;
    const type = mbzConstants.ACTIVITY_TO_JS[mbzType];
    switch (type) {
        case CalEventType.Evaluation: {
            startDate = obj[mbzConstants.START_DATE_QUIZ]
            endDate = obj[mbzConstants.END_DATE_QUIZ]
            break;
        }
        case CalEventType.Homework: {
            startDate= obj[mbzConstants.START_DATE_ASSIGN]
            endDate= obj[mbzConstants.END_DATE_ASSIGN]
            break;
        }
    }
    return {
        start: mbzDateToJS(startDate),
        end: mbzDateToJS(endDate),
        title: obj[mbzConstants.ACTIVITY_NAME],
        type: type,
        uid: id,
        path: path};
}



const XML_HANDLER_OPTIONS = {
    ignoreAttributes : false,
    attributeNamePrefix : "@_"
};

const xmlParser = new FastXML.XMLParser(XML_HANDLER_OPTIONS);
const xmlBuilder = new FastXML.XMLBuilder(XML_HANDLER_OPTIONS);
const encoder = new TextEncoder();

function parseXMLfileToJS(file: ArchiveFile):any {
    if (typeof file.parsedData === "undefined") {
        file.parsedData = xmlParser.parse(Buffer.from(file.buffer));
    }
}

function getFileDataAsBytes(file: ArchiveFile):Uint8Array {
    let data: Uint8Array;
    if (typeof file.parsedData  === "undefined") {
        data = encoder.encode(xmlBuilder.build(file.parsedData));
    } else {
        data = new Uint8Array(file.buffer);
    }
    return data;
}

function makeMBZpath(jsonActivity: any, type: string) {
    return jsonActivity["directory"] + "/" + type + ".xml"; 
}

function readFileAsUint8Array(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
  
  function walkDownPath(object:any, path:string[]): any {
    let currentLevelObj = object;
    for (let pathPart of path) {
        currentLevelObj = currentLevelObj[pathPart]
    }
    return currentLevelObj;
  }