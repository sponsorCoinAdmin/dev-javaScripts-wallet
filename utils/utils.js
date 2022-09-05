function changeElementIdColor(name, color) {
  document.getElementById(name).style.backgroundColor = color;
}

function isEmpty(obj) {
  var isEmpty = false;
  if (obj == null || obj == undefined || obj == "")
    isEmpty = true;
  else
    isEmpty = JSON.stringify(obj) === "{}";
  return isEmpty;

//   if (obj == null || obj == undefined || obj == "")
//   return true;
// else
//   return false;

}

function processError(err) {
  console.log(err);
  throw err;
}

class disconnectContract {
  constructor() {
    this.contractAddress = undefined;
    this.contract = undefined;
  }
}

function alertLogError(err, element) {
  alertLogErrorMessage(err.message);
  changeElementIdColor(element, "red");
}

function alertLogErrorMessage(msg) {
  console.log(msg);
  alert(msg);
}

function changeElementIdColor(name, color) {
  document.getElementById(name).style.backgroundColor = color;
}

function toggle(elmtStr) {
  var elmtObj = document.getElementById(elmtStr);
  if (elmtObj.style.display === "none") {
    elmtObj.style.display = "block";
  } else {
    elmtObj.style.display = "none";
  }
}

function weiToToken(wei, decimals) {
  var mod = 10 ** decimals;
  var tokens = wei / mod;
  return tokens;
}

function tokensToWei(tokens, decimals) {
  var mod = 10 ** decimals;
  var wei = tokens * mod;
  return wei;
}

function clearFields() {
  document.onclicklocation.reload(true);
}

function popUpWindowCenter(id) {
  activateMenuDiv(id);
  setWindowCentre(id);
}


function popupAddTokenForm(tokenSelect) {
  setWindowCentre("walletPopup_Div");
}

function setWindowCentre(id) {
  var popupDiv = document.getElementById(id);

  var windowCenterWidth = window.innerWidth / 2;
  var windowCenterHeight = window.innerHeight / 2;

  var popupCenterWidth = popupDiv.clientWidth;
  var popupCenterHeight = popupDiv.clientHeight;

  var leftWindowMargin = windowCenterWidth - (popupCenterWidth / 2);
  var topWindowMargin = windowCenterHeight - (popupCenterHeight / 2);

  // popupDiv.style.top = topWindowMargin+"px";
  popupDiv.style.top = "60px";
  popupDiv.style.right = leftWindowMargin+"px";
}