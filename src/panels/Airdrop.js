import React, { useState, useEffect } from "react"
import { BigNumber, ethers } from "ethers"
import { useAccount, useBalance, useChainId, useContractRead, configureChains, WagmiConfig, createClient } from "wagmi"
import { useSnackbar } from "react-simple-snackbar"
import { useLocation } from "react-router-dom"
import { useWeb3Modal } from "@web3modal/react"

import { Web3Modal } from "@web3modal/react"
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { arbitrum } from "wagmi/chains"

import styles from "../styles/panels/airdrop.module.css"
import { Panel, ProgressLine, VerticalStepList } from "../components"
import { Fire } from "../assets/icons"
import { config } from "../data"
import { AirdropContract, TokenContract } from "../data/contracts"
import { useAirdropClaim } from "../hooks"
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem'

const futureStepsList = [
    {
        title: "Airdrop",
        description: "Airdrop campaign continues for 4 weeks",
    },
    {
        title: "Staking",
        description: "UI interface for stakers will be provided as soon as possible"
    },
    {
        title: "Wild Race",
        description: "UI interface for Wild Race will be provided as soon as possible"
    },
    {
        title: "A lot of secrets...",
        description: "Stay tuned!"
    }
]

const ClaimFetchingStatus = {
    WAIT_ACCOUNT_CONNECTION: 0,
    PENDING: 1,
    ELIGIBLE: 2,
    NOT_ELIGIBLE: 3
}

export const Airdrop = () => {
    const chains = [arbitrum];
    const { provider } = configureChains([arbitrum], [w3mProvider({ projectId: config.walletConnectProjectId })])
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: w3mConnectors({ projectId: config.walletConnectProjectId, version: 1, chains }),
        queryClient: createPublicClient({
            transport: http(),
            chain: arbitrum
        }),
        provider
    })
    const ethereumClient = new EthereumClient(wagmiClient, chains)


    return (
        <WagmiConfig config={wagmiClient}>
            <AirdropInner />
                <Web3Modal
                projectId={config.walletConnectProjectId}
                ethereumClient={ethereumClient}
                themeMode={"dark"}
                themeVariables={{
                    "--w3m-accent-color": "var(--w3m-accent)",
                    "--w3m-background-color": "var(--w3m-accent)",
                }}
            />
        </WagmiConfig>
    );
}

export const AirdropInner = () => {
    const account = useAccount()
    const location = useLocation()
    const web3Modal = useWeb3Modal()

    const currentChain = useChainId({ chainId: 42161 });

    const [ referrer, setReferrer ] = useState("0x68467834722c31b5C07615ebd8c44CDF93B9Ea13")
    const [ claimData, setClaimData ] = useState(null)
    const [ claimLabel, setClaimLabel ] = React.useState()
    const [ claimDataFetchingStatus, setClaimDataFetchingStatus ] = React.useState(ClaimFetchingStatus.WAIT_ACCOUNT_CONNECTION)

    const [ openSnackbar ] = useSnackbar({
        style: {
            backgroundColor: "var(--snackbar-background)",
            border: "1px solid var(--snackbar-border)",
            textAlign: "center",
            borderRadius: 10
        }
    })
    console.log(ethers.BigNumber.from(claimData?.["nonce"] ?? "0"), claimData?.["sign"], referrer)
    const [ claimCallback, isClaimError ] = useAirdropClaim({
        nonce: ethers.BigNumber.from(claimData?.["nonce"] ?? "0"),
        sign: claimData?.["sign"],
        referrer,
        openSnackbar
    })
    const isClaimed = useContractRead({
        ...AirdropContract,
        functionName: "claimedUser",
        args: [account.address]
    }).data

    const firstDestroyedTokens = useBalance({
        address: ethers.constants.AddressZero,
        token: config.contract
    })
    const secondDestroyedTokens = useBalance({
        address: config.burnAddress,
        token: config.contract,
    })
    const totalDestroyedTokens = ethers.BigNumber.from(firstDestroyedTokens?.data?.value).add(secondDestroyedTokens?.data?.value ?? ethers.BigNumber.from(0));
    const totalSupply = useContractRead({
        ...TokenContract,
        functionName: "totalSupply"
    }).data
    const totalBurnTokensPercentage = totalDestroyedTokens?.mul(100).mul(
        ethers.BigNumber.from(10).pow(10)
    ).div(totalSupply)

    console.log(totalBurnTokensPercentage.toNumber())
    const burnStatsItems = [
        {
            title: "Total FIREDOGE Destroyed",
            subtitle: ethers.utils.commify(ethers.utils.formatUnits(totalDestroyedTokens ?? ethers.BigNumber.from(0), firstDestroyedTokens?.data?.decimals ?? ethers.BigNumber.from(0)))
        },
        {
            title: "Amount of Burned FIREDOGE (%)",
            subtitle: `${ethers.utils.formatUnits(totalBurnTokensPercentage ?? ethers.BigNumber.from(0), 10)}`
        }
    ]

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)

        if (urlParams.get("i") !== null) {
            setReferrer(urlParams.get("i"))
        }

    }, [location])

    useEffect(() => {
        (() => {
            if (!account.address) {
                return setClaimDataFetchingStatus(ClaimFetchingStatus.WAIT_ACCOUNT_CONNECTION)
            }

            if (claimDataFetchingStatus === ClaimFetchingStatus.WAIT_ACCOUNT_CONNECTION) {
                setClaimDataFetchingStatus(ClaimFetchingStatus.PENDING)

                fetch(`${window.location.protocol + "//" + window.location.host}/signs/${account.address?.slice(0, 4).toLowerCase()}.json`)
                    .then(data => data.json())
                    .then(body => {
                        const claimData = body[account.address]

                        console.log(claimCallback)

                        if (claimData === undefined) {
                            setClaimDataFetchingStatus(ClaimFetchingStatus.NOT_ELIGIBLE)
                        } else {
                            setClaimDataFetchingStatus(ClaimFetchingStatus.ELIGIBLE)
                            setClaimData(body[account.address])
                        }
                    })
            }
        })()
    }, [account])

    useEffect(() => {
        const newLabel = (() => {
            if (isClaimed) {
                return "Claimed!"
            }

            switch (claimDataFetchingStatus) {
                case ClaimFetchingStatus.PENDING: return "Check your eligibility..."
                case ClaimFetchingStatus.NOT_ELIGIBLE: return "Not eligible :("
                case ClaimFetchingStatus.ELIGIBLE:
                case ClaimFetchingStatus.WAIT_ACCOUNT_CONNECTION: return "Claim!"
            }
        })()

        if (newLabel !== claimLabel) {
            setClaimLabel(newLabel)
        }
    }, [claimDataFetchingStatus, account])

    const readableDate = (timestamp) => {
        const date = new Date(timestamp)

        const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()

        return `${date.toDateString()}, ${hours}:${minutes}`
    }

    const inviteFriends = async () => {
        if (!account.isConnected) {
            return openSnackbar("You need to connect wallet!")
        }

        const text = window.location.origin + "?i=" + account.address

        await navigator.clipboard.writeText(text)
        openSnackbar("URL was copied to clipboard!")
    }

    const claimAirdrop = () => {
        if (!account.isConnected) {
            return web3Modal.open()
        }
        if (isClaimed) {
            return openSnackbar("Airdrop was claimed!")
        }

        claimCallback?.()
    }

    const renderBurnStatsItems = burnStatsItems.map((item, index) => {
        return (
            <div
                key={"item-" + index}
                className={styles["burn-stats-item"]}
            >
                <div className={styles["burn-stats-item-title"]}>
                    {item.title}
                </div>
                <div className={styles["burn-stats-item-subtitle"]}>
                    {item.subtitle}
                </div>
            </div>
        )
    })

    return (

        <Panel>
            <div className={styles["placeholder-container"]}>
                <div style={{ fontSize: 45 }}>
                    Fire D<Fire size={40} />ge
                </div>
                <div className={styles["placeholder-subhead"]}>
                    Make Arbitrum One on fire! Again...
                </div>
            </div>

            <center>
                <div className={styles["claim-card-container"]}>
                    <div className={styles["claim-card-title"]}>
                        Claim free Fire Doge Token!
                    </div>
                    <div className={styles["claim-card-subtitle"]}>
                        Invite friends and get more free tokens!
                    </div>

                    <div className={styles["claim-card-progress"]}>
                        <div className={styles["claim-card-progress-dates"]}>
                            <div>
                                {readableDate(config.airdropStartsAt)}
                            </div>
                            <div>
                                {readableDate(config.airdropEndsAt)}
                            </div>
                        </div>

                        <ProgressLine
                            percent={config.airdropEndsAt / (config.airdropStartsAt * 100)}
                        />

                        <div className={styles["claim-card-progress-description"]}>
                            Time left until the end
                        </div>
                    </div>

                    <div className={styles["claim-card-buttons"]}>
                        <div
                            className={styles["claim-card-claim-button"]}
                            onClick={() => claimAirdrop()}
                        >
                            {claimLabel}
                        </div>

                        <div
                            className={styles["claim-card-invite-button"]}
                            onClick={() => inviteFriends()}
                        >
                            Invite Friends
                        </div>
                    </div>
                </div>
            </center>

            <div className={styles["tokenomics-container"]}>
                <div className={styles["tokenomics-title"]}>
                    Tokenomics
                </div>

                <div className={styles["tokenomics-body"]}>
                    <div>
                        Fire Doge is an exteremely deflationary token with tax policy of
                        20% for any DEX trades. A half of tax is burned permanently, other tokens
                        are distributed between stakers, wild racers and coming updates reserves.
                        Except other tax projects, <b>nobody has authority to modify TAX or upgrade
                        contracts here, even Fire Doge DAO</b>
                    </div>

                    <div style={{ height: 20 }} />

                    <div>
                        <b>Contract address</b>
                        <br/>
                        <a
                            className={styles["tokenomics-link"]}
                            href={config.contractURL}
                            target={"_blank"}
                        >
                            {config.contract}
                        </a>
                    </div>

                    <div style={{ height: 20 }} />

                    <div>
                        <b>Trade token</b>
                        <br/>
                        <a
                            className={styles["tokenomics-link"]}
                            href={config.camelotTradeURL}
                            target={"_blank"}
                        >
                            Trade on Camelot!
                        </a> Note that the token has tax so we do not recommend to try swapping it
                        on Uniswap or 1inch due to potential fails.
                    </div>
                </div>
            </div>

            <center>
                <div className={styles["burn-stats-container"]}>
                    <div
                    style={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                    }}
                    >
                        <Fire size={80} color={"var(--accent)"} />
                    </div>

                    <div className={styles["burn-stats-head"]}>
                        Burn Statistics
                    </div>

                    <div className={styles["burn-stats-items"]}>
                        {renderBurnStatsItems}
                    </div>
                </div>
            </center>

            <div className={styles["future-container"]}>
                <div className={styles["future-title"]}>
                    Future
                </div>

                <div className={styles["future-body"]}>
                    <VerticalStepList
                        step={1}
                        list={futureStepsList}
                    />
                </div>
            </div>




        </Panel>
    )
}
