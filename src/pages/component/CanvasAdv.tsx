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

            // 這裡是重點
            // 計算滑鼠位置
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 計算圖像座標中滑鼠的位置
            const imageX = x - img.width / 2;
            const imageY = y - img.height / 2;

            // 使用新的放大倍率計算位移量
            let offsetX = imageX * (scaleFactor - 1);
            let offsetY = imageY * (scaleFactor - 1);


            if (newScaleFactor !== scaleFactor) {
                setScaleFactor(newScaleFactor);
                setTranslate({ x: offsetX, y: offsetY });

                console.log(offsetX, offsetY)
            }
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
