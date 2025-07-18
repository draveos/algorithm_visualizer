"use client"

import { useState } from "react"
import FullscreenModal from "../components/FullscreenModal"
import "../styles/QuickSort.css"

export default function QuickSort({ algorithm }) {
    const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90, 88, 76, 50])
    const [isAnimating, setIsAnimating] = useState(false)
    const [speed, setSpeed] = useState(800)
    const [pivotIndex, setPivotIndex] = useState(-1)
    const [comparingIndices, setComparingIndices] = useState([])
    const [swappingIndices, setSwappingIndices] = useState([])
    const [sortedIndices, setSortedIndices] = useState([])
    const [recursionDepth, setRecursionDepth] = useState(0)
    const [stats, setStats] = useState({ comparisons: 0, swaps: 0, partitions: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inputValue, setInputValue] = useState("64,34,25,12,22,11,90,88,76,50")
    const [animationState, setAnimationState] = useState("ready")
    const [sortingGoal, setSortingGoal] = useState("ascending")

    const generateRandomArray = () => {
        const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1)
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
        setPivotIndex(-1)
        setComparingIndices([])
        setSwappingIndices([])
        setSortedIndices([])
        setRecursionDepth(0)
        setStats({ comparisons: 0, swaps: 0, partitions: 0 })
        setIsAnimating(false)
        setAnimationState("ready")
    }

    const quickSort = async () => {
        if (isAnimating) {
            setAnimationState("paused")
            return
        }

        if (animationState === "paused") {
            setAnimationState("running")
        } else {
            setIsAnimating(true)
            setAnimationState("running")
            resetAnimation()
        }

        const arr = [...array]
        let comparisons = 0
        let swaps = 0
        let partitions = 0

        const partition = async (low, high, depth) => {
            if (animationState === "paused") {
                await new Promise((resolve) => setTimeout(resolve, 100))
                return
            }
            setRecursionDepth(depth)
            const pivot = arr[high]
            setPivotIndex(high)
            partitions++
            setStats({ comparisons, swaps, partitions })

            await new Promise((resolve) => setTimeout(resolve, speed))

            let i = low - 1

            for (let j = low; j < high; j++) {
                if (animationState === "paused") {
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    return
                }
                setComparingIndices([j, high])
                comparisons++
                setStats({ comparisons, swaps, partitions })

                await new Promise((resolve) => setTimeout(resolve, speed))

                const shouldSwap = sortingGoal === "ascending" ? arr[j] < pivot : arr[j] > pivot

                if (shouldSwap) {
                    i++
                    if (i !== j) {
                        setSwappingIndices([i, j])
                        swaps++
                        setStats({ comparisons, swaps, partitions })
                        ;[arr[i], arr[j]] = [arr[j], arr[i]]
                        setArray([...arr])

                        await new Promise((resolve) => setTimeout(resolve, speed))
                    }
                }

                setComparingIndices([])
                setSwappingIndices([])
            }

            // Place pivot in correct position
            setSwappingIndices([i + 1, high])
            ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
            setArray([...arr])
            swaps++
            setStats({ comparisons, swaps, partitions })

            await new Promise((resolve) => setTimeout(resolve, speed))

            setPivotIndex(-1)
            setSwappingIndices([])
            setSortedIndices((prev) => [...prev, i + 1])

            return i + 1
        }

        const quickSortHelper = async (low, high, depth = 0) => {
            if (animationState === "paused") {
                await new Promise((resolve) => setTimeout(resolve, 100))
                return
            }
            if (low < high) {
                const pi = await partition(low, high, depth)
                if (pi === undefined) return

                await Promise.all([quickSortHelper(low, pi - 1, depth + 1), quickSortHelper(pi + 1, high, depth + 1)])
            } else if (low === high) {
                setSortedIndices((prev) => [...prev, low])
            }
        }

        await quickSortHelper(0, arr.length - 1)

        setSortedIndices(Array.from({ length: arr.length }, (_, i) => i))
        setRecursionDepth(0)
        setIsAnimating(false)
        setAnimationState("ready")
    }

    const ArrayVisualization = ({ fullscreen = false }) => (
        <div className="quicksort-container">
            <div className="goal-setting">
                <h4>Sorting Goal: {sortingGoal === "ascending" ? "Smallest to Largest" : "Largest to Smallest"}</h4>
                <p>Quick Sort will partition around pivots to achieve {sortingGoal} order</p>
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
                    <div className="sort-stat-label">Partitions</div>
                    <div className="sort-stat-value">{stats.partitions}</div>
                </div>
            </div>

            <div className="quicksort-visualization" style={{ height: fullscreen ? "60vh" : "600px" }}>
                {recursionDepth > 0 && <div className="recursion-depth">Depth: {recursionDepth}</div>}

                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`quicksort-bar ${pivotIndex === index ? "pivot" : ""} ${
                            comparingIndices.includes(index) ? "comparing" : ""
                        } ${swappingIndices.includes(index) ? "swapping" : ""} ${sortedIndices.includes(index) ? "sorted" : ""}`}
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
                    <h1>{algorithm?.name || "Quick Sort"}</h1>
                    <p className="algorithm-description">
                        {algorithm?.description ||
                            "Watch Quick Sort divide and conquer using pivot elements to efficiently sort the array"}
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
                            <h3>Quick Sort Visualization</h3>
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
                                    disabled={isAnimating}
                                />
                                <button className="generate-btn" onClick={generateRandomArray} disabled={isAnimating}>
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
                                        disabled={isAnimating}
                                    />
                                    Ascending (Smallest to Largest)
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="descending"
                                        checked={sortingGoal === "descending"}
                                        onChange={(e) => setSortingGoal(e.target.value)}
                                        disabled={isAnimating}
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
                            min="200"
                            max="1500"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
                            className="control-slider"
                            disabled={isAnimating}
                        />
                        <span className="speed-value">{speed}ms</span>
                    </div>

                    <div className="control-buttons">
                        <button
                            onClick={quickSort}
                            disabled={isAnimating && animationState === "running"}
                            className="btn-primary animate-btn"
                        >
                            {animationState === "running" ? "Pause" : animationState === "paused" ? "Resume" : "Start Quick Sort"}
                        </button>
                        <button onClick={resetAnimation} disabled={isAnimating} className="btn-secondary">
                            Reset
                        </button>
                    </div>
                </div>

                <FullscreenModal isOpen={isFullscreen} onClose={() => setIsFullscreen(false)} title="Quick Sort - Fullscreen">
                    <ArrayVisualization fullscreen />
                </FullscreenModal>
            </div>
        </div>
    )
}
