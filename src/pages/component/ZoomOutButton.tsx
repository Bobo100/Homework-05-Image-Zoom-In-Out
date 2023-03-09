// ZoomOut button component

import { useRef } from 'react';
export default function ZoomOutButton() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleZoomOut = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        // 取得圖像
        const img = new Image();

        // 變更縮放比例
        let scaleFactor = 0.9;
        // 清空畫布
        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        // 繪製圖像
        ctx.drawImage(img, (-img.width / 2) * scaleFactor, (-img.height / 2) * scaleFactor, img.width * scaleFactor, img.height * scaleFactor);
    }

    return (
        <button onClick={handleZoomOut}>Zoom Out</button>
    );
}