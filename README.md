

# Introduction
### SReward Staking Contract
Web3 is awesome and fun decentralization makes it quite unique. SReward is turning a new leaf by offering to earn you SRWD tokens when you stake the MTK tokens, you can earn up to 1% of your total staked value every 24 hours. 
What More?
Staked Tokens are not locked in the contract. You can withdraw your staked tokens at any time.

### Tech Stack
- Solidity
- Hardhat
- Javascript
- React + Vite
- Bootstrap
- Avalanche (Fuji Testnet

## Getting started

### /contracts

This directory contains the contracts used, deployment scripts and tests with hardhat.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

### /client
This directory runs the client side of the application with REACT+Vite.
```shell
npm install
npm run dev
```

Staking MTK enables you to share Stake assets, these assets held entitle you to rewards that are available to be claimed at any time. MTK can only be deposited for assets on a multiple of 10 bases with each 10 MTK equalling 1 asset. Making
20 MTK equalling 2 assets
30 MTK equalling 3 assets
and so on

To stake simply call the deposit function on the contract passing the amount of MTK to be deposited ensuring the Stake contract is pre-approved to spend that amount of MTK tokens. The MTK value must be a multiple of 10, in WEI.


## Key Functions

### deposit(uint256 amount)
- Allows the use to deposit an amount of MTK tokens in exchange for assets
### myRewards(address account)
- Returns the cumulative reward for the total period unclaimed for a user who staked.
### claimReward().
- sends the SRWD token equal to the cumulative reward for the total period unclaimed for a user who staked.
### assetHeld(address account). 
- Returns the total assets held by an account
### withdrawFunds()
- Refunds the total assets held by the user and auto-claims the reward to the user's wallet
### calculate reward().
- Calculates the amount of reward between the period last reedemed and now only a second by second basis using the 24 hour reward amount

## Key points
- MAX_ASSETS variable, this is set to keep the stake from going to an infinite amount which cannot be controlled the max assets that can be subscribed is 1000,
- Assets cannot be subscribed if the reward pool is empty
- Assets can be removed and total accumulated rewards claimed.
- Rewards closing, the owners could close rewards especially when the pool is becomes insufficient to fund staking rewards, to avoid having rewards that cannot be claimed.

### N.B
- You can test a simulated version at [https://rgt-sigma.vercel.app/]
- Please, Make sure to adjust gas cost to market rates as some wallet might not properly estimate it