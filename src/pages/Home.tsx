import { useState } from "react";
import Canvas from "./component/Canvas";
import InputFile from "./component/InputFile";
import { ZoomControls } from "./component/CanvasControls";
import "./css/Home.scss"
import CanvasAdv from "./component/CanvasAdv";
export const Home = () => {

    const [imageData, setImageData] = useState("");
    const handleFileChange = (value: string) => {
        setImageData(value);
    };

    return (
        <div className="home">
            {imageData && <Canvas src={imageData} />}
            {imageData && <CanvasAdv src={imageData} />}
            {!imageData && <div className="home__placeholder">Please select an image</div>}
            {/* {!imageData && <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />} */}
            <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />


        </div>
    );
};
