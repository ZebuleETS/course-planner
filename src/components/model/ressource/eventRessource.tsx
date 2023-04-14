import {
    ActivityDateProp,
    ActivityType,
    CourseEvent,
    CourseType,
    CoursEventDateGetter,
    EventType,
    SuggestionTypeMapConfig,
    TypeColourDict
} from "@/components/model/interfaces/courseEvent";
import {DSLDateRef} from "../interfaces/dsl";

export const defaultEventColours: TypeColourDict = {
    [EventType.Seminar]:"#3a20fe",
    [EventType.Practicum]:"#5f2596",
    [EventType.Laboratory]:"#00ff88",
    [EventType.Evaluation]:"#ff2e2e",
    [EventType.Homework]:"#ffbb00"
};


export const ACTIVITY_TYPE_TO_DATE_PROP: {[key in ActivityType]:ActivityDateProp[]} =  { 
    // values order has to match DSL order.
    [EventType.Evaluation]: [{getter:(e:CourseEvent) => e.start,
                            label:"Début"}, 
                            {getter:(e:CourseEvent) => e.end,
                            label:"Fin"}],
    [EventType.Homework]: [{getter:(e:CourseEvent) => e.start,
                            label:"Début"}, 
                            {getter:(e:CourseEvent) => e.due,
                            label:"Début remise"},
                            {getter:(e:CourseEvent) => e.cutoff,
                            label:"Fin remise"}]
}

export const COURSE_DATE_TO_GETTER: {[key in DSLDateRef]:CoursEventDateGetter} = {
    [DSLDateRef.Start]: (e:CourseEvent) => e.start,
    [DSLDateRef.End]: (e:CourseEvent) => e.end
}

export const activityTypeToLabel: {[key in ActivityType]: string} = {
    [EventType.Homework]: "Devoir",
    [EventType.Evaluation]: "Évaluation",
};

export const courseTypeToLabel: {[key in CourseType]: string} = {
    [EventType.Seminar]: "Cours",
    [EventType.Practicum]: "TP",
    [EventType.Laboratory]: "Laboratoire",
};

export const eventTypeToLabel: {[key in EventType]: string} = {...activityTypeToLabel, ...courseTypeToLabel};
export const defaultSuggestionTypeMapping: SuggestionTypeMapConfig = {
    [EventType.Homework]: EventType.Laboratory,
    [EventType.Evaluation]: EventType.Seminar,
};