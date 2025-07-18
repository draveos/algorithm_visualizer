"use client"

import { useState } from "react"
import algorithms from "../../data/algorithms.json"
import ScrollProgress from "./ScrollProgress"

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <>
            <header className="header">
                <div className="header-container">
                    <div className="logo">
                        <span className="logo-text">Algorithm Visualizer</span>
                    </div>
                    <nav className="nav">
                        <div
                            className="nav-item dropdown"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <span className="nav-link">Algorithms</span>
                            <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
                                {algorithms.map((algo) => (
                                    <a key={algo.id} href={`#${algo.id}`} className="dropdown-item">
                                        {algo.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <ScrollProgress />
        </>
    )
}
