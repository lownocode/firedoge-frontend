import React from "react"

import styles from "../styles/components/progress-line.module.css"

export const ProgressLine = ({ percent }) => {
    return (
        <div className={styles.container}>
            <div
                className={styles.line}
                style={{ width: `${percent}%` }}
            />
        </div>
    )
}