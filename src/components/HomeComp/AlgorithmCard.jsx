"use client"

export default function AlgorithmCard({ algo }) {
    return (
        <div className="algorithm-card">
            <div className="card-glow"></div>
            <div className="card-content">
                <h3 className="card-title">{algo.name}</h3>
                {algo.description && <p className="card-description">{algo.description}</p>}
                {algo.difficulty && <span className="card-difficulty">{algo.difficulty}</span>}
                <div className="card-hover-effect"></div>
            </div>
        </div>
    )
}
