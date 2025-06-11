"use client"

import { useState } from "react"

export default function PythonCodeEvaluator({ onTreeGenerated, onError }) {
    const [code, setCode] = useState(`TreeNode(74,
  left=TreeNode(53,
    left=TreeNode(36, left=TreeNode(22), right=TreeNode(44)),
    right=TreeNode(59, left=TreeNode(58), right=TreeNode(66))
  ),
  right=TreeNode(81,
    left=TreeNode(79),
    right=TreeNode(86, left=TreeNode(84), right=TreeNode(89))
  )
)`)

    const parseTree = (input) => {
        let pos = 0

        const skip = () => {
            while (pos < input.length && /\s/.test(input[pos])) pos++
        }

        const match = (str) => {
            skip()
            if (input.slice(pos, pos + str.length) === str) {
                pos += str.length
                return true
            }
            return false
        }

        const parseNumber = () => {
            skip()
            const start = pos
            let isNegative = false

            if (input[pos] === "-") {
                isNegative = true
                pos++
            }

            while (pos < input.length && /\d/.test(input[pos])) pos++

            if (start === pos || (isNegative && start + 1 === pos)) {
                throw new Error("Expected number")
            }

            return Number.parseInt(input.slice(start, pos))
        }

        const parseNode = () => {
            skip()
            if (!match("TreeNode")) {
                throw new Error("Expected TreeNode")
            }

            skip()
            if (!match("(")) {
                throw new Error("Expected opening parenthesis")
            }

            skip()
            const val = parseNumber()
            skip()

            const node = { val, left: null, right: null }

            while (pos < input.length && input[pos] === ",") {
                pos++
                skip()

                if (match("left")) {
                    skip()
                    if (!match("=")) {
                        throw new Error("Expected = after left")
                    }
                    node.left = parseNode()
                } else if (match("right")) {
                    skip()
                    if (!match("=")) {
                        throw new Error("Expected = after right")
                    }
                    node.right = parseNode()
                } else {
                    break
                }
                skip()
            }

            skip()
            if (!match(")")) {
                throw new Error("Expected closing parenthesis")
            }

            return node
        }

        try {
            skip()
            if (pos >= input.length) return null
            return parseNode()
        } catch (error) {
            throw error
        }
    }

    const handleEvaluate = () => {
        try {
            const tree = parseTree(code)
            onTreeGenerated(tree)
            onError("")
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown parsing error"
            onError(errorMessage)
            onTreeGenerated(null)
        }
    }

    const generateRandomTree = (depth = 3, minVal = 1, maxVal = 100) => {
        const generateNode = (currentDepth) => {
            if (currentDepth <= 0) return ""

            const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
            const hasLeft = Math.random() > 0.3 && currentDepth > 1
            const hasRight = Math.random() > 0.3 && currentDepth > 1

            let nodeStr = `TreeNode(${val}`

            if (hasLeft) {
                nodeStr += `,\n${"  ".repeat(4 - currentDepth)}left=${generateNode(currentDepth - 1)}`
            }

            if (hasRight) {
                nodeStr += `,\n${"  ".repeat(4 - currentDepth)}right=${generateNode(currentDepth - 1)}`
            }

            nodeStr += ")"
            return nodeStr
        }

        setCode(generateNode(depth))
    }

    return (
        <div className="python-evaluator">
            <div className="evaluator-header">
                <h3>Tree Definition (Python Style)</h3>
                <div className="header-controls">
                    <button className="btn-secondary" onClick={() => generateRandomTree(3)} title="Generate Random Tree">
                        🎲 Random
                    </button>
                    <button className="btn-primary" onClick={handleEvaluate}>
                        ▶ Evaluate
                    </button>
                </div>
            </div>

            <div className="code-editor">
        <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="code-textarea"
            placeholder="Enter your tree definition..."
            spellCheck={false}
        />
            </div>

            <div className="quick-templates">
                <h4>Quick Templates:</h4>
                <div className="template-buttons">
                    <button
                        className="template-btn"
                        onClick={() => setCode("TreeNode(10, left=TreeNode(5), right=TreeNode(15))")}
                    >
                        Simple
                    </button>
                    <button
                        className="template-btn"
                        onClick={() =>
                            setCode(`TreeNode(50,
  left=TreeNode(30, left=TreeNode(20), right=TreeNode(40)),
  right=TreeNode(70, left=TreeNode(60), right=TreeNode(80))
)`)
                        }
                    >
                        Balanced
                    </button>
                    <button
                        className="template-btn"
                        onClick={() =>
                            setCode(`TreeNode(1,
  right=TreeNode(2,
    right=TreeNode(3,
      right=TreeNode(4)
    )
  )
)`)
                        }
                    >
                        Right Skewed
                    </button>
                </div>
            </div>
        </div>
    )
}
