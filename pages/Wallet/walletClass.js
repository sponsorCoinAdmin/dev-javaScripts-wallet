// let connection = new Connection();

class Connection {
  constructor (_walletName) {
    this.defaultWalletName = _walletName == undefined ? "METAMASK" : _walletName;
  }

  connected() {
    return this.wallet == undefined ? false : true;
  }

  getWallet () {
    return this.wallet;
  }

  getAvailableConnection (_walletName) {
    this.validateWalletName (_walletName);
    if (!this.connected() || !(this.wallet.walletName != _walletName))
      this.connect (_walletName);
    return this.wallet;
  }

  connect (_walletName) {
    this.validateWalletName (_walletName);
    this.wallet = new Wallet(_walletName);
    return this.wallet;
  }

  validateWalletName (_walletName) {
    this.walletName = _walletName == undefined ? this.defaultWalletName: _walletName;
  }
}

class Wallet {
  constructor(_walletName) {
    try {
      this.walletName = _walletName;
      this.decimals = 18;
      this.eth_requestAccounts;
      this.name = "Ethereum";
      this.symbol = "ETH";
      this.tm = new TokenMap();
    } catch (err) {
      processError(err);
    }
  }

  async init() {
    try {
      this.provider = this.connectValidWalletProvider(this.walletName);
      await this.provider.send("eth_requestAccounts", []).then(requestAccounts => {this.eth_requestAccounts = requestAccounts})
      .catch(error => {throw error});
      this.address = this.eth_requestAccounts.toString();
      this.signer = await provider.getSigner();
      this.network = await provider.getNetwork();
      this.network_name  = this.network.name;
      this.balance = await this.getEthereumAccountBalance();
      this.totalSupply = await this.signer.getBalance();
      this.tokenSupply = weiToToken(this.totalSupply, this.decimals);
      var tokenMapValues = this.tm.mapWalletObjectByAddressKey(this);
    } catch (err) {
      processError(err);
      throw err;
    }
    return tokenMapValues;
  }
 
  async getContractMapByAddressKey(_addressKey) {
    var contractMap = this.tm.getTokenMapValues(_addressKey);

    // check if contract exists
    if (contractMap == undefined) {
      // Contract not found. Create new contract
      contractMap = await this.addNewTokenContractToMap(_addressKey, SPCOIN_ABI);
    }
    return contractMap;
  }

  async addNewTokenContractToMap(_contractAddress, _ABI) {
    var contractMap = null;
    try {
      var abi = _ABI == undefined ? SPCOIN_ABI : _ABI;
      var contract = new ethers.Contract(_contractAddress, abi, this.signer);
      await this.setContractValues (contract);

      //contractMap = this.tm.mapWalletObjectByAddressKey(contract);
    } catch (err) {
      processError(err);
      throw err;
    }
    return contractMap;
  }

  async setContractValues (contract) {
    var contractAddressKey = contract.address;
    var values = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply(),
      contract.decimals(),
    ]);
    console.log(values);
    var name = values[0];
    var symbol = values[1];
    var totalSupply = values[2];
    var decimals = values[3];
    var tokenSupply = weiToToken(totalSupply, decimals);
    var balanceOf = await contract.balanceOf(this.address);

    var outputStr = "name = " + name + "\n";
    outputStr += " symbol " + symbol + "\n";
    outputStr += " totalSupply " + totalSupply + "\n";
    outputStr += " decimals " + decimals + "\n";
    outputStr += " balanceOf " + balanceOf + "\n";
    alert("Loaded Token\n" + outputStr);
    this.tm.setTokenProperty(contractAddressKey, "contract",    contract);
    this.tm.setTokenProperty(contractAddressKey, "name",        name);
    this.tm.setTokenProperty(contractAddressKey, "symbol",      symbol);
    this.tm.setTokenProperty(contractAddressKey, "totalSupply", totalSupply);
    this.tm.setTokenProperty(contractAddressKey, "decimals",    decimals);
    this.tm.setTokenProperty(contractAddressKey, "tokenSupply", tokenSupply);
    this.tm.setTokenProperty(contractAddressKey, "balanceOf",   balanceOf);
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