"use client"
import Header from "./components/HomeComp/Header"
import HeroSection from "./components/HomeComp/HeroSection"
import InfoSection from "./components/HomeComp/InfoSection"
import ContactSection from "./components/HomeComp/ContactSection"
import AlgorithmSection from "./components/HomeComp/AlgorithmSection"
import "./styles/global.css"

export default function App() {
    return (
        <div className="app">
            <Header />
            <main>
                <HeroSection />
                <InfoSection />
                <AlgorithmSection />
                <ContactSection />
            </main>
        </div>
    )
}
