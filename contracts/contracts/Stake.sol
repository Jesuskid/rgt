// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
@notice Staking smart contract with rewards in native token
@author Rawllings
*/

contract Stake is ERC20 {
    struct Investor {
        uint256 amount;
        uint256 lastRewardReedemed;
    }

    mapping(address => Investor) public deposits;
    mapping(address => uint256) public Asset;
    mapping(address => uint256) public lifetimeRewards;

    uint256 public STAKE_MULTIPLE = 10 ether;
    uint256 public REWARD_UNIT = 0.1 ether;
    uint256 public REWARD_CYCLE = 24 hours;
    uint256 public REWARD_CYCLE_SECONDS = 86400 seconds;
    bool inMotion;
    address _owner;
    modifier nonReentrant() {
        require(inMotion == false);
        inMotion = true;
        _;
        inMotion = false;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Stake:Only owner allowed");
        _;
    }

    IERC20 stakedToken;

    constructor(address _stakedToken) ERC20("SReward", "SRWD") {
        stakedToken = IERC20(_stakedToken);
        _owner = msg.sender;
        _mint(address(this), 10000 ether);
    }

    /*
     * receives mtk token deposit in exchange for assets
     * sets the reward timespan
     * @param the amount of mtk deposit
     */

    function deposit(uint256 amount) external nonReentrant {
        require(
            amount % STAKE_MULTIPLE == 0,
            "Stake: Deposit amount must be a multiple of 10"
        );
        //transfer tokens in
        stakedToken.transferFrom(msg.sender, address(this), amount);

        uint256 stakedAssets = amount / STAKE_MULTIPLE;
        Investor storage investor = deposits[msg.sender];
        investor.amount = amount + investor.amount;

        //transfer any previous rewards held to avoid collision between old and new deposits
        (uint256 rewards, ) = calculateRewards(msg.sender);
        if (rewards > 0) {
            _claimReward(msg.sender);
        }
        investor.lastRewardReedemed = block.timestamp;
        Asset[msg.sender] += stakedAssets;
        emit Staked(msg.sender, amount, stakedAssets, block.timestamp);
    }

    /*
     * calculates the second by second rewards base on the hourly interval
     * @return the amount of rewards
     * @return current timestamp
     */

    function calculateRewards(address holder)
        internal
        view
        returns (uint256, uint256)
    {
        Investor storage investor = deposits[holder];
        uint256 AssetHolding = Asset[holder];
        uint256 span = (block.timestamp - investor.lastRewardReedemed) *
            1 seconds;
        uint256 dailyReward = REWARD_UNIT * AssetHolding;

        uint256 fullCycleRewards = (span * dailyReward) / REWARD_CYCLE_SECONDS;
        uint256 rewards = balanceOf(address(this)) >= fullCycleRewards
            ? fullCycleRewards
            : 0;
        return (rewards, block.timestamp);
    }

    /*
     * Internal claim reward function
     * allows asset holders to claim rewards
     * @return the amount of rewards
     * @return current timestamp
     */

    function _claimReward(address claimant) internal {
        Investor storage investor = deposits[claimant];
        (uint256 rewards, ) = calculateRewards(claimant);
        require(rewards > 0, "Stake: You have no rewards to claim");
        IERC20(address(this)).transfer(msg.sender, rewards);
        lifetimeRewards[claimant] += rewards;
        investor.lastRewardReedemed = block.timestamp;
        emit Claimed(claimant, rewards, block.timestamp);
    }

    function claimReward() public nonReentrant {
        _claimReward(msg.sender);
    }

    /*
     *
     * @return the amount of rewards for account
     * @return current timestamp
     */

    function myRewards(address account) public view returns (uint256) {
        (uint256 rewards, ) = calculateRewards(account);
        return rewards;
    }

    function assetHeld(address account) public view returns (uint256) {
        return Asset[account];
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function currentDeposits(address account) public view returns (uint256) {
        return deposits[account].amount;
    }

    function lifeTimeRewards(address account) public view returns (uint256) {
        return lifetimeRewards[account];
    }

    function resetCycle(uint256 hour, uint256 second) external onlyOwner {
        REWARD_CYCLE = hour * 1 hours;
        REWARD_CYCLE_SECONDS = second * 1 seconds;
    }

    function resetRewardUnit(uint256 amount) external onlyOwner {
        REWARD_UNIT = amount;
    }

    function changeOwner(address newOwner) public onlyOwner {
        _owner = newOwner;
    }

    /*
     * allows asset holder to claim all residual rewards and withdraw assets
     * @return the amount of rewards
     * @return current timestamp
     */

    //withdraw
    function withdrawFunds() public nonReentrant {
        //reset Assets, send rewards, reset deposits
        Investor storage investor = deposits[msg.sender];
        uint256 amount = investor.amount;
        uint256 asset = Asset[msg.sender];
        (uint256 rewards, ) = calculateRewards(msg.sender);
        if (rewards > 0) {
            _claimReward(msg.sender);
        }
        investor.amount = 0;
        Asset[msg.sender] = 0;
        stakedToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount, asset, block.timestamp);
    }

    event Staked(
        address indexed holder,
        uint256 amount,
        uint256 assets,
        uint256 indexed timestamp
    );
    event Withdrawn(
        address indexed holder,
        uint256 amount,
        uint256 assets,
        uint256 indexed timestamp
    );
    event Claimed(
        address indexed holder,
        uint256 amount,
        uint256 indexed timestamp
    );
}
