import React from 'react';
import { Link } from 'react-router-dom';

export default function AlgorithmCard({ algo }) {
    return (
        <Link to={`/algorithm/${algo.id}`} className="algo-card">
            <h3>{algo.name}</h3>
            <p>{algo.description}</p>
        </Link>
    );
}
