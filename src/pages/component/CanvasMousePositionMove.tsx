// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
export default function CanvasMousePositionMove(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);

    // 滑鼠在瀏覽器中的座標
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標
    const [mouseposInCanvas, setMouseposInCanvas] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標 到 中心點 的距離
    const [mouseposInCanvasToCenter, setMouseposInCanvasToCenter] = useState({ x: 0, y: 0 });

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
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const img = new Image();
        img.src = props.src;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;


            ctx.transform(1, 0, 0, 1, centerX, centerY);
            ctx.translate(mouseposInCanvasToCenter.x, mouseposInCanvasToCenter.y);
            ctx.scale(scaleFactor, scaleFactor); // 調整縮放比例
            ctx.translate(-mouseposInCanvasToCenter.x, -mouseposInCanvasToCenter.y);
            ctx.drawImage(img, -centerX, -centerY);

        };

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);

            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }

            if (newScaleFactor !== scaleFactor) {
                setScaleFactor(newScaleFactor);
            }
        };

        canvas.addEventListener("wheel", handleWheel);

        const handleMouseMove = (e: MouseEvent) => {
            const canvasBox = canvas.getBoundingClientRect();
            const mouseposInCanvasX = e.offsetX * (canvas.width / canvasBox.width);
            const mouseposInCanvasY = e.offsetY * (canvas.height / canvasBox.height);

            setMouseposInCanvasToCenter({
                x: mouseposInCanvasX - centerX,
                y: mouseposInCanvasY - centerY
            });
            setMousepos({ x: e.offsetX, y: e.offsetY });
            setMouseposInCanvas({ x: mouseposInCanvasX, y: mouseposInCanvasY });
        };

        canvas.addEventListener("mousemove", handleMouseMove);

        /*
        移除事件監聽器是為了避免產生潛在的記憶體洩漏 (memory leak)。
        如果一個元素被註冊了一個事件，而當該元素從 DOM 樹中被一開始的父節點刪除時，它仍存在於記憶體中並保留其事件監聽器，這將繼續佔用大量記憶體並可能影響應用程序的性能。
        因此必須定期清理或移除不再需要的事件監聽器。
        */
        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("wheel", handleWheel);
        };

    }, [mouseposInCanvasToCenter.x, mouseposInCanvasToCenter.y, props.src, scaleFactor]);

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
                滑鼠在瀏覽器中的座標:
                <div className="margin">X: {mousepos.x}</div>
                <div className="margin">Y: {mousepos.y}</div>
            </div>
            <div className="flex center">
                滑鼠在Canvas中的座標:
                <div className="margin">X: {mouseposInCanvas.x}</div>
                <div className="margin">Y: {mouseposInCanvas.y}</div>
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
