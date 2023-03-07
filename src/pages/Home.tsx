import { useState } from "react";
import Canvas from "./component/Canvas";
import InputFile from "./component/InputFile";
import "./css/Home.scss"
export const Home = () => {

    const [imageData, setImageData] = useState("");
    const handleFileChange = (value: string) => {
        setImageData(value);
    };

    // 當滑鼠移動到圖片上時，顯示放大鏡
    // 當滑鼠移出圖片時，隱藏放大鏡

    return (
        <div className="home">
            {imageData && <Canvas src={imageData} />}
            <InputFile labelId="file" placeholderText="Choose a file" onChange={handleFileChange} />
        </div>
    );
};
