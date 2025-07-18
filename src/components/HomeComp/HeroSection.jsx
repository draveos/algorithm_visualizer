"use client"

import { useEffect, useRef } from "react"
import NeuralNetwork from "./NeuralNetwork"

export default function HeroSection() {
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in")
                    }
                })
            },
            { threshold: 0.1 },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="hero-section">
            <div className="neural-background">
                <NeuralNetwork />
            </div>
            <div className="hero-content">
                <h1 className="hero-title">
                    <span className="title-word">Algorithm</span>
                    <span className="title-word">Visualizer</span>
                </h1>
                <p className="hero-subtitle">Explore the beauty of algorithms through interactive visualization</p>
            </div>
        </section>
    )
}
