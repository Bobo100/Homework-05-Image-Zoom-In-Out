// 放大縮小按鈕
import React from 'react';
import './css/ZoomControls.scss';

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
}
export const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
    return (
        <div className="zoom-controls margin">
            <button onClick={onZoomIn}>Zoom In +</button>
            <button onClick={onZoomOut}>Zoom Out -</button>
        </div>
    );
};
