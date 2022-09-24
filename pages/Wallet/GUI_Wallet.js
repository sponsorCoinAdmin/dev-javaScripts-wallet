var activePage = "home";
// Get arbitrary element with id "my-element"
var elementToCheckIfClicksAreInsideOf = document.querySelector('#walletPopup_Div');
// Listen for click events on body
document.addEventListener('click', function (event) {
  if (elementToCheckIfClicksAreInsideOf.contains(event.target)) {
    console.log('clicked inside');
  } else {
    console.log('clicked outside');
    }
});

function GUI_initPage() {
  //clearContractFields();
  document.getElementById("walletPopup_Div").style.display = "none";
  window.addEventListener(
    "resize",
    function (event) {
      setWindowCentre("walletPopup_Div");
    },
    true
  );
}

// 1. Connect Metamask with Dapp
async function GUI_connectWallet(id, _walletName) {
  try {
    var wallet = getWallet(_walletName);

    validateConnection();
    await wallet.init();
    document.getElementById("menuConnect_BTN").style.display = "none";
    document.getElementById("menuConnected_BTN").style.display = "block";
    changeElementIdColor("menuConnected_BTN", "green");
    var headerText=document.getElementById("header_SPAN");
    headerText.textContent ="Network: " + wallet.network_name;
    var headerText2=document.getElementById("header2_SPAN");
    headerText2.textContent ="Account:"+wallet.address;
  } catch (err) {
    alertLogError(err, id);
    document.getElementById("ethereumAccountBalance_TX").value = "";
  }
}

async function GUI_AddTokenContract(id) {
  try {
    var tokenSelectorStr = id.replace("_BTN", "_SEL");
    var tokenSelector = document.getElementById(id.replace("_BTN", "_SEL"));
    var addressKey = document.getElementById(id.replace("_BTN", "_ADR")).value;
    contractMap = await addContractAddress(addressKey);
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById(id.replace("_BTN", "_TX")).value = "";
    alertLogError(err, id);
  }
}

async function addContractAddress(addrKey) {
  try {
    validateConnection();
    var wallet = getWallet();
    contractMap = await wallet.getContractMapByAddressKey(addrKey);
    addTableRow("assetsTable", addrKey);
  } catch (err) {
    alertLogError(err, addrKey);
  }
  return contractMap;
}

// 2. Connect Active Account
async function GUI_getActiveAccount(id) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    validateConnection();
    accountAddress = await wallet.getActiveAccount();
    //    accountAddress = await getActiveAccount(signer);
    document.getElementById(id.replace("_BTN", "_TX")).value = accountAddress;
    changeElementIdColor(id, "green");
  } catch (err) {
    document.getElementById(id.replace("_BTN", "_TX")).value = "";
    alertLogError(err, id);
  }
}

function GUI_OpenPopupWallet() {
  document.getElementById("walletPopup_Div").style.display = "block";
  setWindowCentre("walletPopup_Div");
}

function GUI_ClosePopupWallet() {
  document.getElementById("walletPopup_Div").style.display = "none";
}

async function getAccountBalanceOf(contract, contractAddress, id_TX) {
  var element = document.getElementById(id_TX);
  var promiseBalanceOf = await contract.balanceOF(contractAddress);
  id_TX.value = promiseBalanceOf.value();
}

function toggleById(id) {
  element = document.getElementById(id);
  if (element.style.display == "block") {
    element.style.display = "none";
  } else {
    element.style.display = "block";
  }
}

function hideElementById(id) {
    element = document.getElementById(id);
    element.style.display = "none";
}

function showElementById(id) {
  element = document.getElementById(id);
  element.style.display = "block";
}

function hideElementsByClass(className) {
  var selectedClasses = document.getElementsByClassName(className);
  for (var i = 0; i < selectedClasses.length; i++) {
    selectedClasses[i].style.display = "none";
  }
}

function showElementsByClass(className) {
  var selectedClasses = document.getElementsByClassName(className);
  for (var i = 0; i < selectedClasses.length; i++) {
    selectedClasses[i].style.display = "block";
  }
}

function activateMenuDiv(menuId) {
  hideElementsByClass("menu_Class");
  showElementById(menuId);
}

function activateMenuDiv2(menuId) {
  var elementClass = "menu_Class";
  activateDiv(menuId, elementClass)
}

function activateWalletBodyDiv(walletId) {
  var elementClass = "walletBodyContainer";
  activateDiv(walletId, elementClass);
}

function activateDiv(menuId, elementClass) {
   hideElementsByClass(elementClass);
   showElementById(menuId);
 }
