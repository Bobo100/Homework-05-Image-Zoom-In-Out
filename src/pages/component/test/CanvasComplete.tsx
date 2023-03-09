// 完整可用 但沒特別檢查有沒有bug
import React, { useState, useEffect, useRef } from "react";

export const CanvasDemo = (props: { src: string }) => {
    const [mousepos, setMousepos] = useState({ x: 0, y: 0 });
    const [mouseposInImage, setMouseposInImage] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const isDragging = useRef(false);
    const dragStartPosition = useRef({ x: 0, y: 0 });
    const currentTransformedCursor = useRef({ x: 0, y: 0 });
    const [scaleFactor, setScaleFactor] = useState(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;

        if (canvas && image) {
            const context = canvas.getContext("2d")!;

            // See individual pixels when zooming
            context.imageSmoothingEnabled = false;

            const drawImageToCanvas = () => {
                context.save();
                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.restore();

                // context.drawImage(image, 0, 0, image.width, image.height);
                context.drawImage(image, 0, 0);

            };

            const getTransformedPoint = (x: number, y: number) => {
                const originalPoint = new DOMPoint(x, y);
                return context.getTransform().invertSelf().transformPoint(originalPoint);
            };

            const onMouseDown = (event: MouseEvent) => {
                isDragging.current = true;
                dragStartPosition.current = getTransformedPoint(
                    event.offsetX,
                    event.offsetY
                );
            };

            const onMouseMove = (event: MouseEvent) => {
                currentTransformedCursor.current = getTransformedPoint(
                    event.offsetX,
                    event.offsetY
                );
                setMousepos({ x: event.offsetX, y: event.offsetY });
                setMouseposInImage(currentTransformedCursor.current);

                if (isDragging.current) {
                    context.translate(
                        currentTransformedCursor.current.x - dragStartPosition.current.x,
                        currentTransformedCursor.current.y - dragStartPosition.current.y
                    );
                    drawImageToCanvas();
                }
            };

            const onMouseUp = () => {
                isDragging.current = false;
            };

            const onWheel = (event: WheelEvent) => {
                const zoom = event.deltaY < 0 ? 1.1 : 0.9;
                setScaleFactor(zoom);

                context.translate(
                    currentTransformedCursor.current.x,
                    currentTransformedCursor.current.y
                );
                context.scale(zoom, zoom);
                context.translate(
                    -currentTransformedCursor.current.x,
                    -currentTransformedCursor.current.y
                );

                drawImageToCanvas();
                event.preventDefault();
            };

            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);
            canvas.addEventListener("wheel", onWheel);

            return () => {
                canvas.removeEventListener("mousedown", onMouseDown);
                canvas.removeEventListener("mousemove", onMouseMove);
                canvas.removeEventListener("mouseup", onMouseUp);
                canvas.removeEventListener("wheel", onWheel);
            };
        }
    }, [props.src, scaleFactor]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{ border: "1px solid black" }}
            />
            <p>Original Mouse Position: ({mousepos.x}, {mousepos.y})</p>
            <p>
                Transformed Mouse Position In Image: ({mouseposInImage.x},{" "}
                {mouseposInImage.y})
            </p>
            <img
                ref={imageRef}
                src={props.src}
                alt=""
                style={{ display: "none" }}
            />
        </>
    );
};

export default CanvasDemo;
