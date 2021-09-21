//SPDX-License-Identifier:MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdoBase.sol";

contract IDOFactory is Ownable {
  event IDOCreated(
    bytes32 title,
    address idoAddress,
    uint256 idoId,
    address creator
  );
  uint256 public counter = 0;
  struct IdoInfo {
    address tokenAddress;
    address[] whitelistedAddresses;
    uint256 tokenPriceInWei;
    uint256 hardCapInWei;
    uint256 softCapInWei;
    uint256 maxInvestInWei;
    uint256 minInvestInWei;
    uint256 openTime;
    uint256 closeTime;
    uint8 decimals;
  }
  struct IdoStringInfo {
    bytes32 saleTitle;
    bytes32 linkTelegram;
    bytes32 linkDiscord;
    bytes32 linkTwitter;
    bytes32 linkWebsite;
  }

  struct IDOMAster {
    IdoInfo info;
    IdoStringInfo stringInfo;
    address creator;
  }
  mapping(uint256 => IDOMAster) public allIdos;
  uint256 devFee = 10000000000000000; //0.01ether

  function inititalizeIdo(
    IDOBase base,
    uint256 _totalTokens,
    uint256 _tokenPriceInWei,
    IdoInfo calldata info_,
    IdoStringInfo calldata stringInfo_
  ) internal {
    base.setAddresses(msg.sender, info_.tokenAddress);
    base.setGeneralInfo(
      _totalTokens,
      _tokenPriceInWei,
      info_.hardCapInWei,
      info_.softCapInWei,
      info_.maxInvestInWei,
      info_.minInvestInWei,
      info_.openTime,
      info_.closeTime,
      info_.decimals
    );
    base.setStringInfo(
      stringInfo_.saleTitle,
      stringInfo_.linkTelegram,
      stringInfo_.linkDiscord,
      stringInfo_.linkTwitter,
      stringInfo_.linkWebsite
    );
    base.addwhitelistedAddresses(info_.whitelistedAddresses);
  }

  IdoInfo[] public Idos;

  function createPresale(
    IdoInfo calldata info_,
    IdoStringInfo calldata stringInfo_
  ) external payable returns (address) {
    require(msg.value == devFee, "Incorrect Fee amount ");
    IERC20 token = IERC20(info_.tokenAddress);
    IDOBase base = new IDOBase(address(this), owner());
    uint256 maxTokens = ((info_.hardCapInWei / info_.tokenPriceInWei) *
      10**info_.decimals);
    require(token.transferFrom(msg.sender, address(base), maxTokens));
    inititalizeIdo(base, maxTokens, info_.tokenPriceInWei, info_, stringInfo_);
    base.setIdoInfo(counter);
    allIdos[counter].info = info_;
    allIdos[counter].stringInfo = stringInfo_;
    allIdos[counter].creator = msg.sender;
    Idos.push(info_);
    emit IDOCreated(stringInfo_.saleTitle, address(base), counter, msg.sender);
    counter++;
    return address(base);
  }

  function checkIdoDetails(uint256 _id)
    public
    view
    returns (IDOMAster memory master_)
  {
    master_ = allIdos[_id];
  }

  function changeFee(uint256 _newFee) public onlyOwner {
    devFee = _newFee;
  }
}
