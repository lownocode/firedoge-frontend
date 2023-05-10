import React from "react"
import ReactDOM from "react-dom/client"
import SnackbarProvider from "react-simple-snackbar"
import Modal from "react-modal"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Web3Modal } from "@web3modal/react"
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { WagmiConfig, configureChains, createClient  } from "wagmi"
import { arbitrum } from "wagmi/chains"

import "./styles/root.css"
import { routes } from "./data/routes"
import { config } from "./data"



const root = ReactDOM.createRoot(document.getElementById("root"))
const router = createBrowserRouter(routes)

Modal.setAppElement("#root")
root.render(
    <React.StrictMode>
        <SnackbarProvider>
            <RouterProvider router={router} />

        </SnackbarProvider>
    </React.StrictMode>
)
