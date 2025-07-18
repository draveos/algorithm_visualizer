"use client"

import { useState, useEffect } from "react"

export default function ScrollProgress() {
    const [scrollProgress, setScrollProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight
            const winHeight = window.innerHeight
            const totalScrollable = docHeight - winHeight

            const progress = totalScrollable > 0 ? (scrollTop / totalScrollable) * 100 : 0
            setScrollProgress(Math.min(100, Math.max(0, progress)))
        }

        // Initial calculation
        handleScroll()

        // Add scroll listener with throttling for smooth performance
        let ticking = false
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener("scroll", throttledScroll, { passive: true })
        window.addEventListener("resize", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", throttledScroll)
            window.removeEventListener("resize", handleScroll)
        }
    }, [])

    return (
        <div className="scroll-progress-container">
            <div
                className="scroll-progress-bar"
                style={{
                    width: `${scrollProgress}%`,
                    transition: "width 0.01s ease-out",
                }}
            />
        </div>
    )
}
