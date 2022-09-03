// 1. Connect Metamask with Dapp
async function GUI_connectWallet(id, _walletName) {
  try {
    provider = await connectValidWalletProvider(_walletName);
    setWalletName(_walletName);
    changeElementIdColor(id, "green");
    GUI_getActiveAccount("activeAccount_BTN");
  } catch (err) {
    document.getElementById("activeAccount_TX").value = "";
    document.getElementById("ethereumAccountBalance_TX").value = "";
    disconnectWallet();
    alertLogError(err, id);
  }
}

// 2. Connect Active Account
async function GUI_getActiveAccount(id) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    var signer = getValidatedSigner();
    accountAddress = await getActiveAccount(signer);
    document.getElementById(id.replace("_BTN","_TX")).value = accountAddress;
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById("activeAccount_TX").value = "";
    alertLogError(err, id);
  }
}

// 3. Get Ethereum balance
async function GUI_getEthereumAccountBalance(id) {
  try {
    var signer = getValidatedSigner();
    const balance = await signer.getBalance();
    const convertToEth = 1e18;
    const ethbalance = balance.toString() / convertToEth;
    document.getElementById(id.replace("_BTN","_TX")).value = ethbalance;
    console.log(
      "account's balance in ether:",
      balance.toString() / convertToEth
    );
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById("ethereumAccountBalance_TX").value = "";
    alertLogError(err, id);
  }
}
