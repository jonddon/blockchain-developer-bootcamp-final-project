pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CE is ERC20 {
  constructor() ERC20("CE", "CE") {
    _mint(msg.sender, 1000000000e18); //1000 tokens totalsupply
  }
}
