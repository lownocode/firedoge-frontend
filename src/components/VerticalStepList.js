import React from "react"

import styles from "../styles/components/vertical-step-list.module.css"

export const VerticalStepList = ({ list = [], step }) => {
    const renderList = list.map((item, index) => {
        return (
            <li
                key={"item-" + index}
                style={{
                    borderLeft: index + 1 === list.length ? "none" : step >= index + 1 ? "1px solid var(--accent)" : "1px dashed var(--grey)",
                    [index + 1 === list.length && "paddingBottom"]: 0
                }}
            >
                <div
                    className={styles["circle"]}
                    style={{
                        background: step >= index + 1 ? "var(--accent)" : "var(--grey)"
                    }}
                >
                    {index + 1}
                </div>

                {item.title}
                <div className={styles["description"]}>
                    {item.description}
                </div>
            </li>
        )
    })

    return (
        <div className={styles["container"]}>
            {renderList}
        </div>
    )
}