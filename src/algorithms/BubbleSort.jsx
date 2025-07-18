"use client"

import { useState, useRef } from "react"
import FullscreenModal from "../components/FullscreenModal"
import "../styles/BubbleSort.css"

export default function BubbleSort({ algorithm }) {
    const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90])
    const [speed, setSpeed] = useState(500)
    const [comparingIndices, setComparingIndices] = useState([])
    const [swappingIndices, setSwappingIndices] = useState([])
    const [sortedIndices, setSortedIndices] = useState([])
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0, passes: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inputValue, setInputValue] = useState("64,34,25,12,22,11,90")
    const [sortingGoal, setSortingGoal] = useState("ascending") // ascending or descending

    const [animationState, setAnimationState] = useState("idle")
    const animationRef = useRef(null)
    const [isPaused, setIsPaused] = useState(false)

    const generateRandomArray = () => {
        const newArray = Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 1)
        setArray(newArray)
        setInputValue(newArray.join(","))
        resetAnimation()
    }

    const handleInputChange = (value) => {
        setInputValue(value)
        try {
            const newArray = value
                .split(",")
                .map((num) => Number.parseInt(num.trim()))
                .filter((num) => !isNaN(num) && num > 0)
            if (newArray.length > 0) {
                setArray(newArray)
                resetAnimation()
            }
        } catch (error) {
            // Invalid input, ignore
        }
    }

    const resetAnimation = () => {
        setAnimationState("idle")
        setComparingIndices([])
        setSwappingIndices([])
        setSortedIndices([])
        setStats({ comparisons: 0, swaps: 0, passes: 0 })
        setIsPaused(false)
        if (animationRef.current) {
            clearTimeout(animationRef.current)
        }
    }

    const pauseAnimation = () => {
        setIsPaused(true)
        setAnimationState("paused")
        if (animationRef.current) {
            clearTimeout(animationRef.current)
        }
    }

    const resumeAnimation = () => {
        setIsPaused(false)
        setAnimationState("running")
    }

    const sleep = (ms) => {
        return new Promise((resolve) => {
            if (isPaused) return
            animationRef.current = setTimeout(resolve, ms)
        })
    }

    const bubbleSort = async () => {
        if (animationState === "running") {
            pauseAnimation()
            return
        }

        if (animationState === "paused") {
            resumeAnimation()
            return
        }

        setAnimationState("running")
        resetAnimation()

        const arr = [...array]
        const n = arr.length
        let comparisons = 0
        let swaps = 0
        let passes = 0

        for (let i = 0; i < n - 1 && !isPaused; i++) {
            passes++
            let swapped = false

            for (let j = 0; j < n - i - 1 && !isPaused; j++) {
                setComparingIndices([j, j + 1])
                comparisons++
                setStats({ comparisons, swaps, passes })

                await sleep(speed)

                const shouldSwap = sortingGoal === "ascending" ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1]

                if (shouldSwap) {
                    setSwappingIndices([j, j + 1])
                    swaps++
                    setStats({ comparisons, swaps, passes })
                    ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
                    setArray([...arr])
                    swapped = true

                    await sleep(speed)
                }

                setComparingIndices([])
                setSwappingIndices([])
            }

            setSortedIndices((prev) => [...prev, n - 1 - i])

            if (!swapped) break
        }

        if (!isPaused) {
            setSortedIndices(Array.from({ length: n }, (_, i) => i))
            setAnimationState("completed")
        }
    }

    const getButtonText = () => {
        switch (animationState) {
            case "running":
                return "Pause"
            case "paused":
                return "Resume"
            case "completed":
                return "Start Bubble Sort"
            default:
                return "Start Bubble Sort"
        }
    }

    const ArrayVisualization = ({ fullscreen = false }) => (
        <div className="bubble-sort-container">
            <div className="goal-setting">
                <h4>Sorting Goal: {sortingGoal === "ascending" ? "Smallest to Largest" : "Largest to Smallest"}</h4>
                <p>The algorithm will sort the array in {sortingGoal} order</p>
            </div>

            <div className="sort-stats">
                <div className="sort-stat">
                    <div className="sort-stat-label">Comparisons</div>
                    <div className="sort-stat-value">{stats.comparisons}</div>
                </div>
                <div className="sort-stat">
                    <div className="sort-stat-label">Swaps</div>
                    <div className="sort-stat-value">{stats.swaps}</div>
                </div>
                <div className="sort-stat">
                    <div className="sort-stat-label">Passes</div>
                    <div className="sort-stat-value">{stats.passes}</div>
                </div>
            </div>

            <div className="array-visualization" style={{ height: fullscreen ? "60vh" : "600px" }}>
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`array-bar ${comparingIndices.includes(index) ? "comparing" : ""} ${
                            swappingIndices.includes(index) ? "swapping" : ""
                        } ${sortedIndices.includes(index) ? "sorted" : ""}`}
                        style={{
                            height: `${(value / Math.max(...array)) * (fullscreen ? 50 : 40)}vh`,
                        }}
                    >
                        <span className="bar-value">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div>
            <div className="algorithm-container">
                <div className="algorithm-header">
                    <h1>{algorithm?.name || "Bubble Sort"}</h1>
                    <p className="algorithm-description">
                        {algorithm?.description || "Watch how Bubble Sort compares and swaps adjacent elements to sort the array"}
                    </p>
                </div>

                <div className="main-content">
                    <div className="visualization-card">
                        <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                        </button>
                        <div className="card-header">
                            <h3>Bubble Sort Visualization</h3>
                        </div>
                        <ArrayVisualization />
                    </div>

                    <div className="input-controls">
                        <div className="algorithm-card">
                            <div className="card-header">
                                <h3>Array Input</h3>
                            </div>
                            <div className="array-input">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Enter numbers separated by commas"
                                    disabled={animationState === "running"}
                                />
                                <button className="generate-btn" onClick={generateRandomArray} disabled={animationState === "running"}>
                                    Generate Random
                                </button>
                            </div>
                        </div>

                        <div className="algorithm-card">
                            <div className="card-header">
                                <h3>Sorting Goal</h3>
                            </div>
                            <div className="goal-selector">
                                <label>
                                    <input
                                        type="radio"
                                        value="ascending"
                                        checked={sortingGoal === "ascending"}
                                        onChange={(e) => setSortingGoal(e.target.value)}
                                        disabled={animationState === "running"}
                                    />
                                    Ascending (Smallest to Largest)
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="descending"
                                        checked={sortingGoal === "descending"}
                                        onChange={(e) => setSortingGoal(e.target.value)}
                                        disabled={animationState === "running"}
                                    />
                                    Descending (Largest to Smallest)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="control-panel">
                    <div className="control-group">
                        <label className="control-label">Animation Speed:</label>
                        <input
                            type="range"
                            min="100"
                            max="1000"
                            step="50"
                            value={speed}
                            onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
                            className="control-slider"
                            disabled={animationState === "running"}
                        />
                        <span className="speed-value">{speed}ms</span>
                    </div>

                    <div className="control-buttons">
                        <button onClick={bubbleSort} className="btn-primary animate-btn">
                            {getButtonText()}
                        </button>
                        <button onClick={resetAnimation} disabled={animationState === "running"} className="btn-secondary">
                            Reset
                        </button>
                    </div>
                </div>

                <FullscreenModal isOpen={isFullscreen} onClose={() => setIsFullscreen(false)} title="Bubble Sort - Fullscreen">
                    <ArrayVisualization fullscreen />
                </FullscreenModal>
            </div>
        </div>
    )
}
