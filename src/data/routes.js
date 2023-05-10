import React from "react"

import { Airdrop } from "../panels"

export const routes = [
    {
        path: "/",
        element: <Airdrop />,
        title: "Airdrop"
    },
    {
        path: "/staking",
        element: <Airdrop />,
        title: "Staking"
    },
    {
        path: "/wildrace",
        element: <Airdrop />,
        title: "Wild Race"
    }
]