import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useWeb3Modal } from "@web3modal/react"
import { useAccount } from "wagmi"

import styles from "../styles/components/header.module.css"
import { config } from "../data"
import { routes } from "../data/routes"
import { Menu, WalletConnectLogo } from "../assets/icons"
import { SideMenu } from "./SideMenu"
import logo from "../assets/logo.png"

export const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const web3Modal = useWeb3Modal()

    const [ isSideMenuActive, setSideMenuActive ] = useState(false)

    const { address: walletAddress = "", isConnected } = useAccount()
    const address = walletAddress.substring(0, 4) + "•••" + walletAddress.substring(walletAddress.length - 4)

    const renderButtons = routes.map(route => {
        return (
            <div
                key={route.path}
                className={
                    styles[`buttons--button${location.pathname === route.path ? "--selected" : ""}`]
                }
                onClick={() => navigate(route.path, { replace: true })}
            >
                {route.title}
            </div>
        )
    })

    useEffect(() => {
        document.title = config.projectName + ` | ${routes.find(({ path }) => path === location.pathname)?.title || ""}`
    }, [location])

    const ConnectWalletButton = () => {
        return (
            <>
                {
                    isConnected ? (
                        <div
                            onClick={() => web3Modal.open()}
                            className={styles["connected-wallet-button-container"]}
                        >
                            <div className={styles["connected-wallet-bubble"]} />

                            <div>
                                <div className={styles["connected-wallet-button--wallet"]}>
                                    {address}
                                </div>
                                <div className={styles["connected-wallet-button--connected"]}>
                                    Connected
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={styles["connect-wallet-button"]}
                            onClick={() => web3Modal.open()}
                        >
                            <WalletConnectLogo size={22} />
                            Connect Wallet
                        </div>
                    )
                }
            </>
        )
    }

    return (
        <>
            <SideMenu
                isActive={isSideMenuActive}
                onClose={() => setSideMenuActive(false)}
            />
            <div className={styles.container}>
                <div className={styles["logo-container"]}>
                    <img
                        src={logo}
                        alt={"doge"}
                        style={{ width: 35, height: 35, borderRadius: 100 }}
                    />
                    <div className={styles["logo-text"]}>
                        {config.projectName}
                    </div>
                </div>

                <div className={styles["buttons-container"]}>
                    {renderButtons}
                </div>

                <ConnectWalletButton />

                <div
                    className={styles["menu-button"]}
                    onClick={() => setSideMenuActive(!isSideMenuActive)}
                >
                    <Menu color={"var(--accent)"} size={22} />
                </div>
            </div>
        </>
    )
}