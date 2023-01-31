import React, {useContext} from "react";
import DataControllerContext from "src/components/controller/dataControllerContext";

interface ClearCalProps {}

const ClearCalButton: React.FC<ClearCalProps> = () => {
    const {notifyClearCal} = useContext(DataControllerContext); 
    
    return (
        <button onClick={notifyClearCal}>
        Supprimer
        </button>
    );
};

export default ClearCalButton;
