"use client"

import { Suspense, lazy } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../components/HomeComp/Header"
import algorithms from "../data/algorithms.json"
import "../styles/algorithm-page.css"

// Lazy load algorithm components
const BinaryTreeTraversal = lazy(() => import("../algorithms/BinaryTreeTraversal"))
const BubbleSort = lazy(() => import("../algorithms/BubbleSort"))
const QuickSort = lazy(() => import("../algorithms/QuickSort"))
const BinarySearch = lazy(() => import("../algorithms/BinarySearch"))
const Dijkstra = lazy(() => import("../algorithms/Dijkstra"))
const MergeSort = lazy(() => import("../algorithms/MergeSort"))

const algorithmComponents = {
    "binary-search": BinarySearch,
    "bubble-sort": BubbleSort,
    "quick-sort": QuickSort,
    "merge-sort": MergeSort,
    dijkstra: Dijkstra,
    dfs: BinaryTreeTraversal,
}

function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="algorithm-container">
            <div className="error-state">
                <div className="error-icon">🔍</div>
                <h2>Algorithm Not Found</h2>
                <p>The algorithm you're looking for doesn't exist or has been moved.</p>
                <button onClick={() => navigate("/")} className="btn-primary">
                    Back to Home
                </button>
            </div>
        </div>
    )
}

function LoadingFallback({ algorithmName }) {
    return (
        <div className="algorithm-container">
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <h3>Loading {algorithmName}...</h3>
                <p>Preparing visualization components</p>
            </div>
        </div>
    )
}

export default function AlgorithmPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const algorithm = algorithms.find((algo) => algo.id === id)

    if (!algorithm) {
        return (
            <main className="algorithm-page-wrapper">
                <Header />
                <NotFound />
            </main>
        )
    }

    const Component = algorithmComponents[id] || BinaryTreeTraversal

    return (
        <main className="algorithm-page-wrapper">
            <Header />
            <Suspense fallback={<LoadingFallback algorithmName={algorithm.name} />}>
                <Component algorithm={algorithm} />
            </Suspense>
        </main>
    )
}
