// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./ZoomControls";
import { Decimal } from "decimal.js"
import Scrollbar from "./Scrollbar";
export default function CanvasMousePositionMoveSmooth(props: { src: string }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        /* 
        清除 Image:
        JavaScript 自動管理記憶體回收（garbage collection），因此當 img 不再被引用時，它會被自動清除。
        在這種情況下，你不需要特別地清除 img。只要某個時刻不再使用它即可。
        總之，你可以放心地使用以上代碼，不需要擔心效能問題。
        當 img 不再被引用時，JavaScript 引擎會自動回收其佔用的內存，從而減少對效能的影響。
        */
        const img = new Image();
        img.src = props.src;
        img.onload = () => {
            setImage(img);
        }
    }, [props.src]);


    // 滑鼠在瀏覽器中的座標 (UI顯示用)
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標 (UI顯示用)
    const [mouseposInCanvas, setMouseposInCanvas] = useState({ x: 0, y: 0 });
    // 滑鼠在Canvas中的座標 到 中心點 的距離
    // 新的圖片中心點
    const [imageCenter, setimageCenter] = useState({ x: 0, y: 0 });

    const maxScaleFactor = 3;
    const minScaleFactor = 1;
    // 設定小數點位數
    Decimal.set({ precision: 10 });

    useEffect(() => {
        if (!image) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;

        draw(canvas, ctx, image);

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -Math.sign(e.deltaY);

            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }

            if (newScaleFactor !== scaleFactor) {
                const canvasBox = canvas.getBoundingClientRect();
                const centerX = canvasBox.width / 2;
                const centerY = canvasBox.height / 2;


                if (newScaleFactor === 1.1 && delta > 0) {
                    console.log("reset")
                    setimageCenter({
                        x: e.offsetX,
                        y: e.offsetY
                    });

                } else if (delta > 0) {
                    let offsetX = 10;
                    let offsetY = 10;
                    if (e.offsetX < centerX) {
                        offsetX = -10;
                    }
                    if (e.offsetY < centerY) {
                        offsetY = -10;
                    }

                    if (imageCenter.x + offsetX < 0) {
                        offsetX = 0;
                    }
                    if (imageCenter.y + offsetY < 0) {
                        offsetY = 0;
                    }
                    if (imageCenter.x + offsetX > canvasBox.width) {
                        offsetX = 0;
                    }
                    if (imageCenter.y + offsetY > canvasBox.height) {
                        offsetY = 0;
                    }
                    setimageCenter({
                        x: imageCenter.x + offsetX,
                        y: imageCenter.y + offsetY
                    });
                }
                setScaleFactor(newScaleFactor);
            }
        };

        canvas.addEventListener("wheel", handleWheel);

        const handleMouseMove = (e: MouseEvent) => {
            const canvasBox = canvas.getBoundingClientRect();
            const mouseposInCanvasXS = new Decimal(e.offsetX).times(canvas.width).dividedBy(canvasBox.width).toFixed(2);
            const mouseposInCanvasYS = new Decimal(e.offsetY).times(canvas.height).dividedBy(canvasBox.height).toFixed(2);
            const mouseposInCanvasX = Number(mouseposInCanvasXS);
            const mouseposInCanvasY = Number(mouseposInCanvasYS);

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


        function draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
            const canvasBox = canvas.getBoundingClientRect();
            // 要把數值轉換成在canvas上的座標
            const mouseposInCanvasXS = new Decimal(imageCenter.x).times(canvas.width).dividedBy(canvasBox.width).toFixed(2);
            const mouseposInCanvasYS = new Decimal(imageCenter.y).times(canvas.height).dividedBy(canvasBox.height).toFixed(2);
            const mouseposInCanvasX = Number(mouseposInCanvasXS);
            const mouseposInCanvasY = Number(mouseposInCanvasYS);

            console.log("draw ", imageCenter)

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(mouseposInCanvasX, mouseposInCanvasY);
            ctx.scale(scaleFactor, scaleFactor); // 調整縮放比例
            ctx.translate(-mouseposInCanvasX, -mouseposInCanvasY);
            ctx.drawImage(image, 0, 0);
        }

    }, [image, imageCenter, scaleFactor]);

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
