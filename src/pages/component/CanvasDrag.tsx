// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
export default function CanvasDrag(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);

    // 滑鼠在瀏覽器中的座標
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標
    const [mouseposInCanvas, setMouseposInCanvas] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標 到 中心點 的距離
    const [mouseposInCanvasToCenter, setMouseposInCanvasToCenter] = useState({ x: 0, y: 0 });

    // 保存偏移量
    const [offset, setOffset] = useState({ x: 0, y: 0 });

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
            // ctx.translate(offset.x, offset.y);
            ctx.scale(scaleFactor, scaleFactor); // 調整縮放比例
            ctx.translate(-mouseposInCanvasToCenter.x, -mouseposInCanvasToCenter.y);
            // ctx.translate(-offset.x, -offset.y);
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
                const canvasBox = canvas.getBoundingClientRect();

                const mouseposInCanvasXS = new Decimal(e.offsetX).times(canvas.width).dividedBy(canvasBox.width).toFixed(2);
                const mouseposInCanvasYS = new Decimal(e.offsetY).times(canvas.height).dividedBy(canvasBox.height).toFixed(2);
                const mouseposInCanvasX = Number(mouseposInCanvasXS);
                const mouseposInCanvasY = Number(mouseposInCanvasYS);
                setMouseposInCanvasToCenter({
                    x: mouseposInCanvasX - centerX + offset.x,
                    y: mouseposInCanvasY - centerY + offset.y
                });

                setScaleFactor(newScaleFactor);
            }
        };

        canvas.addEventListener("wheel", handleWheel);

        // 新增drag
        let isDragging = false;
        let lastMousePos = { x: 0, y: 0 };
        canvas.addEventListener("mousedown", (e) => {
            isDragging = true;
            lastMousePos = { x: e.offsetX, y: e.offsetY };
        });
        canvas.addEventListener("mouseup", () => {
            isDragging = false;
        });
        canvas.addEventListener("mouseleave", () => {
            isDragging = false;
        });

        // 滑鼠移動
        const handleMouseMove = (e: MouseEvent) => {
            const canvasBox = canvas.getBoundingClientRect();

            const mouseposInCanvasXS = new Decimal(e.offsetX).times(canvas.width).dividedBy(canvasBox.width).toFixed(2);
            const mouseposInCanvasYS = new Decimal(e.offsetY).times(canvas.height).dividedBy(canvasBox.height).toFixed(2);
            const mouseposInCanvasX = Number(mouseposInCanvasXS);
            const mouseposInCanvasY = Number(mouseposInCanvasYS);

            setMousepos({ x: e.offsetX, y: e.offsetY });
            setMouseposInCanvas({ x: mouseposInCanvasX, y: mouseposInCanvasY });

            if (isDragging) {
                console.log("dragging");
                // 計算滑鼠移動的距離，在瀏覽器中的距離
                const offsetX = new Decimal(e.offsetX).minus(lastMousePos.x).toFixed(2);
                const offsetY = new Decimal(e.offsetY).minus(lastMousePos.y).toFixed(2);

                // 將offset轉換成在Canvas中的座標
                const offsetXInCanvas = new Decimal(offsetX)
                    .times(canvas.width)
                    .dividedBy(canvasBox.width)
                    .toFixed(2);
                const offsetYInCanvas = new Decimal(offsetY)
                    .times(canvas.height)
                    .dividedBy(canvasBox.height)
                    .toFixed(2);
                const offsetXInCanvasN = Number(offsetXInCanvas);
                const offsetYInCanvasN = Number(offsetYInCanvas);

                setOffset({ x: offsetXInCanvasN, y: offsetYInCanvasN });

                // 重新畫圖
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return;
                }

                // 記錄最後滑鼠位置
                lastMousePos = { x: e.offsetX, y: e.offsetY };

                // 繪製圖像
                // 步驟：
                // 1. 儲存目前的狀態
                // ctx.save();
                // 2. 清空畫布
                ctx.clearRect(-centerX, -centerY, canvas.width, canvas.height);
                // 3. 移動座標系統
                ctx.translate(offsetXInCanvasN, offsetYInCanvasN);
                // 4. 繪製圖像
                ctx.drawImage(img, -centerX, -centerY);
                // 5. 恢復狀態
                // ctx.restore();

            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("wheel", handleWheel);
        };

    }, [mouseposInCanvasToCenter, props.src, scaleFactor]);

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
                <p>滑鼠在瀏覽器中的座標:</p>
                <div className="margin">X: {mousepos.x}</div>
                <div className="margin">Y: {mousepos.y}</div>
            </div>
            <div className="flex center">
                <p>滑鼠在Canvas中的座標:</p>
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
