import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi"
import { ethers } from "ethers"
import { AirdropContract  } from "../data/contracts"

export const useAirdropClaim = ({ nonce, sign, referrer, openSnackbar }) => {
    console.log("CLAIM", AirdropContract, [nonce, sign ?? ethers.constants.HashZero, referrer])
    const broadcastPreparation = usePrepareContractWrite({
        ...AirdropContract,
        functionName: "claim",
        args: [nonce, sign, referrer]
    })
    console.log(broadcastPreparation.error)
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
