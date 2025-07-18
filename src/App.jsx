"use client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/HomeComp/Header";
import Home from "./pages/Home";
import AlgorithmPage from "./pages/AlgorithmPage";
import "./styles/global.css";

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <main className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/algorithm/:id" element={<AlgorithmPage />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}
