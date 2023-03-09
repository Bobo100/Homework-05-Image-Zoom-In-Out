import { useState } from "react";
import Canvas from "./component/Canvas";
import InputFile from "./component/InputFile";
import CanvasMousePositionMove from './component/CanvasMousePositionMove'
import "./css/Home.scss"
export const Home = () => {

    const [imageData, setImageData] = useState("");
    const handleFileChange = (value: string) => {
        setImageData(value);
    };

    return (
        <div className="home">
            <h1>中心點縮放</h1>
            {imageData && <Canvas src={imageData} />}
            <h1>根據滑鼠位置縮放</h1>
            {imageData && <CanvasMousePositionMove src={imageData} />}

            {!imageData && <div className="home__placeholder">Please select an image</div>}

            <div className="margin">
                <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />
            </div>


        </div>
    );
};
