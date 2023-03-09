// ZoomIn button component
export default function ZoomInButton(props: { onClick: () => void }) {
    return (
        <button onClick={props.onClick}>Zoom In</button>
    );
}