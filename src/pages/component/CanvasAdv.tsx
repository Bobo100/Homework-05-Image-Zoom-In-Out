// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./CanvasControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
import "./css/Canvas.scss"
export default function CanvasAdv(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const maxScaleFactor = 3;
    const minScaleFactor = 1;
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

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.translate(centerX + translate.x, centerY + translate.y);
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

            /* 這裡是重點
            1. 我們需要獲取滑鼠在畫布上的位置
            2. 我們要知道滑鼠在畫布上的位置在縮放後的位置 (縮放的value {newScaleFactor})
            3. 我們要知道滑鼠在畫布上的位置在縮放前的位置和縮放後的位置的差值
    

            */
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top


            setScaleFactor(newScaleFactor);


        };

        canvas.addEventListener("wheel", handleWheel);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
        };

    }, [props.src, scaleFactor, translate.x, translate.y]);

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
            <div className="relative">
                <canvas ref={canvasRef} />
                <Scrollbar className="vertical" min={minScaleFactor} max={maxScaleFactor} step={0.1} value={scaleFactor} onChange={handleChange} />
            </div>
            <Scrollbar min={minScaleFactor} max={maxScaleFactor} step={0.1} value={scaleFactor} onChange={handleChange} />
            <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </div>
    );
}
