import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAccount } from "wagmi"
import { useWeb3Modal } from "@web3modal/react"

import styles from "../styles/components/side-menu.module.css"
import { CloseCircle, WalletConnectLogo } from "../assets/icons"
import { routes } from "../data/routes"

export const SideMenu = ({ isActive, onClose }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const web3Modal = useWeb3Modal()

    const { address: walletAddress = "", isConnected } = useAccount()
    const address = walletAddress.substring(0, 4) + "..." + walletAddress.substring(walletAddress.length - 4)

    const renderRoutesButtons = routes.map((route) => {
        return (
            <div
                key={route.path}
                className={styles["routes-button"]}
                onClick={() => {
                    onClose()
                    navigate(route.path, { replace: true })
                }}
            >
                {route.title}

                {
                    location.pathname === route.path && (
                        <div className={styles["routes-button-bubble"]} />
                    )
                }
            </div>
        )
    })

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
        <aside className={`${styles.menu} ${isActive && styles["menu--active"]}`}>
            <div
                className={`${styles["overlay"]} ${isActive && styles["overlay--active"]}`}
                onClick={onClose}
            />

            <div className={`${styles.content} ${isActive && styles["content--active"]}`}>
                <div className={styles["close-button-container"]}>
                    <div
                        className={styles["close-button"]}
                        onClick={() => onClose()}
                    >
                        <CloseCircle size={22} color={"var(--grey)"}/>
                    </div>
                </div>

                <div className={styles["routes-buttons-container"]}>
                    {renderRoutesButtons}
                </div>

                <div className={styles["connect-wallet-wrapper"]}>
                    <ConnectWalletButton />
                </div>
            </div>
        </aside>
    )
}