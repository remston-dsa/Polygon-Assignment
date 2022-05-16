// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "MyContracts/token/ERC721/ERC721.sol";
import "MyContracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "MyContracts/security/Pausable.sol";
import "MyContracts/access/Ownable.sol";
import "MyContracts/token/ERC721/extensions/ERC721Burnable.sol";
import "MyContracts/utils/cryptography/draft-EIP712.sol";
import "MyContracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "MyContracts/utils/Counters.sol";

contract RemstonNFTToken is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable, EIP712, ERC721Votes {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor()
        ERC721("RemstonNFTToken", "RNT")
        EIP712("RemstonNFTToken", "1")
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _afterTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Votes)
    {
        super._afterTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}