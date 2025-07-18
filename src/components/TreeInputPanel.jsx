"use client"

import { useState, useEffect } from "react"

export default function TreeInputPanel({ tree, onTreeUpdate }) {
    const [nodeValues, setNodeValues] = useState(new Map())

    useEffect(() => {
        if (tree) {
            const values = new Map()
            collectNodeValues(tree, "", values)
            setNodeValues(values)
        }
    }, [tree])

    const collectNodeValues = (node, path, values) => {
        if (!node) return
        values.set(path || "root", node.val)
        if (node.left) {
            collectNodeValues(node.left, path ? `${path}.left` : "left", values)
        }
        if (node.right) {
            collectNodeValues(node.right, path ? `${path}.right` : "right", values)
        }
    }

    const updateNodeValue = (path, newValue) => {
        if (!tree) return
        const newTree = JSON.parse(JSON.stringify(tree))
        updateTreeNode(newTree, path, newValue)
        onTreeUpdate(newTree)
    }

    const updateTreeNode = (node, path, newValue) => {
        if (path === "root" || path === "") {
            node.val = newValue
            return
        }
        const parts = path.split(".")
        let current = node
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i]
            if (part === "left" && current.left) {
                current = current.left
            } else if (part === "right" && current.right) {
                current = current.right
            }
        }
        const lastPart = parts[parts.length - 1]
        if (lastPart === "left" && current.left) {
            current.left.val = newValue
        } else if (lastPart === "right" && current.right) {
            current.right.val = newValue
        } else if (parts.length === 1) {
            if (lastPart === "left" && current.left) {
                current.left.val = newValue
            } else if (lastPart === "right" && current.right) {
                current.right.val = newValue
            }
        }
    }

    const getNodeCount = () => {
        if (!tree) return 0
        const count = (node) => {
            if (!node) return 0
            return 1 + count(node.left) + count(node.right)
        }
        return count(tree)
    }

    const getTreeHeight = () => {
        if (!tree) return 0
        const height = (node) => {
            if (!node) return 0
            return 1 + Math.max(height(node.left), height(node.right))
        }
        return height(tree)
    }

    if (!tree) {
        return (
            <div className="empty-state">
                <div className="empty-icon">🌳</div>
                <h3>No Tree Loaded</h3>
                <p>Evaluate your Python code to start editing node values</p>
            </div>
        )
    }

    return (
        <div>
            <div className="card-header">
                <h3>Tree Properties</h3>
                <div className="tree-stats" style={{ display: "flex", gap: "1rem" }}>
                    <div className="stat">
                        <span className="stat-label">Nodes:</span>
                        <span className="stat-value">{getNodeCount()}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label">Height:</span>
                        <span className="stat-value">{getTreeHeight()}</span>
                    </div>
                </div>
            </div>

            <div className="node-inputs" style={{ marginTop: "1rem" }}>
                <h4>Edit Node Values</h4>
                <div className="input-grid" style={{ maxHeight: "250px", overflowY: "auto" }}>
                    {Array.from(nodeValues.entries()).map(([path, value]) => (
                        <div key={path} className="input-group">
                            <label className="input-label">{path === "root" ? "Root" : path.replace(/\./g, " → ")}</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => {
                                    const newValue = Number.parseInt(e.target.value) || 0
                                    setNodeValues((prev) => new Map(prev.set(path, newValue)))
                                    updateNodeValue(path, newValue)
                                }}
                                className="node-input"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
