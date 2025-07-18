"use client"

import { useState } from "react"
import PythonCodeEvaluator from "../components/PythonCodeEvaluator"
import TreeInputPanel from "../components/TreeInputPanel"
import TreeVisualization from "../components/TreeVisualization"
import FullscreenModal from "../components/FullscreenModal"
import "../styles/BinaryTreeTraversal.css"

export default function BinaryTreeTraversal({ algorithm }) {
    const [tree, setTree] = useState(null)
    const [error, setError] = useState("")
    const [traversalType, setTraversalType] = useState("inorder")
    const [highlightedNodes, setHighlightedNodes] = useState([])
    const [isAnimating, setIsAnimating] = useState(false)
    const [speed, setSpeed] = useState(800)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    const getTraversalOrder = (root, type) => {
        const result = []

        const preorder = (node) => {
            if (!node) return
            result.push(node.val)
            preorder(node.left)
            preorder(node.right)
        }

        const inorder = (node) => {
            if (!node) return
            inorder(node.left)
            result.push(node.val)
            inorder(node.right)
        }

        const postorder = (node) => {
            if (!node) return
            postorder(node.left)
            postorder(node.right)
            result.push(node.val)
        }

        switch (type) {
            case "preorder":
                preorder(root)
                break
            case "inorder":
                inorder(root)
                break
            case "postorder":
                postorder(root)
                break
        }

        return result
    }

    const animateTraversal = async () => {
        if (!tree || isAnimating) return

        setIsAnimating(true)
        setIsPaused(false)
        setHighlightedNodes([])

        const order = getTraversalOrder(tree, traversalType)

        for (let i = 0; i < order.length; i++) {
            if (isPaused) {
                await new Promise((resolve) => {
                    const checkPause = () => {
                        if (!isPaused) {
                            resolve()
                        } else {
                            setTimeout(checkPause, 100)
                        }
                    }
                    checkPause()
                })
            }
            await new Promise((resolve) => setTimeout(resolve, speed))
            setHighlightedNodes((prev) => [...prev, order[i]])
        }

        setIsAnimating(false)
    }

    const pauseAnimation = () => {
        setIsPaused(true)
    }

    const resumeAnimation = () => {
        setIsPaused(false)
        animateTraversal()
    }

    const resetAnimation = () => {
        setHighlightedNodes([])
        setIsAnimating(false)
        setIsPaused(false)
    }

    return (
        <div>
            <div className="algorithm-container">
                <div className="algorithm-header">
                    <h1>{algorithm?.name || "Binary Tree Traversal"}</h1>
                    <p className="algorithm-description">
                        {algorithm?.description ||
                            "Visualize different tree traversal algorithms: In-order, Pre-order, and Post-order"}
                    </p>
                </div>

                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        <span className="error-message">{error}</span>
                    </div>
                )}

                <div className="main-content">
                    {/* Main Visualization */}
                    <div className="visualization-card tree-visualization">
                        <button className="fullscreen-btn" onClick={() => setIsFullscreen(true)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                        </button>
                        <div className="card-header">
                            <h3>Tree Visualization</h3>
                            <div className="traversal-info">
                                <span className="traversal-type">{traversalType} Traversal</span>
                            </div>
                        </div>
                        <TreeVisualization tree={tree} highlightedNodes={highlightedNodes} traversalType={traversalType} />
                    </div>

                    {/* Input Controls */}
                    <div className="input-controls">
                        <div className="algorithm-card">
                            <div className="card-header">
                                <h3>Python Code Evaluator</h3>
                            </div>
                            <PythonCodeEvaluator onTreeGenerated={setTree} onError={setError} />
                        </div>

                        <div className="algorithm-card">
                            <div className="card-header">
                                <h3>Tree Input Panel</h3>
                            </div>
                            <TreeInputPanel tree={tree} onTreeUpdate={setTree} />
                        </div>
                    </div>
                </div>

                <div className="control-panel">
                    <div className="control-group">
                        <label className="control-label">Traversal Type:</label>
                        <select
                            value={traversalType}
                            onChange={(e) => setTraversalType(e.target.value)}
                            className="control-select"
                            disabled={isAnimating}
                        >
                            <option value="inorder">In-Order (Left → Root → Right)</option>
                            <option value="preorder">Pre-Order (Root → Left → Right)</option>
                            <option value="postorder">Post-Order (Left → Right → Root)</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label className="control-label">Animation Speed:</label>
                        <input
                            type="range"
                            min="200"
                            max="2000"
                            step="100"
                            value={speed}
                            onChange={(e) => setSpeed(Number.parseInt(e.target.value))}
                            className="control-slider"
                            disabled={isAnimating}
                        />
                        <span className="speed-value">{speed}ms</span>
                    </div>

                    <div className="control-buttons">
                        {isAnimating ? (
                            isPaused ? (
                                <button onClick={resumeAnimation} className="btn-primary animate-btn">
                                    Resume
                                </button>
                            ) : (
                                <button onClick={pauseAnimation} disabled={!tree || !isAnimating} className="btn-primary animate-btn">
                                    Pause
                                </button>
                            )
                        ) : (
                            <button onClick={animateTraversal} disabled={!tree || isAnimating} className="btn-primary animate-btn">
                                Start Animation
                            </button>
                        )}
                        <button onClick={resetAnimation} disabled={!tree} className="btn-secondary">
                            🔄 Reset
                        </button>
                    </div>
                </div>

                <FullscreenModal
                    isOpen={isFullscreen}
                    onClose={() => setIsFullscreen(false)}
                    title="Tree Visualization - Fullscreen"
                >
                    <div style={{ height: "calc(100% - 60px)" }}>
                        <TreeVisualization
                            tree={tree}
                            highlightedNodes={highlightedNodes}
                            traversalType={traversalType}
                            fullscreen
                        />
                    </div>
                </FullscreenModal>
            </div>
        </div>
    )
}
