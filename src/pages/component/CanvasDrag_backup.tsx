// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
export default function CanvasDrag(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    // 把圖片存放在state中
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    // 滑鼠在瀏覽器中的座標
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標
    const [mouseposInCanvas, setMouseposInCanvas] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標 到 中心點 的距離
    const [mouseposInCanvasToCenter, setMouseposInCanvasToCenter] = useState({ x: 0, y: 0 });

    // 保存偏移量
    const [offsetInCanvas, setOffsetInCanvas] = useState({ x: 0, y: 0 });

    // 滑鼠最後的座標
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const maxScaleFactor = 3;
    const minScaleFactor = 1;
    // 設定小數點位數
    Decimal.set({ precision: 10 });

    const [isDragging, setIsDragging] = useState(false);
    // 確認是第一次拖移
    const [firstDrag, setFirstDrag] = useState(true);

    // 第一次載入圖片
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const img = new Image();
        img.src = props.src;
        img.onload = () => {
            // 圖片真的寬高
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.transform(1, 0, 0, 1, centerX, centerY);
            ctx.translate(mouseposInCanvasToCenter.x, mouseposInCanvasToCenter.y);
            ctx.scale(scaleFactor, scaleFactor); // 調整縮放比例
            ctx.translate(-mouseposInCanvasToCenter.x, -mouseposInCanvasToCenter.y);
            ctx.drawImage(img, -centerX, -centerY);
            setImage(img);
        };
    }, [props.src]);

    useEffect(() => {
        if (!image) return;
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

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);

            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }
            console.log(newScaleFactor)

            if (newScaleFactor !== scaleFactor) {
                const canvasBox = canvas.getBoundingClientRect();

                // 滑鼠的位移量
                console.log(lastMousePosition)
                const mouseposInCanvasXS = new Decimal(e.offsetX).times(canvas.width).dividedBy(canvasBox.width).toFixed(2);
                const mouseposInCanvasYS = new Decimal(e.offsetY).times(canvas.height).dividedBy(canvasBox.height).toFixed(2);
                const mouseposInCanvasX = Number(mouseposInCanvasXS);
                const mouseposInCanvasY = Number(mouseposInCanvasYS);
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.transform(1, 0, 0, 1, centerX, centerY);
                ctx.translate(mouseposInCanvasToCenter.x, mouseposInCanvasToCenter.y);
                ctx.scale(newScaleFactor, newScaleFactor); // 調整縮放比例
                ctx.translate(-mouseposInCanvasToCenter.x, -mouseposInCanvasToCenter.y);
                ctx.drawImage(image, -centerX, -centerY);

                setMouseposInCanvasToCenter({
                    x: mouseposInCanvasX - centerX + offsetInCanvas.x,
                    y: mouseposInCanvasY - centerY + offsetInCanvas.y
                });

                setLastMousePosition({ x: e.offsetX, y: e.offsetY });
                setScaleFactor(newScaleFactor);
            }
        };

        canvas.addEventListener("wheel", handleWheel);

        // 新增drag
        canvas.addEventListener("mousedown", (e) => {
            setIsDragging(true);
            setFirstDrag(true);
        });
        canvas.addEventListener("mouseup", () => {
            setIsDragging(false);
            setFirstDrag(true);

        });
        canvas.addEventListener("mouseleave", () => {
            setIsDragging(false);
            setFirstDrag(true);
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

            if (e.offsetX < 0 || e.offsetY < 0 || e.offsetX > canvasBox.width || e.offsetY > canvasBox.height) {
                return;
            }

            if (isDragging) {
                console.log("dragging");
                // 計算滑鼠移動的距離，在瀏覽器中的距離

                // 如果是第一次拖曳，則不計算offset
                let lastPos = lastMousePosition;
                if (firstDrag) {
                    lastPos = { x: e.offsetX, y: e.offsetY };
                    setFirstDrag(false);
                }

                const offsetX = new Decimal(e.offsetX).minus(lastPos.x).toNumber().toFixed(2);
                const offsetY = new Decimal(e.offsetY).minus(lastPos.y).toNumber().toFixed(2);
                console.log(e.offsetX, lastPos.x, "offsetX: ", offsetX)

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

                setOffsetInCanvas({ x: offsetXInCanvasN, y: offsetYInCanvasN });

                // 重新畫圖
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    return;
                }

                // 繪製圖像
                // 步驟：
                // 2. 清空畫布
                ctx.clearRect(-centerX, -centerY, canvas.width, canvas.height);
                // 3. 移動座標系統
                ctx.translate(offsetXInCanvasN, offsetYInCanvasN);
                // 4. 繪製圖像
                ctx.drawImage(image, -centerX, -centerY);

                // 記錄最後滑鼠位置
                setLastMousePosition({ x: e.offsetX, y: e.offsetY });
            }
        };

        canvas.addEventListener("mousemove", handleMouseMove);

        return () => {
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("mousedown", () => { });
            canvas.removeEventListener("mouseup", () => { });
            canvas.removeEventListener("mouseleave", () => { });
        };

    }, [props.src, scaleFactor, image, isDragging, lastMousePosition, mouseposInCanvasToCenter.x, mouseposInCanvasToCenter.y, offsetInCanvas.x, offsetInCanvas.y, firstDrag]);

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
