"use client"

import { useRef, useEffect } from "react"
import * as d3 from "d3"

export default function TreeVisualization({ tree, highlightedNodes, traversalType }) {
    const svgRef = useRef(null)

    useEffect(() => {
        drawTree()
    }, [tree, highlightedNodes])

    const drawTree = () => {
        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        if (!tree) {
            // Show empty state
            svg
                .append("text")
                .attr("x", 400)
                .attr("y", 250)
                .attr("text-anchor", "middle")
                .attr("class", "empty-text")
                .text("No tree to visualize")
            return
        }

        const width = 800
        const height = 500
        const margin = { top: 40, right: 40, bottom: 40, left: 40 }

        // Convert tree to d3 hierarchy
        const root = d3.hierarchy(tree, (d) => {
            const children = []
            if (d.left) children.push(d.left)
            if (d.right) children.push(d.right)
            return children.length > 0 ? children : null
        })

        // Create tree layout
        const treeLayout = d3.tree().size([width - margin.left - margin.right, height - margin.top - margin.bottom])

        treeLayout(root)

        // Create main group
        const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`)

        // Draw links
        const links = g
            .selectAll(".link")
            .data(root.links())
            .enter()
            .append("path")
            .attr("class", "tree-link")
            .attr(
                "d",
                d3
                    .linkVertical()
                    .x((d) => d.x)
                    .y((d) => d.y),
            )

        // Draw nodes
        const nodes = g
            .selectAll(".node")
            .data(root.descendants())
            .enter()
            .append("g")
            .attr("class", "tree-node")
            .attr("transform", (d) => `translate(${d.x}, ${d.y})`)

        // Add circles for nodes
        nodes
            .append("circle")
            .attr("r", 25)
            .attr("class", (d) => {
                const isHighlighted = highlightedNodes.includes(d.data.val)
                return `node-circle ${isHighlighted ? "highlighted" : ""}`
            })
            .attr("id", (d) => `node-${d.data.val}`)

        // Add text labels
        nodes
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("class", "node-text")
            .text((d) => d.data.val)

        // Add traversal order indicators
        if (highlightedNodes.length > 0) {
            nodes
                .filter((d) => highlightedNodes.includes(d.data.val))
                .append("circle")
                .attr("r", 35)
                .attr("class", "order-indicator")
                .attr("fill", "none")
                .attr("stroke", "#f1f1f1")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")

            nodes
                .filter((d) => highlightedNodes.includes(d.data.val))
                .append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "-40")
                .attr("class", "order-text")
                .text((d) => highlightedNodes.indexOf(d.data.val) + 1)
        }
    }

    return (
        <div className="tree-visualization">
            <div className="visualization-header">
                <h3>Tree Visualization</h3>
                {traversalType && (
                    <div className="traversal-info">
                        <span className="traversal-type">{traversalType} Traversal</span>
                    </div>
                )}
            </div>

            <div className="svg-container">
                <svg ref={svgRef} width={800} height={500} className="tree-svg" />
            </div>

            {highlightedNodes.length > 0 && (
                <div className="traversal-sequence">
                    <h4>Traversal Order:</h4>
                    <div className="sequence">
                        {highlightedNodes.map((val, index) => (
                            <span key={index} className="sequence-item">
                {val}
                                {index < highlightedNodes.length - 1 && " → "}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
