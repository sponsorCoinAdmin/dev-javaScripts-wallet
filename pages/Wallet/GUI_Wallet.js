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
async function GUI_connectWallet(_id, _walletName) {
  try {
    var wallet = getValidWallet(_walletName);

    validateConnection();
    await wallet.initConnection();
    document.getElementById("menuConnect_BTN").style.display = "none";
    document.getElementById("menuConnected_BTN").style.display = "block";
    changeElementIdColor("menuConnected_BTN", "green");
    var headerText=document.getElementById("header_SPAN");
    headerText.textContent ="Network: " + wallet.getNetworkName();
    var headerText2=document.getElementById("header2_SPAN");
    headerText2.textContent ="Account:"+wallet.address;
  } catch (err) {
    alertLogError(err, _id);
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


async function GUI_getActiveAccount(_id) {
  try {
    // MetaMask requires requesting permission to connect users accounts
    validateConnection();
    accountAddress = await wallet.getActiveAccount();
    //    accountAddress = await getActiveAccount(signer);
    document.getElementById(_id.replace("_BTN", "_TX")).value = accountAddress;
    changeElementIdColor(_id, "green");
  } catch (err) {
    document.getElementById(_id.replace("_BTN", "_TX")).value = "";
    alertLogError(err, _id);
  }
}

function GUI_OpenPopupWallet() {
  document.getElementById("walletPopup_Div").style.display = "block";
  setWindowCentre("walletPopup_Div");
}

function GUI_ClosePopupWallet() {
  document.getElementById("walletPopup_Div").style.display = "none";
}

async function getAccountBalanceOf(_contract, _contractAddress, _id_TX) {
  var element = document.getElementById(_id_TX);
  var promiseBalanceOf = await _contract.balanceOF(_contractAddress);
  _id_TX.value = promiseBalanceOf.value();
}

function toggleById(_id) {
  element = document.getElementById(_id);
  if (element.style.display == "block") {
    element.style.display = "none";
  } else {
    element.style.display = "block";
  }
}

function hideElementById(_id) {
    element = document.getElementById(_id);
    element.style.display = "none";
}

function showElementById(_id) {
  element = document.getElementById(_id);
  element.style.display = "block";
}

function hideElementsByClass(_className) {
  var selectedClasses = document.getElementsByClassName(_className);
  for (var i = 0; i < selectedClasses.length; i++) {
    selectedClasses[i].style.display = "none";
  }
}

function showElementsByClass(_className) {
  var selectedClasses = document.getElementsByClassName(_className);
  for (var i = 0; i < selectedClasses.length; i++) {
    selectedClasses[i].style.display = "block";
  }
}

function activateMenuDiv(_menuId) {
  hideElementsByClass("menu_Class");
  showElementById(_menuId);
}

function activateWalletBodyDiv(_walletId) {
  var elementClass = "walletBodyContainer";
  activateDiv(_walletId, elementClass);
}

function activateDiv(_menuId, _elementClass) {
   hideElementsByClass(_elementClass);
   showElementById(_menuId);
 }

 function GUI_loadContractsFromTable(_tableId, _colIdx) {
  try {
    validateConnection()
    var contracts = loadColumnValuesAsSet(_tableId, _colIdx);
    for (const addr of contracts.values()) {
      //contractMap = await wallet.getValidTokenContract(addrKey);

      addContractAddress(addr);
    }
  } catch (err) {
    alertLogError(err);
  }
}

function GUI_loadContractsFromWallet(_wallet) {
  try {
    validateConnection();
    var wallet = getValidWallet(_wallet);
    var contracts = wallet.getContractSet();
    for (const addr of contracts.values()) {
      addContractAddress(addr);
    }
  } catch (err) {
    alertLogError(err);
  }
}

async function addContractAddress(_addrKey) {
  try {
    validateConnection();
    var wallet = getValidWallet();
    if (!wallet.tokenExists(_addrKey)) {
      contractMap = await wallet.getValidTokenContract(_addrKey);
      addTableRow("assetsTable", _addrKey);
    }
  } catch (err) {
    alertLogError(err, _addrKey);
  }
  return contractMap;
}
