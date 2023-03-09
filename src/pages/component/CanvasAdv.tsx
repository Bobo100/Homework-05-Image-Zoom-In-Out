// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./CanvasControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
import "./css/Canvas.scss"
export default function CanvasAdv(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    // 这里假设我们使用useState Hook来存储上一个鼠标位置。
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });


    // 紀錄滑鼠的位置
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });

    // 紀錄滑鼠在圖片的位置
    const [mouseposInImage, setMouseposInImage] = useState({ x: 0, y: 0 });

    //紀錄圖片的大小
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const maxScaleFactor = 3;
    const minScaleFactor = 1.1;
    // 設定小數點位數
    Decimal.set({ precision: 10 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const img = new Image();
        img.src = props.src;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            setImageSize({ width: img.width, height: img.height });

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            if (mousepos.x === 0 && mousepos.y === 0) {
                ctx.translate(centerX, centerY);
            } else {
                ctx.translate(centerX, centerY);
                ctx.translate(mousepos.x, mousepos.y);
            }

            // console.log(mousepos)

            ctx.scale(scaleFactor, scaleFactor);

            // 繪製圖像
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
        };
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);
            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }


            // 紀錄滑鼠的位置
            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = e.clientX;
            const y = e.clientY;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // 縮放前的滑鼠在畫布的位置，或是 畫布上的滑鼠位置
            const canvasX = (x - rect.left) * scaleX;
            const canvasY = (y - rect.top) * scaleY;
            console.log("縮放前的滑鼠在畫布的位置，或是", canvasX, canvasY)
            setMousepos({ x: canvasX, y: canvasY });


            // 滑鼠在圖片中的坐標
            const mouseX = (canvasX - centerX)
            const mouseY = (canvasY - centerY)
            console.log("滑鼠在圖片中的坐標", mouseX, mouseY)
            setMouseposInImage({ x: mouseX, y: mouseY });



            if (newScaleFactor !== scaleFactor) {

                // 獲得新的滑鼠在圖片中的坐標，這標是經過縮放後的。會是新的中心點的座標?
                const newMouseX = mouseX * newScaleFactor / scaleFactor
                const newMouseY = mouseY * newScaleFactor / scaleFactor

                setScaleFactor(newScaleFactor);

            }
        };

        canvas.addEventListener("wheel", handleWheel);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
        };

    }, [props.src, scaleFactor]);

    const handleZoomIn = () => {
        if (scaleFactor < maxScaleFactor) {
            setScaleFactor((prevScale) => prevScale + 0.1);
        }
    };

    const handleZoomOut = () => {
        if (scaleFactor > minScaleFactor) {
            setScaleFactor((prevScale) => prevScale - 0.1);
        }
    };

    const handleChange = (newScaleFactor: number) => {
        setScaleFactor(newScaleFactor);
    };

    return (
        <div className="margin">
            <div className="flex center">
                滑鼠在畫布的位置
                <div className="margin">X: {mousepos.x}</div>
                <div className="margin">Y: {mousepos.y}</div>
            </div>
            <div className="flex center">
                滑鼠在圖片的位置
                <div className="margin">X: {mouseposInImage.x}</div>
                <div className="margin">Y: {mouseposInImage.y}</div>
            </div>
            <div className="flex center">
                圖片的大小
                <div className="margin">Width: {imageSize.width}</div>
                <div className="margin">Height: {imageSize.height}</div>
            </div>
            <div className="relative">
                <canvas ref={canvasRef} />
                <Scrollbar className="vertical" min={minScaleFactor} max={maxScaleFactor} step={0.1} value={scaleFactor} onChange={handleChange} />
            </div>
            <Scrollbar min={minScaleFactor} max={maxScaleFactor} step={0.1} value={scaleFactor} onChange={handleChange} />
            <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </div>
    );
}
