import React from 'react'
import { useState } from 'react'
import { Row, Button } from 'react-bootstrap'
import { useEtherBalance, useEthers, useTokenBalance, useTokenAllowance, useContractFunction } from '@usedapp/core'
import { address, Erc20, StakeContract, Token, NATIVE_TK_SYMBOL, TOKEN_SYMBOL } from '../utils'
import { formatEther, formatUnits } from 'ethers/lib/utils'
import { ethers } from 'ethers'
const Home = () => {
    const [value, setValue] = useState("0")
    const [error, setError] = useState("")
    const { account, activateBrowserWallet } = useEthers()
    const daiBalance = useTokenBalance(Token, account)
    const allowance = useTokenAllowance(Token, account, address)

    const { state: stakeState, send: stake } = useContractFunction(StakeContract, 'deposit', { transactionName: 'stake' })
    const { state: approveState, send: approve } = useContractFunction(Erc20, 'approve', { transactionName: 'approve' })

    const handleChange = (e) => {
        setValue(e.target.value)
        if (parseInt(e.target.value) % 10 != 0) {
            setError("Value must be a multiple of 10")
        } else {
            setError("")
        }
    }

    const sign = () => {
        try {
            activateBrowserWallet()
        } catch (error) {
            console.log('err')
            activate()
        }
    }

    const approveIt = () => {
        approve(address, ethers.constants.MaxUint256)
    }

    const stakeIt = () => {
        if (parseInt(value) % 10 !== 0) {
            alert('Value must be a multiple of 10')
            return
        }
        stake(ethers.utils.parseEther(value.toString()))
    }

    //
    return (
        <div className='p-5 blue-glassmorphism card d-flex flex-column align-items-start'>
            <input value={value} onChange={(e) => handleChange(e)} className='my-2 form-control' placeholder="MTK Amount" />
            <p className='align-items-start'>Balance: {daiBalance ? formatEther(daiBalance) : 0} {TOKEN_SYMBOL}</p>
            {!account ? <button onClick={sign()} className='my-2 w-100'>Connect</button> : daiBalance && (daiBalance > 0 && allowance > parseInt(value) ? <button onClick={() => stakeIt()} className='my-2 w-100'>Stake</button> : <button onClick={approveIt} className='my-2 w-100'>Approve</button>)}
            <p className='text-red'>{error}</p>
            <a className='text-white' target='_blank' href={`https://testnet.snowtrace.io/address/${Token}#writeContract`}>GET MTK Token</a>
        </div>
    )
}

export default Home