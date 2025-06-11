"use client"

import { useState } from "react"
import PythonCodeEvaluator from "../components/PythonCodeEvaluator"
import TreeInputPanel from "../components/TreeInputPanel"
import TreeVisualization from "../components/TreeVisualization"

export default function BinaryTreeTraversal() {
    const [tree, setTree] = useState(null)
    const [error, setError] = useState("")
    const [traversalType, setTraversalType] = useState("inorder")
    const [highlightedNodes, setHighlightedNodes] = useState([])
    const [isAnimating, setIsAnimating] = useState(false)
    const [speed, setSpeed] = useState(800)

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
        setHighlightedNodes([])

        const order = getTraversalOrder(tree, traversalType)

        for (let i = 0; i < order.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, speed))
            setHighlightedNodes((prev) => [...prev, order[i]])
        }

        setIsAnimating(false)
    }

    const resetAnimation = () => {
        setHighlightedNodes([])
        setIsAnimating(false)
    }

    return (
        <div className="algorithm-container">
            <div className="algorithm-header">
                <h1>Binary Tree Traversal</h1>
                <p className="algorithm-description">
                    Visualize different tree traversal algorithms: In-order, Pre-order, and Post-order
                </p>
            </div>

            {error && (
                <div className="error-banner">
                    <span className="error-icon">⚠️</span>
                    <span className="error-message">{error}</span>
                </div>
            )}

            <div className="main-content">
                <div className="left-panel">
                    <PythonCodeEvaluator onTreeGenerated={setTree} onError={setError} />

                    <TreeInputPanel tree={tree} onTreeUpdate={setTree} />
                </div>

                <div className="right-panel">
                    <TreeVisualization tree={tree} highlightedNodes={highlightedNodes} traversalType={traversalType} />
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
                    <button onClick={animateTraversal} disabled={!tree || isAnimating} className="btn-primary animate-btn">
                        {isAnimating ? "⏸️ Animating..." : "▶️ Start Animation"}
                    </button>

                    <button onClick={resetAnimation} disabled={!tree} className="btn-secondary">
                        🔄 Reset
                    </button>
                </div>
            </div>
        </div>
    )
}
