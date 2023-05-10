import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi"

import { TokenContract } from "../data/contracts"

export const useAirdropClaim = ({ nonce, sign, referrer, openSnackbar }) => {
    const broadcastPreparation = usePrepareContractWrite({
        ...TokenContract,
        functionName: "claim",
        args: [nonce, sign, referrer]
    })

    const signedTx = useContractWrite(broadcastPreparation.config)

    useWaitForTransaction({
        hash: signedTx.data?.hash,
        onSuccess() {
            console.log("success")
            openSnackbar("You successfully claimed the airdrop!")
        },
    })

    return [signedTx.write, broadcastPreparation.isError]
}