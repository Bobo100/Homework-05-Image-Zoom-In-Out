// 放大縮小按鈕
interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
}
export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls">
            <button onClick={onZoomIn}>Zoom In +</button>
            <button onClick={onZoomOut}>Zoom Out -</button>
        </div>
    );
};
