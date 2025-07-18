"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import algorithms from "../../data/algorithms.json"
import ScrollProgress from "./ScrollProgress"

export default function Header({ isModalOpen = false }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleAlgorithmClick = (algorithmId) => {
        navigate(`/algorithm/${algorithmId}`)
        setIsDropdownOpen(false)
        setIsMobileMenuOpen(false)
    }

    const handleLogoClick = () => {
        navigate("/")
    }

    return (
        <>
            <header className={`header ${isModalOpen ? "header-hidden" : ""}`}>
                <div className="header-container">
                    <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                        <span className="logo-text">Algorithm Visualizer</span>
                    </div>

                    <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        ☰
                    </button>

                    <nav className={`nav ${isMobileMenuOpen ? "open" : ""}`}>
                        {/* Desktop dropdown - hidden when mobile menu is open */}
                        <div
                            className={`nav-item dropdown desktop-dropdown ${isMobileMenuOpen ? "hidden" : ""}`}
                            onMouseEnter={() => !isMobileMenuOpen && setIsDropdownOpen(true)}
                            onMouseLeave={() => !isMobileMenuOpen && setIsDropdownOpen(false)}
                        >
                            <button className="nav-link">Algorithms ▾</button>
                            <ul className={`dropdown-menu ${isDropdownOpen && !isMobileMenuOpen ? "open" : ""}`}>
                                {algorithms.map((algo) => (
                                    <li key={algo.id}>
                                        <div onClick={() => handleAlgorithmClick(algo.id)} className="dropdown-item">
                                            {algo.name}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mobile menu items - only show when mobile menu is open */}
                        {isMobileMenuOpen && (
                            <div className="mobile-menu-items">
                                {algorithms.map((algo) => (
                                    <div key={algo.id} onClick={() => handleAlgorithmClick(algo.id)} className="mobile-menu-item">
                                        {algo.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </nav>
                </div>
            </header>
            {location.pathname === "/" && <ScrollProgress />}
        </>
    )
}
