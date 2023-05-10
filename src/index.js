import React from "react"
import ReactDOM from "react-dom/client"
import SnackbarProvider from "react-simple-snackbar"
import Modal from "react-modal"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Web3Modal } from "@web3modal/react"
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { WagmiConfig, configureChains, createClient  } from "wagmi"
import { arbitrum, } from "wagmi/chains"
// import { http, createPublicClient } from "viem"

import "./styles/root.css"
import { routes } from "./data/routes"
import { config } from "./data"

const chains = [arbitrum]

const { provider, webSocketProvider } = configureChains(
    chains,
    [w3mProvider({ projectId: config.walletConnectProjectId })]
)

const wagmiConfig = createClient({
    autoConnect: true,
    // publicClient: createPublicClient({
    //     chain: arbitrum,
    //     transport: http()
    // }),
    connectors: w3mConnectors({
        projectId: config.walletConnectProjectId,
        version: 1,
        chains
    }),
    provider,
    webSocketProvider,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

const root = ReactDOM.createRoot(document.getElementById("root"))
const router = createBrowserRouter(routes)

Modal.setAppElement("#root")
root.render(
    <React.StrictMode>
        <SnackbarProvider>
            <WagmiConfig config={wagmiConfig}>
                <RouterProvider router={router} />
            </WagmiConfig>

            <Web3Modal
                projectId={config.walletConnectProjectId}
                ethereumClient={ethereumClient}
                themeMode={"dark"}
                themeVariables={{
                    "--w3m-accent-color": "var(--w3m-accent)",
                    "--w3m-background-color": "var(--w3m-accent)",
                }}
            />
        </SnackbarProvider>
    </React.StrictMode>
)
