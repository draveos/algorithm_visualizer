"use client"

import { useEffect, useRef, useState } from "react"
import algorithms from "../../data/algorithms.json"
import AlgorithmCard from "./AlgorithmCard"

export default function AlgorithmSection({ navigate }) {
    const sectionRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [cardsPerView, setCardsPerView] = useState(3)

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

        // Handle responsive cards per view
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCardsPerView(1)
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2)
            } else {
                setCardsPerView(3)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)

        return () => {
            observer.disconnect()
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + cardsPerView >= algorithms.length ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? Math.max(0, algorithms.length - cardsPerView) : prev - 1))
    }

    const visibleAlgorithms = algorithms.slice(currentIndex, currentIndex + cardsPerView)

    return (
        <section ref={sectionRef} className="algo-section">
            <div className="algo-container">
                <h2 className="section-title">Algorithm Gallery</h2>
                <div className="gallery-container">
                    <button className="gallery-arrow gallery-arrow-left" onClick={prevSlide} disabled={currentIndex === 0}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>

                    <div className="gallery-viewport">
                        <div
                            className="gallery-track"
                            style={{ transform: `translateX(-${(currentIndex * 100) / cardsPerView}%)` }}
                        >
                            {algorithms.map((algo, index) => (
                                <div key={algo.id} className="gallery-slide">
                                    <AlgorithmCard algo={algo} navigate={navigate} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        className="gallery-arrow gallery-arrow-right"
                        onClick={nextSlide}
                        disabled={currentIndex + cardsPerView >= algorithms.length}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </div>

                <div className="gallery-indicators">
                    {Array.from({ length: Math.ceil(algorithms.length / cardsPerView) }).map((_, index) => (
                        <button
                            key={index}
                            className={`gallery-indicator ${Math.floor(currentIndex / cardsPerView) === index ? "active" : ""}`}
                            onClick={() => setCurrentIndex(index * cardsPerView)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
