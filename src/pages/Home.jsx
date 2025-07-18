import HeroSection from "../components/HomeComp/HeroSection";
import InfoSection from "../components/HomeComp/InfoSection";
import AlgorithmSection from "../components/HomeComp/AlgorithmSection";
import ContactSection from "../components/HomeComp/ContactSection";
import "../styles/global.css";

export default function Home() {
    return (
        <>
            <HeroSection />
            <InfoSection />
            <AlgorithmSection />
            <ContactSection />
        </>
    );
}
