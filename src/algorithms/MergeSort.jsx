"use client"

import { useState } from "react"
import FullscreenModal from "../components/FullscreenModal"
import "../styles/MergeSort.css"

export default function MergeSort({ algorithm }) {
    const [array, setArray] = useState([38, 27, 43, 3, 9, 82, 10])
    const [isAnimating, setIsAnimating] = useState(false)
    const [speed, setSpeed] = useState(800)
    const [currentPhase, setCurrentPhase] = useState("divide") // "divide" or "merge"
    const [divideSteps, setDivideSteps] = useState([])
    const [mergeSteps, setMergeSteps] = useState([])
    const [currentLevel, setCurrentLevel] = useState(0)
    const [comparingIndices, setComparingIndices] = useState([])
    const [mergingArrays, setMergingArrays] = useState({ left: [], right: [] })
    const [sortedIndices, setSortedIndices] = useState([])
    const [stats, setStats] = useState({ comparisons: 0, merges: 0, levels: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inputValue, setInputValue] = useState("38,27,43,3,9,82,10")
    const [recursionTree, setRecursionTree] = useState([])

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
        setCurrentPhase("divide")
        setDivideSteps([])
        setMergeSteps([])
        setCurrentLevel(0)
        setComparingIndices([])
        setMergingArrays({ left: [], right: [] })
        setSortedIndices([])
        setStats({ comparisons: 0, merges: 0, levels: 0 })
        setRecursionTree([])
        setIsAnimating(false)
    }

    const mergeSort = async () => {
        if (isAnimating) {
            setIsAnimating("pause")
            return
        }

        if (isAnimating === "pause") {
            setIsAnimating(true)
            return
        }

        setIsAnimating(true)
        resetAnimation()

        const arr = [...array]
        let comparisons = 0
        let merges = 0
        let maxLevel = 0
        const tree = []

        const mergeSortHelper = async (tempArr, left, right, level = 0) => {
            maxLevel = Math.max(maxLevel, level)
            setCurrentLevel(level)
            setStats((prev) => ({ ...prev, levels: maxLevel + 1 }))

            // Add to recursion tree
            tree.push({
                level,
                range: [left, right],
                array: tempArr.slice(left, right + 1),
                phase: "divide",
            })
            setRecursionTree([...tree])

            if (left >= right) return

            // Divide phase
            setCurrentPhase("divide")
            setDivideSteps((prev) => [...prev, { left, right, level }])
            await new Promise((resolve) => setTimeout(resolve, speed))

            const mid = Math.floor((left + right) / 2)

            // Recursively sort left and right halves
            await mergeSortHelper(tempArr, left, mid, level + 1)
            await mergeSortHelper(tempArr, mid + 1, right, level + 1)

            // Merge phase
            setCurrentPhase("merge")
            merges++
            setStats((prev) => ({ ...prev, merges }))

            // Update tree for merge phase
            tree.push({
                level,
                range: [left, right],
                array: tempArr.slice(left, right + 1),
                phase: "merge",
            })
            setRecursionTree([...tree])

            await merge(tempArr, left, mid, right)
        }

        const merge = async (tempArr, left, mid, right) => {
            const leftArr = tempArr.slice(left, mid + 1)
            const rightArr = tempArr.slice(mid + 1, right + 1)

            setMergingArrays({ left: leftArr, right: rightArr })
            await new Promise((resolve) => setTimeout(resolve, speed))

            let i = 0,
                j = 0,
                k = left

            while (i < leftArr.length && j < rightArr.length) {
                if (isAnimating !== true) {
                    return
                }
                setComparingIndices([left + i, mid + 1 + j])
                comparisons++
                setStats((prev) => ({ ...prev, comparisons }))

                await new Promise((resolve) => setTimeout(resolve, speed))

                if (leftArr[i] <= rightArr[j]) {
                    tempArr[k] = leftArr[i]
                    i++
                } else {
                    tempArr[k] = rightArr[j]
                    j++
                }
                k++

                setArray([...tempArr])
                await new Promise((resolve) => setTimeout(resolve, speed / 2))
            }

            // Copy remaining elements
            while (i < leftArr.length) {
                if (isAnimating !== true) {
                    return
                }
                tempArr[k] = leftArr[i]
                i++
                k++
                setArray([...tempArr])
                await new Promise((resolve) => setTimeout(resolve, speed / 2))
            }

            while (j < rightArr.length) {
                if (isAnimating !== true) {
                    return
                }
                tempArr[k] = rightArr[j]
                j++
                k++
                setArray([...tempArr])
                await new Promise((resolve) => setTimeout(resolve, speed / 2))
            }

            // Mark merged section as sorted
            const sortedRange = Array.from({ length: right - left + 1 }, (_, idx) => left + idx)
            setSortedIndices((prev) => [...prev, ...sortedRange])

            setComparingIndices([])
            setMergingArrays({ left: [], right: [] })
            await new Promise((resolve) => setTimeout(resolve, speed / 2))
        }

        await mergeSortHelper(arr, 0, arr.length - 1)

        // Mark all as sorted
        setSortedIndices(Array.from({ length: arr.length }, (_, i) => i))
        setCurrentPhase("complete")
        setIsAnimating(false)
    }

    const ArrayVisualization = ({ fullscreen = false }) => (
        <div className="mergesort-container">
            <div className="merge-stats">
                <div className="merge-stat">
                    <div className="merge-stat-label">Comparisons</div>
                    <div className="merge-stat-value">{stats.comparisons}</div>
                </div>
                <div className="merge-stat">
                    <div className="merge-stat-label">Merges</div>
                    <div className="merge-stat-value">{stats.merges}</div>
                </div>
                <div className="merge-stat">
                    <div className="merge-stat-label">Levels</div>
                    <div className="merge-stat-value">{stats.levels}</div>
                </div>
            </div>

            <div className="phase-indicator">
                <div className={`phase-badge ${currentPhase === "divide" ? "active" : ""}`}>📂 Divide Phase</div>
                <div className={`phase-badge ${currentPhase === "merge" ? "active" : ""}`}>🔗 Merge Phase</div>
                <div className={`phase-badge ${currentPhase === "complete" ? "active" : ""}`}>✅ Complete</div>
            </div>

            {currentLevel > 0 && (
                <div className="level-indicator">
                    <span>Current Recursion Level: {currentLevel}</span>
                </div>
            )}

            <div className="mergesort-visualization" style={{ height: fullscreen ? "50vh" : "400px" }}>
                {array.map((value, index) => (
                    <div
                        key={index}
                        className={`merge-bar ${comparingIndices.includes(index) ? "comparing" : ""} ${
                            sortedIndices.includes(index) ? "sorted" : ""
                        } ${currentPhase === "divide" ? "dividing" : ""} ${currentPhase === "merge" ? "merging" : ""}`}
                        style={{
                            height: `${(value / Math.max(...array)) * (fullscreen ? 40 : 30)}vh`,
                        }}
                    >
                        <span className="bar-value">{value}</span>
                    </div>
                ))}
            </div>

            {(mergingArrays.left.length > 0 || mergingArrays.right.length > 0) && (
                <div className="merge-arrays">
                    <div className="merge-array left-array">
                        <h4>Left Array</h4>
                        <div className="merge-elements">
                            {mergingArrays.left.map((val, idx) => (
                                <div key={idx} className="merge-element left">
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="merge-array right-array">
                        <h4>Right Array</h4>
                        <div className="merge-elements">
                            {mergingArrays.right.map((val, idx) => (
                                <div key={idx} className="merge-element right">
                                    {val}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {recursionTree.length > 0 && (
                <div className="recursion-tree">
                    <h4>Recursion Tree</h4>
                    <div className="tree-levels">
                        {Array.from({ length: stats.levels }, (_, level) => (
                            <div key={level} className="tree-level">
                                <div className="level-label">Level {level}</div>
                                <div className="level-nodes">
                                    {recursionTree
                                        .filter((node) => node.level === level)
                                        .map((node, idx) => (
                                            <div key={idx} className={`tree-node ${node.phase} ${level === currentLevel ? "current" : ""}`}>
                                                <div className="node-range">
                                                    [{node.range[0]}-{node.range[1]}]
                                                </div>
                                                <div className="node-array">[{node.array.join(", ")}]</div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div>
            <div className="algorithm-container">
                <div className="algorithm-header">
                    <h1>{algorithm?.name || "Merge Sort"}</h1>
                    <p className="algorithm-description">
                        {algorithm?.description ||
                            "Watch Merge Sort divide the array into smaller parts and then merge them back in sorted order"}
                    </p>
                </div>

                <div className="main-content">
                    {/* Main Visualization */}
                    <div className="visualization-card">
                        <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3"></path>
                            </svg>
                        </button>
                        <div className="card-header">
                            <h3>Merge Sort Visualization</h3>
                        </div>
                        <ArrayVisualization />
                    </div>

                    {/* Input Controls */}
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
                    </div>
                </div>

                <div className="control-panel">
                    <div className="control-group">
                        <label className="control-label">Animation Speed:</label>
                        <input
                            type="range"
                            min="300"
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
                        <button onClick={mergeSort} disabled={isAnimating} className="btn-primary animate-btn">
                            {isAnimating === true ? "Pause" : isAnimating === "pause" ? "Resume" : "Start Merge Sort"}
                        </button>
                        <button onClick={resetAnimation} disabled={isAnimating} className="btn-secondary">
                            Reset
                        </button>
                    </div>
                </div>

                <FullscreenModal isOpen={isFullscreen} onClose={() => setIsFullscreen(false)} title="Merge Sort - Fullscreen">
                    <ArrayVisualization fullscreen />
                </FullscreenModal>
            </div>
        </div>
    )
}
