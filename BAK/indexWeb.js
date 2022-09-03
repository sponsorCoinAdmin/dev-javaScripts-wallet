// 1. Connect Metamask with Dapp
async function GUI_connectWallet(_walletName) {
  try {
    provider = await connectValidWalletProvider(_walletName);
    setWalletName(_walletName);
    changeElementIdColor("connectWallet_BTN", "green");
  } catch (err) {
    document.getElementById("activeAccount_TX").value = "";
    document.getElementById("ethereumAccountBalance_TX").value = "";
    disconnectWallet();
    alertLogError(err, "connectWallet_BTN");
  }
}

// 2. Connect Active Account
async function GUI_getActiveAccount() {
  try {
    // MetaMask requires requesting permission to connect users accounts
    var signer = getValidatedSigner();
    accountAddress = await getActiveAccount(signer);
    document.getElementById("activeAccount_TX").value = accountAddress;
    changeElementIdColor("activeAccount_BTN", "green");
  } catch (err) {
    document.getElementById("activeAccount_TX").value = "";
    alertLogError(err, "activeAccount_BTN");
  }
}

// 3. Get Ethereum balance
async function GUI_getEthereumAccountBalance() {
  try {
    var signer = getValidatedSigner();
    const balance = await signer.getBalance();
    const convertToEth = 1e18;
    const ethbalance = balance.toString() / convertToEth;
    document.getElementById("ethereumAccountBalance_TX").value = ethbalance;
    console.log(
      "account's balance in ether:",
      balance.toString() / convertToEth
    );
    changeElementIdColor("ethereumAccountBalance_BTN", "green");
  } catch (err) {
    document.getElementById("ethereumAccountBalance_TX").value = "";
    alertLogError(err, "ethereumAccountBalance_BTN");
  }
}

// 4. Connect contract
async function GUI_connectContract(_contractAddress) {
  try {
    var signer = getValidatedSigner();
    contract = new ethers.Contract(_contractAddress, spCoinABI, signer);
    setContractAddress(_contractAddress);
    // do a test call to see if contract is valid.
    tokenName = await contract.name();
    changeElementIdColor("connectContract_BTN", "green");
  } catch (err) {
    document.getElementById("connectContract_TX").value = "";
    alertLogError(err, "connectContract_BTN");
  }
  return contract;
}

async function GUI_readContractName() {
  try {
    tokenName = await getContract().name();
    document.getElementById("contractName_TX").value = tokenName;
    changeElementIdColor("contractName_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractName() ";
    alertLogError(
      { name: "ReadNameFailure", message: msg },
      "contractName_BTN"
    );
  }
}

async function GUI_readContractSymbol() {
  try {
    symbol = await getContract().symbol();
    document.getElementById("contractSymbol_TX").value = symbol;
    changeElementIdColor("contractSymbol_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContracSymbol() ";
    alertLogError(
      { name: "readContracSymbol", message: msg },
      "contractSymbol_BTN"
    );
  }
}

async function GUI_readContractTotalSupply() {
  try {
    spCoinTotalSupply = await getContract().totalSupply();
    document.getElementById("contractTotalSupply_TX").value = spCoinTotalSupply;
    changeElementIdColor("contractTotalSupply_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractTotalSupply() ";
    alertLogError(
      { name: "readContractTotalSupply", message: msg },
      "contractTotalSupply_BTN"
    );
  }
}

async function GUI_readContractDecimals() {
  try {
    decimals = await getContract().decimals();
    document.getElementById("contractDecimals_TX").value = decimals;
    changeElementIdColor("contractDecimals_BTN", "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractDecimals() ";
    alertLogError(
      { name: "readContractDecimals", message: msg },
      "contractDecimals_BTN"
    );
  }
}

async function GUI_balanceOf() {
  try {
    balance = await getContract().balanceOf(accountAddress);
    document.getElementById("balanceOf_TX").value = balance;
    console.log("balanceOf " + accountAddress + " = " + balance);
    changeElementIdColor("balanceOf_BTN", "green");
  } catch (err) {
    console.log(err);
    alert(contract);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractBalanceOfName() ";
    alertLogError(
      { name: "GetBalanceOfNameFailure", message: msg },
      "balanceOf_BTN"
    );
  }
}

async function GUI_sendToAccount() {
  try {
    var signer = getValidatedSigner();
    const spCoinContract = new ethers.Contract(
      contractAddress,
      spCoinABI,
      getProvider()
    );
    sendToAccountAddr = document.getElementById("sendToAccountAddr_TX");
    addr = document.getElementById("sendToAccountAddr_TX").value;
    if (!addr && addr.length == 0) {
      console.log("Address is empty");
      sendToAccountAddr.value = "Address is empty";
      changeElementIdColor("sendToAccountAddr_TX", "red");
      changeElementIdColor("sendToAccount_BTN", "red");
    } else {
      if (!ethers.utils.isAddress(addr)) {
        alert("Address %s is not valid", addr);
        changeElementIdColor("sendToAccountAddr_TX", "red");
        changeElementIdColor("sendToAccount_BTN", "red");
      } else {
        spCoinContract.connect(signer).transfer(addr, "500000000");
        changeElementIdColor("sendToAccount_BTN", "green");
      }
    }
  } catch (err) {
    alertLogError(err, "sendToAccount_BTN");
  }
}

function alertLogError(err, element) {
  console.log(err.message);
  changeElementIdColor(element, "red");
  alert(err.message);
}

function changeElementIdColor(name, color) {
  document.getElementById(name).style.backgroundColor = color;
}
function toggle(elmtStr) {
  elmtObj = document.getElementById(elmtStr);
  if (elmtObj.style.display === "none") {
    elmtObj.style.display = "block";
  } else {
    elmtObj.style.display = "none";
  }
}

function WEB_isEmptyObj(object) {
  isEmpty = JSON.stringify(object) === "{}";
  return isEmpty;
}
