import React from 'react';
import algorithms from '../data/algorithms.json';
import AlgorithmCard from '../components/AlgorithmCard';

export default function Home() {
    return (
        <div className="container">
            <h1>Algorithm Visualizer</h1>
            <div className="algo-list">
                {algorithms.map((a) => (
                    <AlgorithmCard key={a.id} algo={a} />
                ))}
            </div>
        </div>
    );
}
