// Connect contract
async function GUI_connectContract(id, _contractAddress) {
  try {
    var abi = SPCOIN_ABI;
    wallet  = new Wallet("METAMASK");
   // wallet.init();

    var contractWrap = new ContractWrap(_contractAddress, SPCOIN_ABI, wallet.signer);
    await contractWrap.init();

    var name = contractWrap.name;
    var symbol = contractWrap.symbol;
    var totalSupply = contractWrap.totalSupply;
    var decimals = contractWrap.decimals;
    var tokenSupply = contractWrap.tokenSupply;

    changeElementIdColor(id, "green");
  } catch (err) {
    alertLogError(err, id);
  }
  return contractWrap;
}

async function GUI_readContractName(id) {
  try {
    tokenName = await getContractName();
    document.getElementById(id.replace("_BTN", "_TX")).value = tokenName;
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById(id.replace("_BTN","_TX")).value = "";
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
    document.getElementById(id.replace("_BTN","_TX")).value = "";
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
    document.getElementById(id.replace("_BTN","_TX")).value = "";
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
    document.getElementById(id.replace("_BTN","_TX")).value = "";
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
    alert("GUI_readContractTokenSupply(id) ");
    document.getElementById(id.replace("_BTN", "_TX")).value = tokenSupply;
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById(id.replace("_BTN","_TX")).value = "";
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

function loadContractFields() {
  GUI_readContractName("contractName_BTN");
  GUI_readContractSymbol("contractSymbol_BTN");
  GUI_readContractTotalSupply("contractTotalSupply_BTN");
  GUI_readContractDecimals("contractDecimals_BTN");
  GUI_balanceOf("balanceOf_BTN");
}

function clearContractFields() {
  document.getElementById("contractName_TX").value = "";
  document.getElementById("contractSymbol_TX").value = "";
  document.getElementById("contractTotalSupply_TX").value = "";
  document.getElementById("contractDecimals_TX").value = "";
  document.getElementById("contractWeiSupply_TX").value = "";
}