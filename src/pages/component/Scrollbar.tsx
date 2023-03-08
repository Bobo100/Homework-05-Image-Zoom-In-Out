// Scrollbar

import "./css/Scrollbar.scss"

interface ScrollbarProps {
    className?: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (value: number) => void;
}

const Scrollbar: React.FC<ScrollbarProps> = ({ className, min, max, step, value, onChange }) => {
    return (
        <input className={className} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    );
};

export default Scrollbar;
