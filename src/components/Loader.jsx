import "./Loader.css";

export default function Loader({
                                   size = 64,             // 원 궤도 지름(px)
                                   dot = 6,               // 점 지름(px)
                                   speed = 1.2,           // 애니메이션 주기(s)
                                   label = "Loading..."   // 하단 텍스트
                               }) {
    // CSS 커스텀 프로퍼티로 값 전달
    const style = {
        "--size": `${size}px`,
        "--dot":  `${dot}px`,
        "--speed": `${speed}s`
    };

    return (
        <div className="loader-wrapper" style={style}>
            <div className="loader-orbit">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span key={i} style={{ "--i": i }} />
                ))}
            </div>
            {label && <span className="loader-label">{label}</span>}
        </div>
    );
}
