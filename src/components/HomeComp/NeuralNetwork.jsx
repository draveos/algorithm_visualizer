"use client"

import { useEffect, useRef } from "react"

export default function NeuralNetwork() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const nodes = []
        const connections = []

        // Create nodes
        for (let i = 0; i < 200; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            })
        }

        // Connect every node to every other node
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                connections.push({ from: i, to: j })
            }
        }

        let animationId

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update nodes with wave motion
            nodes.forEach((node, index) => {
                node.y += Math.sin(Date.now() * 0.001 + index * 0.1) * 0.3
                node.x += node.vx
                node.y += node.vy

                // Bounce off edges
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1
            })

            // Draw connections with distance-based opacity
            connections.forEach((conn) => {
                const from = nodes[conn.from]
                const to = nodes[conn.to]

                // Calculate distance for opacity
                const dx = from.x - to.x
                const dy = from.y - to.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                const maxDistance = 250
                const opacity = Math.max(0, (maxDistance - distance) / maxDistance) * 0.3

                if (opacity > 0) {
                    ctx.strokeStyle = `rgba(91, 200, 175, ${opacity})`
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(from.x, from.y)
                    ctx.lineTo(to.x, to.y)
                    ctx.stroke()
                }
            })

            // Draw nodes
            nodes.forEach((node) => {
                ctx.beginPath()
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
                ctx.fillStyle = "#86efa4"
                ctx.fill()

                // Add glow effect
                ctx.shadowColor = "#96f3dd"
                ctx.shadowBlur = 100
                ctx.fill()
                ctx.shadowBlur = 0
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener("resize", handleResize)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} className="neural-canvas" />
}
