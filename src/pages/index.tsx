import Head from "next/head";
import styles from "@/styles/Home.module.css";
import EventCalendar from "@/components/view/EventCalendar";
import CourseInformationForm from "@/components/view/CourseInformationForm";
import { EventController } from "@/components/controller/EventController";
import ClearCalButton from "@/components/view/buttons/ClearCalButton";
import { EventModel } from "@/components/model/EventModel";
import FilePickerMBZ from "@/components/view/buttons/FilePickerMBZ";
import DownloadMBZButton from "@/components/view/buttons/DownloadMBZButton";
import SaveAllChangesButton from "@/components/view/buttons/SaveAllChangesButton";
import CancelChangesButton from "@/components/view/buttons/CancelChangesButton";
import ShowOverlay from "@/components/view/buttons/ShowOverlay";
import SuggestionConfig from "@/components/view/suggestion/SuggestionConfig";
import DSLWindow from "@/components/view/DSLWindow";
import ShowEventsByType from "@/components/view/editEvents/ShowEventsByType";
import UI from "@/styles/CoursePlanner.module.css";
import SubmitCourseButton from "@/components/view/buttons/SubmitCourseButton";
import SuggestionButton from "@/components/view/buttons/SuggestionButton";
import CalLegend from "@/components/view/colour/CalLegend";

export default function Home() {
  return (
    <>
      <Head>
        <title>Course-Planner</title>
        <meta name="description" content="Projet du PFE 030 de l'ETS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={UI.main}>
        <EventModel>
          <EventController>
            <div className={styles.mainFlex}>
              <div className={styles.leftSide}>
                <EventCalendar />
                <div className={styles.botLeft}>
                <CalLegend />
                  <div className={UI.flexWrapperButtonBottom}>
                    <ShowOverlay label={"Suggestion"}>
                      <SuggestionConfig />
                      <SuggestionButton />
                    </ShowOverlay>
                    <SaveAllChangesButton />
                    <CancelChangesButton />
                    <ClearCalButton />
                  </div>

                  <FilePickerMBZ />
                  <CourseInformationForm isOldCourse={false}>
                    <div className={UI.flexWrapperButton}>
                      <SubmitCourseButton />

                      <DownloadMBZButton />
                    </div>
                  </CourseInformationForm>
                </div>
              </div>
              <div className={styles.rightSide}>
                <ShowEventsByType />

                <div className={UI.flexWrapperDSL}>
                  <h2 className={UI.title}>Options Avancées: </h2>
                  <ShowOverlay label={"DSL"}>
                    <DSLWindow />
                  </ShowOverlay>
                </div>
              </div>
            </div>
          </EventController>
        </EventModel>
      </main>
    </>
  );
}
