// input component
import React from 'react';

interface InputFileProps {
    labelId: string;
    placeholderText: string;
    onChange: (value: string) => void;
}

const InputFile: React.FC<InputFileProps> = ({ labelId, placeholderText, onChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target && e.target.result) {
                onChange(e.target.result as string);
            }
        };
        if (e.target.files && e.target.files[0])
            reader.readAsDataURL(e.target.files[0]);
    };

    return (
        <input type="file"accept='image/*' id={labelId} placeholder={placeholderText} onChange={handleFileChange} />
    );
};

export default InputFile;