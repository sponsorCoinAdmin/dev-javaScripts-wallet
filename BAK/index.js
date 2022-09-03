// Wallet Vars
var defaultWalletName = "METAMASK";
var walletName;
var provider;
var signer;
var accountAddress;

// Contract Vars;
const spCoinContractAddress = "0x334710ABc2Efcc3DF2AfdA839bF8d0dA923dB36A";
var contractAddress;
var contract;

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

function getWalletName() {
  //   try {
  //     if (walletName == null) {
  //       walletName = defaultWalletName;
  //     }
  //   } catch (err) {
  //     processError(err);
  //   }
  return walletName;
}

function getContract() {
  try {
    if (contract == null) {
      contract = new ethers.Contract(contractAddress, spCoinABI, getSigner());
    }
  } catch (err) {
    processError(err);
  }
  return contract;
}

function getWalletProvider(_walletName) {
  //  if (_walletName == undefined) _walletName = defaultWalletName;
  try {
    switch (_walletName.toUpperCase()) {
      case "METAMASK":
        provider = connectMetaMask();
        break;
      default:
        provider = undefined;
        break;
    }
  } catch (err) {
    processError(err);
  }
  return provider;
}

function getProvider(_walletName) {
  try {
    if (provider == null) {
      provider = getWalletProvider(getWalletName());
    }
  } catch (err) {
    processError(err);
  }
  return provider;
}

function getSigner() {
  try {
    if (signer == null) {
      signer =
        getProvider() != undefined ? getProvider().getSigner() : undefined;
    }
  } catch (err) {
    processError(err);
  }
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

    /*
	  await getProvider().send("eth_requestAccounts", []);
	  signer = await getSigner();
	  
	   */
    return provider;
  } catch (err) {
    processError(err);
  }
}

async function connectValidWalletProvider(_walletName) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    if (_walletName == undefined || _walletName.length == 0) {
        msg = "Error: No Wallet Specified";
        throw { name: "emptyWalletSigner", message: msg };
    }
    var provider = getWalletProvider(_walletName);
	if (provider == undefined || provider.length == 0) {
		msg = "Error: Cannot connect to wallet <"+_walletName+">";
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

// 4. Connect contract
async function connectContract() {
  try {
    contract = new ethers.Contract(getAddress(), spCoinABI, getSigner());
    // do a test call to see if contract is valid.
    tokenName = await contract.name();
  } catch (err) {
    processError(err);
  }
  return contract;
}

async function readContractName() {
  try {
    tokenName = await getContract().name();
  } catch (err) {
    processError(err);
  }
  return tokenName;
}

async function readContractSymbol() {
  try {
    symbol = await getContract().symbol();
  } catch (err) {
    throw err;
  }
}

async function readContractTotalSupply() {
  try {
    spCoinTotalSupply = await getContract().totalSupply();
    return supply;
  } catch (err) {
    processError(err);
  }
}

async function readContractDecimals() {
  try {
    decimals = await getContract().decimals();
    return decimals;
  } catch (err) {
    processError(err);
  }
}

async function balanceOf() {
  try {
    balance = await getContract().balanceOf(accountAddress);
    return balance;
  } catch (err) {
    processError(err);
  }
}

async function sendToAccount(addr) {
  try {
	var signer = getValidatedSigner();
    const spCoinContract = new ethers.Contract(
      contractAddress,
      spCoinABI,
      getProvider()
    );
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

function changeElementIdColor(name, color) {
  document.getElementById(name).style.backgroundColor = color;
}

function isEmptyObj(object) {
  isEmpty = JSON.stringify(object) === "{}";
  return isEmpty;
}

function processError(err) {
  throw err;
}

function disconnectContract() {
  this.contractAddress = undefined;
	this.contract = undefined;
}

function disconnectWallet() {
  this.walletName = undefined;
  this.accountAddress = undefined;
	this.provider = undefined;
	this.signer = undefined;
}