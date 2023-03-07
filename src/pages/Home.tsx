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

    const [scaleFactor, setScaleFactor] = useState<number>(1);

    const handleZoomIn = () => {
        if (scaleFactor >= 3) return

        setScaleFactor(scaleFactor + 0.1);
    }

    const handleZoomOut = () => {
        if (scaleFactor <= 0.2) return

        setScaleFactor(scaleFactor - 0.1);
    }

    return (
        <div className="home">
            {imageData && <Canvas src={imageData} />}
            <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />
            {/* <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} /> */}
        </div>
    );
};
