"use client"

import { useState, useRef } from "react"
import FullscreenModal from "../components/FullscreenModal"
import "../styles/Dijkstra.css"

export default function Dijkstra({ algorithm }) {
    const svgRef = useRef(null)
    const [animationState, setAnimationState] = useState("idle") // idle, running, paused, completed
    const [speed, setSpeed] = useState(1000)
    const [startNode, setStartNode] = useState("A")
    const [targetNode, setTargetNode] = useState("F")
    const [currentNode, setCurrentNode] = useState("")
    const [visitedNodes, setVisitedNodes] = useState([])
    const [distances, setDistances] = useState({})
    const [shortestPath, setShortestPath] = useState([])
    const [activeEdges, setActiveEdges] = useState([])
    const [animatingEdges, setAnimatingEdges] = useState([])
    const [stats, setStats] = useState({ visited: 0, totalDistance: 0, steps: 0 })
    const [isFullscreen, setIsFullscreen] = useState(false)
    const animationRef = useRef(null)
    const [isPaused, setIsPaused] = useState(false)

    // Sample graph data
    const graph = {
        nodes: [
            { id: "A", x: 100, y: 100 },
            { id: "B", x: 250, y: 80 },
            { id: "C", x: 400, y: 120 },
            { id: "D", x: 150, y: 250 },
            { id: "E", x: 300, y: 280 },
            { id: "F", x: 450, y: 250 },
        ],
        edges: [
            { from: "A", to: "B", weight: 4 },
            { from: "A", to: "D", weight: 2 },
            { from: "B", to: "C", weight: 3 },
            { from: "B", to: "D", weight: 1 },
            { from: "B", to: "E", weight: 7 },
            { from: "C", to: "F", weight: 2 },
            { from: "D", to: "E", weight: 3 },
            { from: "E", to: "F", weight: 1 },
        ],
    }

    const resetAnimation = () => {
        setAnimationState("idle")
        setCurrentNode("")
        setVisitedNodes([])
        setDistances({})
        setShortestPath([])
        setActiveEdges([])
        setAnimatingEdges([])
        setStats({ visited: 0, totalDistance: 0, steps: 0 })
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

    const animateEdge = async (fromNode, toNode) => {
        const edgeKey = `${fromNode}-${toNode}`
        setAnimatingEdges([edgeKey])
        await sleep(speed / 2)
        setAnimatingEdges([])
    }

    const dijkstraAlgorithm = async () => {
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

        // Initialize distances
        const dist = {}
        const previous = {}
        const unvisited = new Set()

        graph.nodes.forEach((node) => {
            dist[node.id] = node.id === startNode ? 0 : Number.POSITIVE_INFINITY
            previous[node.id] = null
            unvisited.add(node.id)
        })

        setDistances({ ...dist })
        await sleep(speed)

        let steps = 0

        while (unvisited.size > 0 && !isPaused) {
            // Find unvisited node with minimum distance
            let current = null
            let minDist = Number.POSITIVE_INFINITY

            for (const node of unvisited) {
                if (dist[node] < minDist) {
                    minDist = dist[node]
                    current = node
                }
            }

            if (current === null || dist[current] === Number.POSITIVE_INFINITY) break

            setCurrentNode(current)
            steps++
            setStats((prev) => ({ ...prev, steps }))

            await sleep(speed)

            // Get neighbors
            const neighbors = graph.edges.filter((edge) => edge.from === current || edge.to === current)

            for (const edge of neighbors) {
                if (isPaused) break

                const neighbor = edge.from === current ? edge.to : edge.from
                if (!unvisited.has(neighbor)) continue

                // Animate edge exploration
                await animateEdge(current, neighbor)
                setActiveEdges([`${current}-${neighbor}`])
                await sleep(speed / 2)

                const alt = dist[current] + edge.weight
                if (alt < dist[neighbor]) {
                    dist[neighbor] = alt
                    previous[neighbor] = current
                    setDistances({ ...dist })
                }

                await sleep(speed / 2)
            }

            unvisited.delete(current)
            setVisitedNodes((prev) => [...prev, current])
            setActiveEdges([])
            setStats((prev) => ({ ...prev, visited: prev.visited + 1 }))

            if (current === targetNode) break

            await sleep(speed / 2)
        }

        if (!isPaused) {
            // Reconstruct shortest path
            const path = []
            let current = targetNode
            while (current !== null) {
                path.unshift(current)
                current = previous[current]
            }

            if (path[0] === startNode) {
                setShortestPath(path)
                setStats((prev) => ({ ...prev, totalDistance: dist[targetNode] }))
            }

            setCurrentNode("")
            setAnimationState("completed")
        }
    }

    const getNodeClass = (nodeId) => {
        if (nodeId === startNode) return "start"
        if (nodeId === targetNode) return "target"
        if (currentNode === nodeId) return "current"
        if (visitedNodes.includes(nodeId)) return "visited"
        return ""
    }

    const getEdgeClass = (edge) => {
        const edgeKey1 = `${edge.from}-${edge.to}`
        const edgeKey2 = `${edge.to}-${edge.from}`

        if (animatingEdges.includes(edgeKey1) || animatingEdges.includes(edgeKey2)) return "animating"
        if (activeEdges.includes(edgeKey1) || activeEdges.includes(edgeKey2)) return "active"

        // Check if edge is part of shortest path
        for (let i = 0; i < shortestPath.length - 1; i++) {
            const pathEdge1 = `${shortestPath[i]}-${shortestPath[i + 1]}`
            const pathEdge2 = `${shortestPath[i + 1]}-${shortestPath[i]}`
            if (edgeKey1 === pathEdge1 || edgeKey1 === pathEdge2) return "shortest-path"
        }

        return ""
    }

    const getButtonText = () => {
        switch (animationState) {
            case "running":
                return "Pause"
            case "paused":
                return "Resume"
            case "completed":
                return "Start Dijkstra"
            default:
                return "Start Dijkstra"
        }
    }

    const GraphVisualization = ({ fullscreen = false }) => (
        <div className="dijkstra-container">
            <div className="dijkstra-stats">
                <div className="dijkstra-stat">
                    <div className="dijkstra-stat-label">Visited Nodes</div>
                    <div className="dijkstra-stat-value">{stats.visited}</div>
                </div>
                <div className="dijkstra-stat">
                    <div className="dijkstra-stat-label">Steps</div>
                    <div className="dijkstra-stat-value">{stats.steps}</div>
                </div>
                <div className="dijkstra-stat">
                    <div className="dijkstra-stat-label">Shortest Distance</div>
                    <div className="dijkstra-stat-value">{stats.totalDistance || "∞"}</div>
                </div>
            </div>

            <div className="graph-visualization" style={{ height: fullscreen ? "60vh" : "600px" }}>
                <svg ref={svgRef} className="graph-svg" viewBox="0 0 550 350">
                    <defs>
                        <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
                            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.8)" />
                        </linearGradient>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.4)" />
                            <stop offset="100%" stopColor="rgba(255, 215, 0, 1)" />
                        </linearGradient>
                    </defs>

                    {/* Render edges */}
                    {graph.edges.map((edge, index) => {
                        const fromNode = graph.nodes.find((n) => n.id === edge.from)
                        const toNode = graph.nodes.find((n) => n.id === edge.to)
                        const midX = (fromNode.x + toNode.x) / 2
                        const midY = (fromNode.y + toNode.y) / 2
                        const edgeClass = getEdgeClass(edge)

                        return (
                            <g key={index}>
                                <line
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    className={`graph-edge ${edgeClass}`}
                                    stroke={edgeClass === "shortest-path" ? "url(#pathGradient)" : undefined}
                                />
                                <text x={midX} y={midY - 5} className="edge-weight">
                                    {edge.weight}
                                </text>
                            </g>
                        )
                    })}

                    {/* Render nodes */}
                    {graph.nodes.map((node) => (
                        <g key={node.id} className="graph-node">
                            <circle cx={node.x} cy={node.y} r={25} className={`node-circle ${getNodeClass(node.id)}`} />
                            <text x={node.x} y={node.y} className="node-label">
                                {node.id}
                            </text>
                            {distances[node.id] !== undefined && distances[node.id] !== Number.POSITIVE_INFINITY && (
                                <text x={node.x} y={node.y + 40} className="node-distance">
                                    {distances[node.id]}
                                </text>
                            )}
                        </g>
                    ))}
                </svg>
            </div>

            <div className="distance-table">
                <h4>Distance Table</h4>
                <div className="distance-grid">
                    {graph.nodes.map((node) => (
                        <div
                            key={node.id}
                            className={`distance-item ${currentNode === node.id ? "current" : ""} ${
                                visitedNodes.includes(node.id) ? "visited" : ""
                            }`}
                        >
                            <div>{node.id}</div>
                            <div>{distances[node.id] === Number.POSITIVE_INFINITY ? "∞" : distances[node.id] || "∞"}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="algorithm-container">
            <div className="algorithm-header">
                <h1>{algorithm?.name || "Dijkstra's Algorithm"}</h1>
                <p className="algorithm-description">
                    {algorithm?.description ||
                        "Watch Dijkstra's algorithm find the shortest path between nodes in a weighted graph"}
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
                        <h3>Dijkstra's Visualization</h3>
                    </div>
                    <GraphVisualization />
                </div>

                {/* Input Controls */}
                <div className="input-controls">
                    <div className="algorithm-card">
                        <div className="card-header">
                            <h3>Graph Configuration</h3>
                        </div>
                        <div className="node-selector">
                            <label>Start Node:</label>
                            <select
                                value={startNode}
                                onChange={(e) => setStartNode(e.target.value)}
                                className="node-select"
                                disabled={animationState === "running"}
                            >
                                {graph.nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.id}
                                    </option>
                                ))}
                            </select>
                            <label>Target Node:</label>
                            <select
                                value={targetNode}
                                onChange={(e) => setTargetNode(e.target.value)}
                                className="node-select"
                                disabled={animationState === "running"}
                            >
                                {graph.nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.id}
                                    </option>
                                ))}
                            </select>
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
                    <button onClick={dijkstraAlgorithm} className="btn-primary animate-btn">
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
                title="Dijkstra's Algorithm - Fullscreen"
            >
                <GraphVisualization fullscreen />
            </FullscreenModal>
        </div>
    )
}
