"use client"

export default function AlgorithmCard({ algo, navigate }) {


    const getDifficultyClass = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
                return "card-difficulty-easy"
            case "medium":
                return "card-difficulty-medium"
            case "hard":
                return "card-difficulty-hard"
            default:
                return "card-difficulty-easy"
        }
    }

    return (
        <div className={`algo-card ${getDifficultyClass(algo.difficulty)}`}>
            <div className="card-glow"></div>
            <div className="card-content">
                <h3 className="card-title">{algo.name}</h3>
                {algo.description && <p className="card-description">{algo.description}</p>}
                {algo.difficulty && (
                    <span className={`card-difficulty ${getDifficultyClass(algo.difficulty)}`}>{algo.difficulty}</span>
                )}
                <div className="card-hover-effect"></div>
            </div>
        </div>
    )
}
