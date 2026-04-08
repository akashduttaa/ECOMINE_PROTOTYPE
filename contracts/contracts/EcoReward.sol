// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoReward is ERC20, Ownable {
    mapping(address => bool) public authorizedVerifiers;

    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event RewardIssued(address indexed user, uint256 amount, string scanId);

    constructor(address initialOwner) ERC20("EcoToken", "ECO") Ownable(initialOwner) {
        // Owner is initially the deployer
    }

    modifier onlyVerifierOrOwner() {
        require(owner() == _msgSender() || authorizedVerifiers[_msgSender()], "Not authorized");
        _;
    }

    function addVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function issueReward(address user, uint256 amount, string memory scanId) external onlyVerifierOrOwner {
        _mint(user, amount);
        emit RewardIssued(user, amount, scanId);
    }
}
