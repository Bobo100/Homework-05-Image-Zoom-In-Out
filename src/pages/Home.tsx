import { useState } from "react";
import Canvas from "./component/Canvas";
import InputFile from "./component/InputFile";
import CanvasMousePositionMove from './component/CanvasMousePositionMove'
import "./css/Home.scss"
import CanvasDrag from "./component/CanvasDrag";
import CanvasMousePositionMoveSmooth from "./component/CanvasMousePositionMoveSmooth";
import image from "../image/dmitry-demidko-eBWzFKahEaU-unsplash.jpg"

export const Home = () => {

    const [imageData, setImageData] = useState("");
    const handleFileChange = (value: string) => {
        setImageData(value);
    };

    function downloadImage() {
        // Create a new anchor element
        const link = document.createElement('a');
        // Set the href attribute of the anchor element to the image URL
        link.href = image;
        // Set the download attribute of the anchor element to the file name you want to save
        link.download = 'dmitry-demidko-eBWzFKahEaU-unsplash.jpg';
        // Trigger a click event on the anchor element
        // This will automatically download the image
        link.click();
    }
    return (
        <div className="home">
            <button onClick={downloadImage} >Download</button>
            {imageData && <h1>中心點縮放</h1>}
            {imageData &&
                <Canvas src={imageData} />}
            {imageData && <h1>根據滑鼠位置縮放</h1>}
            {imageData && <CanvasMousePositionMove src={imageData} />}
            {imageData && <h1>根據滑鼠位置縮放的平滑版</h1>}
            {imageData && <CanvasMousePositionMoveSmooth src={imageData} />}
            {imageData && <h1>可拖曳</h1>}
            {imageData && <CanvasDrag src={imageData} />}

            {!imageData && <div className="home__placeholder">Please select an image</div>}
            <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />
        </div>
    );
};
