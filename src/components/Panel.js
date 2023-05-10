import React from "react"

import styles from "../styles/panels/panel.module.css"
import { Header } from "./index"

export const Panel = ({ children }) => {
    return (
        <>
            <Header />

            <div style={{ marginTop: "var(--header-height)" }} />

            <div className={styles.wrapper}>
                <div style={{ maxWidth: 1280, flex: 1 }}>
                    {children}
                </div>
            </div>

            {/*<Footer />*/}
        </>
    )
}