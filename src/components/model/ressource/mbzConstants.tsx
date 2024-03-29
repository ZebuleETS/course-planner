import {EventType} from "@/components/model/interfaces/courseEvent";

export const QUIZ_START_DATE = "timeopen";
export const QUIZ_END_DATE = "timeclose";
export const ASSIGN_START_DATE = "allowsubmissionsfromdate";
export const ASSIGN_CUTOFF_DATE = "cutoffdate";
export const ASSIGN_DUE_DATE = "duedate";
export const ACTIVITY_TYPE = "modulename";
export const ACTIVITY_WRAPPER = "activity";
export const ACTIVITY_SETTING_NAME = "activity";
export const ACTIVITY_ID = "moduleid";
export const ACTIVITY_NAME = "name";
export const ACTIVITY_DIR = "directory"
export const ACTIVITY_TO_JS: {[key: string]: EventType } = {
    "quiz": EventType.Evaluation,
    "assign": EventType.Homework
}
export const INDEX_PATH_TO_ACTIVITIES = ["moodle_backup","information","contents","activities","activity"]
export const INDEX_PATH_TO_SETTINGS = ["moodle_backup","information","settings","setting"]