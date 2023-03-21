import React, {useState, useContext} from "react";
import {EventControllerContext} from "@/components/controller/eventController";

interface Props {}

const FilePickerMBZ: React.FC<Props> = () => {
  const [selectedFile, setSelectedFile] = useState<string>("");

  const {notifyMBZSubmitted} = useContext(EventControllerContext);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null && event.target.value !== "") {
      setSelectedFile(event.target.value);
      notifyMBZSubmitted(event.target.files[0]);
    }
  };

  const handleFocus = () => {
    setSelectedFile("");
  }

  return (
    <div>
      <input type="file" value={selectedFile} onFocus={handleFocus} onInput={handleFileChange} />
    </div>
  );
};

export default FilePickerMBZ;