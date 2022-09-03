// Connect contract
async function GUI_connectContract(id, _contractAddress) {
  try {
    var signer = getValidatedSigner();
    contract = await connectValidContract(_contractAddress);
    changeElementIdColor(id, "green");
    GUI_readContractName("contractName_BTN");
    GUI_readContractSymbol("contractSymbol_BTN");
    GUI_readContractTotalSupply("contractTotalSupply_BTN");
    GUI_readContractDecimals("contractDecimals_BTN");
    GUI_readContractTokenSupply("contractTokenSupply_BTN");
    GUI_balanceOf("balanceOf_BTN");
  } catch (err) {
    alertLogError(err, id);
  }
  return contract;
}

async function GUI_readContractName(id) {
  try {
    tokenName = await getContractName();
    document.getElementById(id.replace("_BTN", "_TX")).value = tokenName;
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Valid Contract Required";
    else msg = "Error: readContractName() ";
    alertLogError(
      { name: "ReadNameFailure", message: msg }, id );
  }
}

async function GUI_readContractSymbol(id) {
  try {
    symbol = await getContractSymbol();
    document.getElementById(id.replace("_BTN", "_TX")).value = symbol;
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContracSymbol() ";
    alertLogError(
      { name: "readContracSymbol", message: msg }, id);
  }
}

async function GUI_readContractTotalSupply(id) {
  try {
    spCoinWeiSupply = await getContractTotalSupply();
    document.getElementById(id.replace("_BTN", "_TX")).value = spCoinWeiSupply;
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractTotalSupply() ";
    alertLogError(
      { name: "readContractTotalSupply", message: msg }, id );
  }
}

async function GUI_readContractDecimals(id) {
  try {
    decimals = await getContractDecimals();
    document.getElementById(id.replace("_BTN", "_TX")).value = decimals;
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractDecimals() ";
    alertLogError(
      { name: "readContractDecimals", message: msg }, id);
  }
}

async function GUI_readContractTokenSupply(id) {
  try {
    tokenSupply = await getContractTokenSupply();
    document.getElementById(id.replace("_BTN", "_TX")).value = tokenSupply;
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractTotalSupply() ";
    alertLogError(
      { namereadContractTotalSupply: "", message: msg },id);
  }
}

async function GUI_balanceOf(id) {
  try {
    balance = await getContract().balanceOf(accountAddress);
    document.getElementById(id.replace("_BTN", "_TX")).value = balance;
    console.log("balanceOf " + accountAddress + " = " + balance);
    changeElementIdColor(id, "green");
  } catch (err) {
    console.log(err);
    alert(contract);
    if (contract == null || contract.length == 0)
      msg = "Error: Null/Empty Contract";
    else msg = "Error: readContractBalanceOfName() ";
    alertLogError(
      { name: "GetBalanceOfNameFailure", message: msg }, id);
  }
}

async function GUI_sendTokensToAccount(id, addr, tokkenAmount) {
  try {
    await sendTokensToAccount(addr, tokkenAmount);

    changeElementIdColor(id, "green");
  } catch (err) {
    alertLogError(err, id);
  }
}

async function JUNK_OLD_GUI_sendTokensToAccount(id) {
  try {
    var signer = getValidatedSigner();
    const spCoinContract = new ethers.Contract(
      contractAddress,
      spCoinABI,
      getProvider()
    );
    sendToAccountAddr = document.getElementById("sendToAccountAddr_TX");
    addr = document.getElementById(id.replace("_BTN", "_TX")).value;
    if (!addr && addr.length == 0) {
      console.log("Address is empty");
      sendToAccountAddr.value = "Address is empty";
      changeElementIdColor((id), "red");
    } else {
      if (!ethers.utils.isAddress(addr)) {
        alert("Address %s is not valid", addr);
        changeElementIdColor((id), "red");
      } else {
        spCoinContract.connect(signer).transfer(addr, "500000000");
        changeElementIdColor(id, "green");
      }
    }
  } catch (err) {
    alertLogError(err, id);
  }
}

function clearContractFields() {
  document.getElementById("contractName_TX").value = "";
  document.getElementById("contractSymbol_TX").value = "";
  document.getElementById("contractTotalSupply_TX").value = "";
  document.getElementById("contractDecimals_TX").value = "";
}