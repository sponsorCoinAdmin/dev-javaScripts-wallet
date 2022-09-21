// Contract Vars;
const spCoinContractAddress = "0x334710ABc2Efcc3DF2AfdA839bF8d0dA923dB36A";
const abi = spCoinABI;

async function init(contract) {
  contract.name = await contract.name();
  contract.symbol = await contract.symbol();
  contract.totalSupply = await contract.totalSupply();
}

function JunkAlert() {
  alert("This is JUNK");
}

class JunkWrap {
  constructor(_junk) {
    this.junk = _junk;
  }
}

class ContractWrap {
    constructor(_address, _abi, _signer) {
    this.loaded = false;
    this.address = _address;
    this.ABI = _abi;
    this.signer = _signer;
    this.contract = this.getContract(_address, _abi, _signer);
    this.name = this.contract.name();
    this.symbol;
    this.totalSupply;
    this.decimals;
    this.balance;
    // this.init();
    // this.alertVals();
    // setTimeout(this.alertVals, 3000);
  }

  async getName() {
    return await this.contract.name();
  }

  async getSymbol() {
    return await this.contract.symbol();
  }

  async init() {
    try {
      var contract = this.contract;
      var values = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
        contract.decimals(),
      ]);
      console.log(values);
      this.name = values[0];
      this.symbol = values[1];
      this.totalSupply = values[2];
      this.decimals = values[3];
      this.balance = await contract.balanceOf(this.address);
      alert("balanceOf() = " + this.balance);
      var account = await contract.getAccount(this.address);
      alert("getBalance() = " + this.balance);
      this.tokenSupply = weiToToken(this.totalSupply, this.decimals);
    } catch (err) {
      var msg = "** Error Contract Creation\n";
      msg += "Invalad Address: " + this.address;
      alertLogErrorMessage(msg);
      throw err;
    }
    return true;
  }

  alertVals() {
    var vals = "\nName = " + this.name;
    vals += "\nSymbol = " + this.symbol;
    vals += "\ntotalSupply" + this.totalSupply;
    vals += "\ndecimals" + this.decimals;
    alert("Contract Values" + vals);
  }

  async getContract(_address, _ABI, _signer) {
    //    readDataFromSmartContract(addr)
    var contract;
    try {
      if (_address != null) {
        contract = new ethers.Contract(_address, _ABI, _signer);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        const myBalance = await contract.balanceOf(
          "0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9"
        );
      }
    } catch (err) {
      processError(err);
    }
    return contract;
  }

  // async readDataFromSmartContract(addr) {
  //   let abi = this.getABIFromAddress(addr);
  //   const contract = new ethers.Contract(addr, abi, provider);

  //   const name = await contract.name();
  //   const symbol = await contract.symbol();
  //   const decimals = await contract.decimals();
  //   const totalSupply = await contract.totalSupply();
  //   const balanceOf = await contract.balanceOf(signer.getAddress());

  //   var contractData = `name = ${name}\n`;
  //   contractData += `symbol = ${symbol}\n`;
  //   contractData += `decimals = ${decimals}\n`;
  //   contractData += `totalSupply = ${totalSupply / 1e6}\n`;
  //   contractData += `balanceOf = ${balanceOf / 1e6}\n`;

  //   alert(contractData);
  //   console.log(contractData);
  // }

  // getABIFromAddress(addr) {
  //   switch (addr) {
  //     // ETH
  //     case "0x4f75f07232a56c2b98fc9878f496bfc32e317ace":
  //       return DEFAULT_ABI;
  //     // SPCOIN
  //     case "0xD5D2fd6c5E71618310baE2867513e3c9c90FD837":
  //       return SPCOIN_ABI;
  //     // LINK
  //     case "0x326C977E6efc84E512bB9C30f76E30c160eD06FB":
  //       return DEFAULT_ABI;
  //     // USDC
  //     case "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C":
  //       return DEFAULT_ABI;
  //     // UNI
  //     case "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984":
  //       return DEFAULT_ABI;
  //     // TEST
  //     case "0xC1a1c4568be43E43d3b7D98354Ec76F458075356":
  //       return DEFAULT_ABI;
  //     default:
  //       return DEFAULT_ABI;
  //   }
  // }

  async balanceOf(accountAddress) {
    try {
      balance = await this.contract.balanceOf(accountAddress);
      return balance;
    } catch (err) {
      processError(err);
    }
  }
}

async function connectValidContract(_address) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    if (_address == undefined || _address.length == 0) {
      msg = "Error: Contract Address Required";
      throw { name: "missingContractAddress", message: msg };
    }
    try {
      contract = new ethers.Contract(_address, spCoinABI, signer);
      // do a test call to see if contract is valid.
      tokenName = await contract.name();
    } catch {
      msg = "Error: Cannot connect to Contract Address  <" + _address + ">";
      throw { name: "emptyWalletSigner", message: msg };
    }
    return contract;
  } catch (err) {
    contract = undefined;
    processError(err);
  }
}

async function sendToAccount(addr) {
  try {
    if (!addr && addr.length == 0) {
      console.log("Address is empty");
      throw { name: "GUI_sendTokensToAccount", message: "Address is empty" };
    } else {
      if (!ethers.utils.isAddress(addr)) {
        throw {
          name: "GUI_sendTokensToAccount",
          message: "Address is not valid",
        };
      } else {
        contractDecimals = await getContractDecimals();
        contractWeiBalance = tokenToWei(tokenAmount, contractDecimals);
        strVal = contractWeiBalance.toFixed(contractDecimals);
        alert(
          "contractDecimals = " +
            contractDecimals +
            "\ncontractWeiBalance = " +
            contractWeiBalance
        );
        getContract().connect(signer).transfer(addr, "55000000000000000000000");
        getContract().connect(signer).transfer(addr, contractWeiBalance);
        //         contract.connect(signer).transfer(addr, "500000000");
      }
    }
  } catch (err) {
    processError(err);
  }
}

async function OLD_sendTokensToAccount(addr, tokenAmount) {
  try {
    var signer = getValidatedSigner();
    contract = new ethers.Contract(address, spCoinABI, signer);
    if (!addr && addr.length == 0) {
      console.log("Address is empty");
      sendToAccountAddr.value = "Address is empty";
    } else {
      if (!ethers.utils.isAddress(addr)) {
        alert("Address %s is not valid", addr);
      } else {
        spCoinContract.connect(signer).transfer(addr, "500000000");
      }
    }
  } catch (err) {
    processError(err);
  }
}
