"use client"

import { useState, useRef } from "react"
import FullscreenModal from "./FullscreenModal"
import "../styles/BinarySearch.css"


export default function BinarySearch({ algorithm }) {
    const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25])
    const [target, setTarget] = useState(13)
    const [speed, setSpeed] = useState(1000)
    const [currentStep, setCurrentStep] = useState({ left: 0, right: 0, middle: 0 })
    const [eliminatedIndices, setEliminatedIndices] = useState({ left: [], right: [] })
    const [middleIndex, setMiddleIndex] = useState(-1)
    const [foundIndex, setFoundIndex] = useState(-1)
    const [notFound, setNotFound] = useState(false)
    const [stats, setStats] = useState({ comparisons: 0, steps: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [inputValue, setInputValue] = useState("1,3,5,7,9,11,13,15,17,19,21,23,25")

    const [animationState, setAnimationState] = useState("idle")
    const animationRef = useRef(null)
    const [isPaused, setIsPaused] = useState(false)

    const generateSortedArray = () => {
        const length = 10 + Math.floor(Math.random() * 5)
        const newArray = Array.from({ length }, (_, i) => (i + 1) * 2 + Math.floor(Math.random() * 3)).sort((a, b) => a - b)
        setArray(newArray)
        setInputValue(newArray.join(","))
        setTarget(newArray[Math.floor(Math.random() * newArray.length)])
        resetAnimation()
    }

    const handleInputChange = (value) => {
        setInputValue(value)
        try {
            const newArray = value
                .split(",")
                .map((num) => Number.parseInt(num.trim()))
                .filter((num) => !isNaN(num))
                .sort((a, b) => a - b)
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
        setCurrentStep({ left: 0, right: array.length - 1, middle: 0 })
        setEliminatedIndices({ left: [], right: [] })
        setMiddleIndex(-1)
        setFoundIndex(-1)
        setNotFound(false)
        setStats({ comparisons: 0, steps: 0 })
        setIsPaused(false)
        if (animationRef.current) {
            clearTimeout(animationRef.current)
        }
    }

    const sleep = (ms) => {
        return new Promise((resolve) => {
            if (isPaused) return
            animationRef.current = setTimeout(resolve, ms)
        })
    }

    const binarySearch = async () => {
        if (animationState === "running") {
            setIsPaused(true)
            setAnimationState("paused")
            return
        }

        if (animationState === "paused") {
            setIsPaused(false)
            setAnimationState("running")
            return
        }

        setAnimationState("running")
        resetAnimation()

        let left = 0
        let right = array.length - 1
        let comparisons = 0
        let steps = 0

        while (left <= right && !isPaused) {
            steps++
            const middle = Math.floor((left + right) / 2)

            setCurrentStep({ left, right, middle })
            setMiddleIndex(middle)
            setStats({ comparisons, steps })

            await sleep(speed)

            comparisons++
            setStats({ comparisons, steps })

            if (array[middle] === target) {
                setFoundIndex(middle)
                setAnimationState("completed")
                return
            }

            await sleep(speed / 2)

            if (array[middle] < target) {
                const leftIndices = Array.from({ length: middle - left + 1 }, (_, i) => left + i)
                setEliminatedIndices((prev) => ({ ...prev, left: [...prev.left, ...leftIndices] }))
                left = middle + 1
            } else {
                const rightIndices = Array.from({ length: right - middle + 1 }, (_, i) => middle + i)
                setEliminatedIndices((prev) => ({ ...prev, right: [...prev.right, ...rightIndices] }))
                right = middle - 1
            }

            setMiddleIndex(-1)
            await sleep(speed / 2)
        }

        if (!isPaused) {
            setNotFound(true)
            setAnimationState("completed")
        }
    }

    const getElementClass = (index) => {
        if (foundIndex === index) return "found"
        if (notFound && middleIndex === index) return "not-found"
        if (middleIndex === index) return "middle"
        if (eliminatedIndices.left.includes(index)) return "left-half"
        if (eliminatedIndices.right.includes(index)) return "right-half"
        return ""
    }

    const SearchVisualization = ({ fullscreen = false }) => (
        <div className="binary-search-container">
            <div className="search-steps">
                <div className={`search-step ${animationState === "running" ? "active" : ""}`}>
                    <div className="step-label">Left</div>
                    <div className="step-value">{currentStep.left}</div>
                </div>
                <div className={`search-step ${animationState === "running" ? "active" : ""}`}>
                    <div className="step-label">Middle</div>
                    <div className="step-value">{currentStep.middle}</div>
                </div>
                <div className={`search-step ${animationState === "running" ? "active" : ""}`}>
                    <div className="step-label">Right</div>
                    <div className="step-value">{currentStep.right}</div>
                </div>
                <div className="search-step">
                    <div className="step-label">Target</div>
                    <div className="step-value">{target}</div>
                </div>
            </div>

            <div className="search-visualization" style={{ height: fullscreen ? "60vh" : "600px" }}>
                <div className="search-array">
                    {array.map((value, index) => (
                        <div key={index} className={`search-element ${getElementClass(index)}`}>
                            {value}
                        </div>
                    ))}
                </div>
            </div>

            <div className="search-info">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <strong>Comparisons:</strong> {stats.comparisons}
                    </div>
                    <div>
                        <strong>Steps:</strong> {stats.steps}
                    </div>
                    <div>
                        <strong>Status:</strong>{" "}
                        {foundIndex !== -1 ? (
                            <span style={{ color: "rgba(16, 185, 129, 0.9)" }}>Found at index {foundIndex}</span>
                        ) : notFound ? (
                            <span style={{ color: "rgba(239, 68, 68, 0.9)" }}>Not found</span>
                        ) : (
                            <span style={{ color: "rgba(59, 130, 246, 0.9)" }}>Searching...</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )

    const getButtonText = () => {
        switch (animationState) {
            case "running":
                return "Pause"
            case "paused":
                return "Resume"
            case "completed":
                return "Start Search"
            default:
                return "Start Search"
        }
    }

    return (
        <div>
            <div className="algorithm-container">
                <div className="algorithm-header">
                    <h1>{algorithm?.name || "Binary Search"}</h1>
                    <p className="algorithm-description">
                        {algorithm?.description ||
                            "Watch Binary Search efficiently find elements by repeatedly dividing the search space in half"}
                    </p>
                </div>

                <div className="main-content">
                    {/* Main Visualization */}
                    <div className="visualization-card">
                        <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                        </button>
                        <div className="card-header">
                            <h3>Binary Search Visualization</h3>
                        </div>
                        <SearchVisualization />
                    </div>

                    {/* Input Controls */}
                    <div className="input-controls">
                        <div className="algorithm-card">
                            <div className="card-header">
                                <h3>Search Configuration</h3>
                            </div>
                            <div className="search-input-section">
                                <label className="input-label">Array (sorted):</label>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="Enter sorted numbers"
                                    disabled={animationState === "running"}
                                    className="search-input-field"
                                />
                            </div>
                            <div className="search-input-section">
                                <label className="input-label">Target:</label>
                                <input
                                    type="number"
                                    value={target}
                                    onChange={(e) => setTarget(Number.parseInt(e.target.value) || 0)}
                                    className="search-input-field target-input"
                                    disabled={animationState === "running"}
                                />
                                <button className="generate-btn" onClick={generateSortedArray} disabled={animationState === "running"}>
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
                            min="500"
                            max="2000"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
                            className="control-slider"
                            disabled={animationState === "running"}
                        />
                        <span className="speed-value">{speed}ms</span>
                    </div>

                    <div className="control-buttons">
                        <button
                            onClick={binarySearch}
                            disabled={animationState === "running" && animationState !== "paused"}
                            className="btn-primary animate-btn"
                        >
                            {getButtonText()}
                        </button>
                        <button onClick={resetAnimation} disabled={animationState === "running"} className="btn-secondary">
                            Reset
                        </button>
                    </div>
                </div>

                <FullscreenModal
                    isOpen={isFullscreen}
                    onClose={() => setIsFullscreen(false)}
                    title="Binary Search - Fullscreen"
                >
                    <SearchVisualization fullscreen />
                </FullscreenModal>
            </div>
        </div>
    )
}
