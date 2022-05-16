// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "MyContracts/token/ERC20/ERC20.sol";
import "MyContracts/token/ERC20/extensions/ERC20Burnable.sol";
import "MyContracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "MyContracts/access/AccessControl.sol";
import "MyContracts/security/Pausable.sol";
import "MyContracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "MyContracts/token/ERC20/extensions/ERC20FlashMint.sol";

contract RemstonERC20Permit is ERC20, ERC20Burnable, ERC20Snapshot, AccessControl, Pausable, ERC20Permit, ERC20FlashMint {
    bytes32 public constant SNAPSHOT_ROLE = keccak256("SNAPSHOT_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor()
        ERC20("RemstonERC20Permit", "REP")
        ERC20Permit("RemstonERC20Permit")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(SNAPSHOT_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }

    function snapshot() public onlyRole(SNAPSHOT_ROLE) {
        _snapshot();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override(ERC20, ERC20Snapshot)
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
