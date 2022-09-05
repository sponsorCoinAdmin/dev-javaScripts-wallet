class Wallet {
  constructor(_walletName) {
    try {
      this.accountList;
      this.address;
      this.balance;
      this.decimals = 18;
      this.defaultWalletName = "METAMASK";
      this.eth_requestAccounts;
      this.name = "Ethereum";
      this.symbol = "ETH";
      this.ts = new TokenSelectorClass("tokenContract_SEL");
      this.tm = this.ts.tm;
      this.walletName = _walletName;
    } catch (err) {
      processError(err);
    }
  }

  async init() {
    try {
      this.provider = this.connectValidWalletProvider(this.walletName);
      this.eth_requestAccounts = await this.provider.send("eth_requestAccounts", []);
      this.address = this.eth_requestAccounts.toString();
      this.signer = await provider.getSigner();
      this.balance = await this.getEthereumAccountBalance();
      this.totalSupply = await this.signer.getBalance();
      this.tokenSupply = weiToToken(this.totalSupply, this.decimals);
      var tokenMapValues = this.tm.mapWalletObjectByAddressKey(this);
      this.ts.init();
    } catch (err) {
      processError(err);
      throw err;
    }
    return tokenMapValues;
  }

  async getContractMapByAddressKey(_addressKey) {
    var addressObject;
    var contractMap = this.tm.getTokenMapValues(_addressKey);

    // check if contract exists
    if (contractMap == undefined) {
      // Contract not found. Create new contract
      contractMap = await this.addNewTokenContractToMap(_addressKey, spCoinABI);
    }
    return contractMap;
  }

  async addNewTokenContractToMap(_contractAddress, _abi) {
    var contractMap = null;
    try {
      var abi = _abi == undefined ? spCoinABI : _abi;
      var contract = new Contract(_contractAddress, abi, this.signer);
      await contract.init().then(ret => {contractMap = this.tm.mapWalletObjectByAddressKey(contract)});
      //contractMap = this.tm.mapWalletObjectByAddressKey(contract);
    } catch (err) {
      processError(err);
      throw err;
    }
    return contractMap;
  }

  connectValidWalletProvider(_walletName) {
    try {
      // MetaMask requires requesting permission to connect users accounts
      if (_walletName == undefined || _walletName.length == 0) {
        msg = "Error: No Wallet Specified";
        throw { name: "emptyWalletSigner", message: msg };
      }
      var provider = this.getWalletProvider(_walletName);
      if (provider == undefined || provider.length == 0) {
        msg = "Error: Cannot connect to wallet <" + _walletName + ">";
        throw { name: "emptyWalletSigner", message: msg };
      }
      return provider;
    } catch (err) {
      processError(err);
    }
  }

  getWalletProvider(_walletName) {
    var provider;
    try {
      switch (_walletName.toUpperCase()) {
        case "METAMASK":
          provider = connectMetaMask();
          break;
        default:
          throw { "name": "Unknown Provider", "message": "Cannot connect to Wallet Provider " + _walletName };
      }
      //this.accountList = provider.send("eth_requestAccounts", []);
    } catch (err) {
      processError(err);
    }
    return provider;
  }

  async getActiveAccount() {
    try {
      // MetaMask requires requesting permission to connect users accounts
      this.address = await this.signer.getAddress();
      return this.address;
    } catch (err) {
      processError(err);
    }
  }

  setTokenProperty(_address, _propertyKey, _propertyValue) {
    this.tm.setTokenProperty(_address, _propertyKey, _propertyValue);
  }

  async getEthereumAccountBalance() {
    const decimals = 1e18;
    var ethbalance;
    try {
      const balance = await this.signer.getBalance();
      ethbalance = balance.toString() / decimals;
      console.log("account's balance in ether:", ethbalance);
    } catch (err) {
      processError(err);
    }
    return ethbalance;
  }
}

function connectMetaMask() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } catch (err) {
    processError(err);
    throw err;
  }
  return provider;
}