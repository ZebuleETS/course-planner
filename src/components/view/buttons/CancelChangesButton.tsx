import React, {useContext, useEffect, useState} from "react";
import {EventControllerContext} from "@/components/controller/EventController";
import UI from "@/styles/CoursePlanner.module.css";
import {getUnsavedStates} from "@/components/controller/util/eventsOperations";
import {EventModelContext} from "@/components/model/EventModel";
import classNames from "classnames";

interface CancelChangesButtonProps {}
/**

 Represents a button component that cancels changes made to all events.
 This component uses the EventControllerContext to access the notifyCancelChanges function, which cancels any changes made to an event.
 @component
 */
const CancelChangesButton: React.FC<CancelChangesButtonProps> = () => {
    const {notifyCancelChanges} = useContext(EventControllerContext);
    const {events} = useContext(EventModelContext);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    useEffect(()=>{
        setIsDisabled(getUnsavedStates(events).length <= 0)
    },[events])
    const handleClick = ():void => {
        notifyCancelChanges(undefined);
    }
    const visibilityClass = classNames({
        [UI.hidden]: isDisabled,
        [UI.overlay]: !isDisabled,
    });


    return (
        
            <button disabled={isDisabled} onClick={handleClick} className={visibilityClass}>
                <div className={UI.uiLabel}>
                    Annuler les modifications
                </div>
            </button>

    );
};

export default CancelChangesButton;
