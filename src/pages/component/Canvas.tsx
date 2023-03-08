// Canvas 用來顯示圖片
import { useEffect, useRef, useState } from "react";
import { ZoomControls } from "./CanvasControls";
import { Decimal } from "decimal.js"
export default function Canvas(props: { src: string }) {
    // const canvasRef = useRef<HTMLCanvasElement>(null);

    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) {
    //         return;
    //     }
    //     const ctx = canvas.getContext("2d");
    //     if (!ctx) {
    //         return;
    //     }

    //     // 加載圖像
    //     const img = new Image();
    //     img.src = props.src;

    //     // 範例使用了arrow function來綁定this當前對象
    //     // 您可以忽略這個部分
    //     img.onload = () => {
    //         // 設置canvas寬高
    //         canvas.width = img.width;
    //         canvas.height = img.height;

    //         let scaleFactor = 1.0;
    //         // let startDragging = false;
    //         // let prevX = 0;
    //         // let prevY = 0;

    //         // 將canvas居中顯示
    //         const centerX = canvas.width / 2;
    //         const centerY = canvas.height / 2;
    //         ctx.translate(centerX, centerY);

    //         // 繪製圖像
    //         ctx.drawImage(img, -img.width / 2, -img.height / 2);

    //         // const handleMouseDown = (e: any) => {
    //         //     startDragging = true;
    //         //     prevX = e.clientX;
    //         //     prevY = e.clientY;
    //         // };

    //         // const handleMouseMove = (e: any) => {
    //         //     if (startDragging) {
    //         //         const deltaX = e.clientX - prevX;
    //         //         const deltaY = e.clientY - prevY;
    //         //         prevX = e.clientX;
    //         //         prevY = e.clientY;

    //         //         ctx.translate(deltaX, deltaY);
    //         //         ctx.drawImage(img, -img.width / 2 * scaleFactor, -img.height / 2 * scaleFactor, img.width * scaleFactor, img.height * scaleFactor);
    //         //     }
    //         // };

    //         // const handleMouseUp = () => {
    //         //     startDragging = false;
    //         // };

    //         const handleWheel = (e: WheelEvent) => {
    //             // Math.sign(e.deltaY) 是JavaScript的內建方法，當滾輪滑動時，它會回傳一個數字：
    //             // 如果滾輪往上滾，就會回傳 - 1
    //             // 如果滾輪沒有滾，不會回傳任何值
    //             // 如果滾輪往下滾，就會回傳 1
    //             const delta = Math.sign(e.deltaY);
    //             // scaleFactor 要在 0.2 ~ 3 之間 原因是因為圖片太小或太大會讓圖片消失
    //             if ((scaleFactor < 3 && delta > 0) || (scaleFactor > 0.2 && delta < 0)) {
    //                 scaleFactor += delta * 0.1;

    //                 // 清空畫布
    //                 ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    //                 ctx.save();

    //                 // 繪製圖像
    //                 ctx.scale(scaleFactor, scaleFactor);
    //                 ctx.drawImage(img, (-img.width / 2) * scaleFactor, (-img.height / 2) * scaleFactor, img.width * scaleFactor, img.height * scaleFactor);

    //                 ctx.restore();
    //             }
    //         };


    //         // canvas.addEventListener("mousedown", handleMouseDown);
    //         // canvas.addEventListener("mousemove", handleMouseMove);
    //         // canvas.addEventListener("mouseup", handleMouseUp);

    //         // 新增canvas的滾輪事件
    //         // passive: true 代表不會阻止事件的預設行為
    //         canvas.addEventListener("wheel", handleWheel, { passive: true });
    //     };
    // }, [props.src]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scaleFactor, setScaleFactor] = useState(1);
    // const [lastTime, setLastTime] = useState(0);

    const maxScaleFactor = 3;
    const minScaleFactor = 0.2;
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
            ctx.translate(centerX, centerY);
            ctx.scale(scaleFactor, scaleFactor);

            // 繪製圖像
            ctx.drawImage(img, -img.width / 2, -img.height / 2);
        };

        /* 
        原始版本 (出現問題)
        問題出現於當連續觸發時，setScaleFactor被呼叫並使用前一個scaleFactor的值。
        因此，如果沒有實際變化，就會連續使用同樣的值，最終導致圖片變得非常小。
        */

        // const handleWheel = (e: WheelEvent) => {
        //     // e.preventDefault();
        //     const delta = -Math.sign(e.deltaY);
        //     console.log("delta", delta, "scaleFactor", scaleFactor);

        //     if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
        //         setScaleFactor((prevScale) => new Decimal(prevScale).plus(delta * 0.1).toNumber());
        //         // setScaleFactor((prevScale) => +((prevScale + delta * 0.1).toFixed(2)));
        //     }
        // };

        // 在更新scaleFactor之前使用一個變量保存上一個值，然後檢查新值是否有變化。如果它有所改變，才更新狀態。
        // 這樣做的好處是，我們可以在更新狀態之前檢查新值是否有變化，如果沒有變化，就不會觸發重新渲染。
        const handleWheel = (e: WheelEvent) => {
            const delta = -Math.sign(e.deltaY);
            let newScaleFactor = scaleFactor;
            if ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0)) {
                newScaleFactor = new Decimal(scaleFactor).plus(delta * 0.1).toNumber();
            }

            if (newScaleFactor !== scaleFactor) {
                setScaleFactor(newScaleFactor);
            }
        };

        /* 用時間來限制觸發次數
         一秒只能觸發一次 但這樣做的效果很差 */
        // const handleWheel = (e: WheelEvent) => {
        //     const delta = -Math.sign(e.deltaY);
        //     const now = Date.now();
        //     if (now - lastTime >= 1000 && ((scaleFactor < maxScaleFactor && delta > 0) || (scaleFactor > minScaleFactor && delta < 0))) { // 时间间隔大于等于1秒
        //         setScaleFactor((prevScale) => new Decimal(prevScale).plus(delta * 0.1).toNumber());
        //         setLastTime(now);
        //     }
        // };


        // 否則等待重繪周期。
        // window.requestAnimationFrame(handler);

        canvas.addEventListener("wheel", handleWheel, { passive: true });

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

    return <>
        <canvas ref={canvasRef} />
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </>;
}
