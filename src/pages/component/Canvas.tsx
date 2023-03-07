// Canvas 用來顯示圖片
import React, { useEffect, useRef } from "react";
export default function Canvas(props: { src: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        // 加載圖像
        const img = new Image();
        img.src = props.src;

        // 範例使用了arrow function來綁定this當前對象
        // 您可以忽略這個部分
        img.onload = () => {
            // 設置canvas寬高
            canvas.width = img.width;
            canvas.height = img.height;

            let scaleFactor = 1.0;
            // let startDragging = false;
            // let prevX = 0;
            // let prevY = 0;

            // 將canvas居中顯示
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            ctx.translate(centerX, centerY);

            // 繪製圖像
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            // const handleMouseDown = (e: any) => {
            //     startDragging = true;
            //     prevX = e.clientX;
            //     prevY = e.clientY;
            // };

            // const handleMouseMove = (e: any) => {
            //     if (startDragging) {
            //         const deltaX = e.clientX - prevX;
            //         const deltaY = e.clientY - prevY;
            //         prevX = e.clientX;
            //         prevY = e.clientY;

            //         ctx.translate(deltaX, deltaY);
            //         ctx.drawImage(img, -img.width / 2 * scaleFactor, -img.height / 2 * scaleFactor, img.width * scaleFactor, img.height * scaleFactor);
            //     }
            // };

            // const handleMouseUp = () => {
            //     startDragging = false;
            // };

            const handleWheel = (e: any) => {
                const delta = Math.sign(e.deltaY);
                // scaleFactor 要在 0.2 ~ 3 之間 原因是因為圖片太小或太大會讓圖片消失
                if ((scaleFactor < 3 && delta > 0) || (scaleFactor > 0.2 && delta < 0)) {
                    scaleFactor += delta * 0.1;

                    // 清空畫布
                    ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
                    ctx.save();

                    // 繪製圖像
                    ctx.scale(scaleFactor, scaleFactor);
                    ctx.drawImage(img, (-img.width / 2) * scaleFactor, (-img.height / 2) * scaleFactor, img.width * scaleFactor, img.height * scaleFactor);

                    ctx.restore();
                }
            };

            // canvas.addEventListener("mousedown", handleMouseDown);
            // canvas.addEventListener("mousemove", handleMouseMove);
            // canvas.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("wheel", handleWheel, { passive: true });
        };
    }, [props.src]);

    return <canvas ref={canvasRef} />;
}
