var connection;
function getValidWallet(_walletName) {
  connection = connection == undefined ? new Connection(_walletName) : connection;
  return connection.getValidWallet(_walletName);
}

function getConnection(_walletName) {
  return connection == undefined ? new Connection(_walletName) : connection;
}

function validateConnection() {
  if (connection == undefined) {
    var msg = "CONNECTION ERROR: NOT CONNECTED";
    throw { name: "validateConnection", message: msg };
  } 
}

class Connection {
  constructor(_walletName) {
    this.defaultWalletName =
      _walletName == undefined ? "METAMASK" : _walletName;
  }

  connected() {
    return this.wallet == undefined ? false : true;
  }

  getWallet() {
    return this.wallet;
  }

  getValidWallet(_walletName) {
    this.validateWalletName(_walletName);
//  if (!this.connected() || !(this.wallet.walletName != _walletName))
    if (!this.connected())
      this.connect(_walletName);
    return this.wallet;
  }

  connect(_walletName) {
    this.validateWalletName(_walletName);
    this.wallet = new Wallet(_walletName);
    return this.wallet;
  }

  validateWalletName(_walletName) {
    this.walletName =
      _walletName == undefined ? this.defaultWalletName : _walletName;
  }
}

class Wallet {
  constructor(_walletName) {
    try {
      this.walletName = _walletName;
      this.provider = this.connectValidWalletProvider(this.walletName);
      this.decimals = 18;
      this.name = "Ethereum";
      this.symbol = "ETH";
      this.tm = new TokenMap();
    } catch (err) {
      processError(err);
    }
  }

  async initConnection() {
    try {
      this.eth_requestAccounts = await provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      this.address = await this.signer.getAddress();
      this.network = await this.provider.getNetwork();
      this.balance = await this.signer.getBalance();
      this.ethBalance = await this.getEthereumAccountBalance();
      insertTableRow("assetsTable", this.symbol, this.getEthAmount(), this.address, 1);
     } catch (err) {
      processError(err);
      throw err;
    }
  }

  getNetworkName() {
    return this.network.name;
  }

  getEthAmount() {
    return  weiToAmount(this.balance, this.decimals);
  }

  dump() {
    var walletToString = this.toString();
    alert(walletToString);
    console.log(walletToString);
  }
  
  toString () {
    var walletMapValues = this.setWalletMapValues ();
    let text = "";
    for (const entry of walletMapValues.entries()) {
      if (entry[0] == "Tokens") {
        text += entry[0] + ":\n" +  entry[1].toString();
      }
      else {
        text += entry + "\n";
      }
    }
    return text;
  }

  setWalletMapValues () {
    // ToDo Write this.
    var walletMapValues = new Map([]);
    walletMapValues.set("Wallet", this.walletName);
    walletMapValues.set("Account Address", this.address);
    walletMapValues.set("Network Name", this.getNetworkName());
    walletMapValues.set("name", this.name);
    walletMapValues.set("symbol", this.symbol);
    walletMapValues.set("balance", this.balance);
    walletMapValues.set("decimals", this.decimals);
    walletMapValues.set("Etherium Balance", this.ethBalance);
    walletMapValues.set("Tokens", this.tm);
    return walletMapValues;
  }

  getTokenMapValues(tokenMapValues) {
    let text = "";
    for (const x of tokenMapValues.entries()) {
      text += x + "\n";
    }
    return text;
  }

  async getEthereumAccountBalance() {
    const decimals = 1e18;
    var ethbalance;
    try {
      const balance = await this.signer.getBalance();
      ethbalance = weiToAmount(balance, this.decimals);
      console.log("account's balance in ether:", ethbalance);
    } catch (err) {
      processError(err);
    }
    return ethbalance;
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
      console.log(err);
      var msg = "Token symbol not found: " + this.name + " (" + this.symbol + ")"
      msg += "\nContract: " + _contractAddress;
      msg += "\nNetwork: " + this.getNetworkName();
      throw { name: "addNewTokenContractToMap", message: msg };
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
    var tokenSupply = weiToAmount(totalSupply, decimals);
    var balanceOf = await contract.balanceOf(this.address);

    var outputStr = "name = " + name + "\n";
    outputStr += " symbol " + symbol + "\n";
    outputStr += " totalSupply " + totalSupply + "\n";
    outputStr += " decimals " + decimals + "\n";
    outputStr += " balanceOf " + balanceOf + "\n";
    console.log("Loaded Token\n" + outputStr);
    this.setTokenProperty(contractAddressKey, "contract",    contract);
    this.setTokenProperty(contractAddressKey, "name",        name);
    this.setTokenProperty(contractAddressKey, "symbol",      symbol);
    this.setTokenProperty(contractAddressKey, "totalSupply", totalSupply);
    this.setTokenProperty(contractAddressKey, "decimals",    decimals);
    this.setTokenProperty(contractAddressKey, "tokenSupply", tokenSupply);
    this.setTokenProperty(contractAddressKey, "balanceOf",   balanceOf);
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

  getContractSet() {
    return this.tm.getContractSet();
  }

  setTokenProperty(_address, _propertyKey, _propertyValue) {
    this.tm.setTokenProperty(_address, _propertyKey, _propertyValue);
  }

}

function connectMetaMask() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } catch (err) {
    alertLogErrorMessage(err);
    throw err;
  }
  return provider;
}

async function connectMetamask2() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();

  console.log("Account address is:", await signer.getAddress());
}
