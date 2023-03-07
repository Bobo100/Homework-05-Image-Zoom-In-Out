import { useState } from "react";
import Canvas from "./component/Canvas";
import InputFile from "./component/InputFile";
import { ZoomControls } from "./component/CanvasControls";
import "./css/Home.scss"
export const Home = () => {

    const [imageData, setImageData] = useState("");
    const handleFileChange = (value: string) => {
        setImageData(value);
    };

    return (
        <div className="home">
            {imageData && <Canvas src={imageData} />}
            <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />
        </div>
    );
};
