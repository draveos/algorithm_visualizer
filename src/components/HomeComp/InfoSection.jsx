"use client"

import { useEffect, useRef, useState } from "react"

export default function InfoSection() {
    const sectionRef = useRef(null)
    const circleRef = useRef(null)
    const [glowingBalls, setGlowingBalls] = useState([])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-in")
                        if (circleRef.current) {
                            circleRef.current.classList.add("animate-circle")
                        }
                        createPermanentGlowingBalls()
                    }
                })
            },
            { threshold: 0.3 },
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const createPermanentGlowingBalls = () => {
        const balls = []
        for (let i = 0; i < 70; i++) {
            balls.push({
                id: i,
                x: 20 + Math.random() * 60, // 20% to 80% of container width
                y: 20 + Math.random() * 60, // 20% to 80% of container height
                size: 2 + Math.random() * 6, // 8-14px
                delay: Math.random(),
                duration: 6 + Math.random() * 4, // 6-10 seconds
            })
        }
        setGlowingBalls(balls)
    }

    return (
        <section ref={sectionRef} className="info-section">
            <div className="info-container">
                <div className="mystical-effects">
                    {glowingBalls.map((ball) => (
                        <div
                            key={ball.id}
                            className="permanent-glowing-ball"
                            style={{
                                left: `${ball.x}%`,
                                top: `${ball.y}%`,
                                width: `${ball.size}px`,
                                height: `${ball.size}px`,
                                animationDelay: `${ball.delay}s`,
                                animationDuration: `${ball.duration}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="info-circle" ref={circleRef}>
                    <div className="circle-inner">
                        <span className="info-icon">?</span>
                    </div>
                </div>
                <div className="info-content">
                    <h2 className="info-title">About This Site</h2>
                    <p className="info-text">
                        This site is a simple site that contains some of simple algorithms. Feel free to explore!
                    </p>
                </div>
            </div>
        </section>
    )
}
