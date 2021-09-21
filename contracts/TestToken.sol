pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  constructor() ERC20("TEST", "TST") {
    _mint(msg.sender, 1000e18); //1000 tokens totalsupply
  }
}
