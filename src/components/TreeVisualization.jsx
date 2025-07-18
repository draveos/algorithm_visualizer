"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function TreeVisualization({ tree, highlightedNodes = [], traversalType }) {
    const svgRef = useRef(null)
    const [treeStats, setTreeStats] = useState({ nodes: 0, height: 0, leaves: 0 })

    const calculateTreeStats = (root) => {
        if (!root) return { nodes: 0, height: 0, leaves: 0 }

        let nodeCount = 0
        let leafCount = 0

        const traverse = (node, depth = 0) => {
            if (!node) return depth - 1

            nodeCount++
            if (!node.left && !node.right) leafCount++

            const leftHeight = traverse(node.left, depth + 1)
            const rightHeight = traverse(node.right, depth + 1)
            return Math.max(leftHeight, rightHeight)
        }

        const height = traverse(root)
        return { nodes: nodeCount, height: height + 1, leaves: leafCount }
    }

    useEffect(() => {
        if (tree) {
            setTreeStats(calculateTreeStats(tree))
        }
    }, [tree])

    useEffect(() => {
        if (!tree || !svgRef.current) return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const width = 800
        const height = 500
        const margin = { top: 40, right: 40, bottom: 40, left: 40 }

        svg.attr("width", width).attr("height", height)

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

        // Create tree layout
        const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom])

        // Convert tree to d3 hierarchy
        const root = d3.hierarchy(tree, (d) => {
            const children = []
            if (d.left) children.push(d.left)
            if (d.right) children.push(d.right)
            return children.length > 0 ? children : null
        })

        const treeData = treeLayout(root)

        // Create links with elegant curves
        const link = g
            .selectAll(".tree-link")
            .data(treeData.links())
            .enter()
            .append("path")
            .attr("class", "tree-link")
            .attr("d", (d) => {
                const source = d.source
                const target = d.target
                return `M${source.x},${source.y}
                C${source.x},${(source.y + target.y) / 2}
                 ${target.x},${(source.y + target.y) / 2}
                 ${target.x},${target.y}`
            })

        // Create nodes
        const node = g
            .selectAll(".tree-node")
            .data(treeData.descendants())
            .enter()
            .append("g")
            .attr("class", "tree-node")
            .attr("transform", (d) => `translate(${d.x},${d.y})`)

        // Add circles for nodes
        node
            .append("circle")
            .attr("class", (d) => {
                const isHighlighted = highlightedNodes.includes(d.data.val)
                return `node-circle ${isHighlighted ? "highlighted" : ""}`
            })
            .attr("r", 20)

        // Add text labels
        node
            .append("text")
            .attr("class", (d) => {
                const isHighlighted = highlightedNodes.includes(d.data.val)
                return `node-text ${isHighlighted ? "highlighted" : ""}`
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text((d) => d.data.val)

        // Add traversal order indicators
        if (highlightedNodes.length > 0) {
            node.each(function (d) {
                const nodeValue = d.data.val
                const orderIndex = highlightedNodes.indexOf(nodeValue)

                if (orderIndex !== -1) {
                    const nodeGroup = d3.select(this)

                    // Add order indicator circle
                    nodeGroup.append("circle").attr("class", "order-indicator").attr("r", 30).attr("cx", 0).attr("cy", 0)

                    // Add order number
                    nodeGroup
                        .append("text")
                        .attr("class", "order-text")
                        .attr("x", 25)
                        .attr("y", -25)
                        .attr("text-anchor", "middle")
                        .text(orderIndex + 1)
                }
            })
        }

        // Update highlighted nodes with smooth transitions
        svg.selectAll(".node-circle").classed("highlighted", (d) => highlightedNodes.includes(d.data.val))
        svg.selectAll(".node-text").classed("highlighted", (d) => highlightedNodes.includes(d.data.val))
    }, [tree, highlightedNodes])

    if (!tree) {
        return (
            <div className="tree-visualization">
                <div className="visualization-header">
                    <h3>Tree Visualization</h3>
                </div>
                <div className="svg-container">
                    <div className="empty-state">
                        <div className="empty-icon">🌳</div>
                        <h3>No Tree to Display</h3>
                        <p>Create a tree using the Python evaluator or input panel to see the visualization.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="tree-visualization">
            <div className="visualization-header">
                <h3>Tree Visualization</h3>
                <div className="traversal-info">
                    <span className="traversal-type">{traversalType} Traversal</span>
                </div>
            </div>

            <div className="tree-stats">
                <div className="stat">
                    <span className="stat-label">Nodes</span>
                    <span className="stat-value">{treeStats.nodes}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Height</span>
                    <span className="stat-value">{treeStats.height}</span>
                </div>
                <div className="stat">
                    <span className="stat-label">Leaves</span>
                    <span className="stat-value">{treeStats.leaves}</span>
                </div>
            </div>

            <div className="svg-container">
                <svg ref={svgRef} className="tree-svg"></svg>
            </div>

            <div className="traversal-sequence">
                <h4>Traversal Sequence</h4>
                <div className="sequence">
                    {highlightedNodes.length > 0 ? (
                        highlightedNodes.map((value, index) => (
                            <span key={`${value}-${index}`} className="sequence-item">
                {value}
              </span>
                        ))
                    ) : (
                        <span style={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}>
              Start animation to see traversal sequence
            </span>
                    )}
                </div>
            </div>
        </div>
    )
}
