import React, { useState } from 'react';
import textearea from "@/components/view/style/TextEntry.module.css"
interface TextEntryProps {
    text: string
    onChange:(text: string) => void;
    onSubmit: (text: string) => void;
}

const TextEntry: React.FC<TextEntryProps> = ({text, onChange, onSubmit }) => {

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(text);
    };

    return (
        <div>
            <textarea style={{ height: 500 , width: 500}} value={text} onChange={handleTextChange} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default TextEntry;