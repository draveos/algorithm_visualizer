import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AlgorithmPage from './pages/AlgorithmPage';

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithm/:id" element={<AlgorithmPage />} />
        </Routes>
    );
}
