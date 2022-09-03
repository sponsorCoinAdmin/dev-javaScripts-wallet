// Wallet Vars
var defaultWalletName = "METAMASK";
var walletName;
var provider;
var signer;
var accountAddress;
var accountList;

async function connectMetaMask() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    provider = new ethers.providers.Web3Provider(window.ethereum);
    accountList = provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
  } catch (err) {
      processError(err);
    throw err;
  }
  return provider;
}

function setWalletName(_walletName) {
  this.walletName = _walletName;
}

function getWalletName() {
  return walletName;
}

async function getWalletProvider(_walletName) {
  try {
    switch (_walletName.toUpperCase()) {
      case "METAMASK":
        provider = await connectMetaMask();
        break;
      default:
        throw {"name":"Unknown Provider", "message":"Cannot connect to Wallet Provider " + provider};
    }
  } catch (err) {
    processError(err);
  }
  return provider;
}

function getProvider(_walletName) {
  return provider;
}

function getSigner() {
  return signer;
}

function getValidatedSigner() {
  try {
    if (signer == null) {
      signer = getSigner();
      if (signer == undefined)
        throw {
          name: "emptyWalletSigner",
          message: "Error: Valid Wallet Connection Required",
        };
    }
  } catch (err) {
    processError(err);
  }
  return signer;
}

// 1. Connect Metamask with Dapp
async function connectWalletProvider(_walletName) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    provider = getWalletProvider(_walletName);
      return provider;
  } catch (err) {
    processError(err);
  }
}

function connectValidWalletProvider(_walletName) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    if (_walletName == undefined || _walletName.length == 0) {
      msg = "Error: No Wallet Specified";
      throw { name: "emptyWalletSigner", message: msg };
    }
     var provider = getWalletProvider(_walletName);
    if (provider == undefined || provider.length == 0) {
      msg = "Error: Cannot connect to wallet <" + _walletName + ">";
      throw { name: "emptyWalletSigner", message: msg };
    }
    this.provider = provider;
    return provider;
  } catch (err) {
    processError(err);
  }
}

// 2. Connect Metamask Account
async function getActiveAccount(_signer) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    accountAddress = await _signer.getAddress();
    return accountAddress;
  } catch (err) {
    processError(err);
  }
}

// 3. Get Ethereum balance
async function getEthereumAccountBalance() {
  try {
    const balance = await getSigner().getBalance();
    const convertToEth = 1e18;
    const ethbalance = balance.toString() / convertToEth;
    console.log(
      "account's balance in ether:",
      balance.toString() / convertToEth
    );
  } catch (err) {
    processError(err);
  }
  return balance;
}

function disconnectWallet() {
  this.walletName = undefined;
  this.accountAddress = undefined;
  this.provider = undefined;
  this.signer = undefined;
}
