import React from "react";
import { Contract } from '@ethersproject/contracts'
import stakeAbi from '../abis/stakeAbi.json'
import { ethers, utils } from 'ethers'
import { ERC20Interface } from '@usedapp/core'

const IStake = new utils.Interface(stakeAbi)

export const address = "0x28977C5E39916b8837718Aea4564eE8F3d27A1b3"
export const Token = '0xDbaa56A40b6198dBB0F3Da160cF884A6b2b6c56F'

// 0xa19557634e8fE32A35F701864b70E841461919CE
export const NATIVE_TK_SYMBOL = 'SRWD'
export const TOKEN_SYMBOL = 'MTK'
export const StakeContract = new Contract(address, IStake)
export const Erc20 = new Contract(Token, ERC20Interface)


// npx hardhat verify 0x416abC82b7c8ccB0e124c5CC546818405E64cbBC 0xDbaa56A40b6198dBB0F3Da160cF884A6b2b6c56F --network fuji