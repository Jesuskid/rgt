import React from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { StakeContract, address, NATIVE_TK_SYMBOL, TOKEN_SYMBOL } from '../utils'
import { AvalancheTestnet, useCall, useContractFunction, useContractCall, useEthers } from '@usedapp/core'
import { utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

const Info = () => {
    const { account } = useEthers()
    const { state: claimState, send: claim } = useContractFunction(StakeContract, 'claimReward', { transactionName: 'claim' })
    const { state: withdrawState, send: withdraw } = useContractFunction(StakeContract, 'withdrawFunds', { transactionName: 'withdraw' })
    const { value: assets, error: err } = useCall({
        contract: StakeContract,
        method: 'assetHeld',
        args: [account]
    }, { chainId: AvalancheTestnet.chainId }) ?? {}

    const { value: lftRewards, error: err1 } = useCall({
        contract: StakeContract,
        method: 'lifeTimeRewards',
        args: [account]
    }, { chainId: AvalancheTestnet.chainId }) ?? {}

    const { value: currentDeposits, error: err2 } = useCall({
        contract: StakeContract,
        method: 'currentDeposits',
        args: [account]
    }, { chainId: AvalancheTestnet.chainId }) ?? {}



    const { value, error } = useCall({
        contract: StakeContract,
        method: 'myRewards',
        args: [account]
    }, { chainId: AvalancheTestnet.chainId }) ?? {}

    console.log(value)

    const claimIt = () => {
        claim()
    }


    return (
        <div className='card my-5 d-flex justify-content-between ' >
            <Row className='bottom' >
                <Col sm={12} md={6} className='d-flex flex-column mt-2 justify-content-start align-items-start'>
                    <div className='d-flex '>
                        <span>Rewards:</span><span className={!value ? 'text-white px-2' : 'text-green px-2'}> {value ? Math.round(formatEther(value.toString()) * 10000000) / 10000000 : 0} {NATIVE_TK_SYMBOL}</span>
                    </div>
                    <Button variant='success' onClick={claimIt} className='w-100 mt-2'>Claim</Button>
                </Col>
                <Col sm={12} md={6} className='d-flex flex-column mt-2 justify-content-start align-items-start'>
                    <div className='d-flex '>
                        <span>Assets Held:</span><span className={!value ? 'text-white px-2' : 'text-green px-2'}>{assets ? assets.toString() : 0} Assets</span>
                    </div>
                    <Button variant='success' onClick={() => withdraw()} className='w-100 mt-2'>Remove</Button>
                </Col>
            </Row>

            <Row className='mt-4'>
                <Col sm={12} md={6} className='d-flex flex-column mt-2 justify-content-start align-items-start'>
                    <p className='font-weight-bold'>Lifetime Rewards Reedmed</p>
                    <button className='w-100'>{lftRewards ? Math.round(formatEther(lftRewards.toString()) * 10000000) / 10000000 : 0} {NATIVE_TK_SYMBOL}</button>
                </Col>
                <Col sm={12} md={6} className='d-flex flex-column mt-2 justify-content-start align-items-start'>
                    <p>Current Deposits</p>
                    <button className='w-100'>{currentDeposits ? formatEther(currentDeposits.toString()) : 0} {TOKEN_SYMBOL}</button>
                </Col>
            </Row>


        </div>
    )
}

export default Info