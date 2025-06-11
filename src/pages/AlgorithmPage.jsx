"use client"

import { Suspense, lazy } from "react"
import { useParams } from "react-router-dom"
import algorithms from "../data/algorithms.json"
import "../styles/algorithm-page.css"

export default function AlgorithmPage() {
    const { id } = useParams()
    const meta = algorithms.find((a) => a.id === id)

    if (!meta) {
        return (
            <div className="algorithm-container">
                <div className="error-state">
                    <div className="error-icon">🔍</div>
                    <h2>Algorithm Not Found</h2>
                    <p>The requested algorithm could not be found.</p>
                    <button className="btn-primary" onClick={() => window.history.back()}>
                        ← Go Back
                    </button>
                </div>
            </div>
        )
    }

    const Component = lazy(() => import(`../algorithms/${meta.component}.jsx`))

    return (
        <div className="algorithm-page-wrapper">
            <Suspense
                fallback={
                    <div className="algorithm-container">
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <h2>Loading Algorithm...</h2>
                            <p>Preparing {meta.name} visualization</p>
                        </div>
                    </div>
                }
            >
                <Component />
            </Suspense>
        </div>
    )
}
