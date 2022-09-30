class TableManagerClass {
  constructor() {
   }
}

function mapWalletToTable(wallet) {
  mapTokensToTable(wallet.tm, "assetsTable");
}

function mapTokensToTable(tm, tableId) {
  for (let [addrKey] of tm.addrMapObjs) {
    addTableRow(tableId, addrKey);
  }
}

// ToDo: Check Table Values Instead
// function addressFound(addr) {
//   var wallet = connection.getValidWallet();
//   var tm = wallet.tm;
//   return tm.getTokenMapValues(addr) == undefined ? false : true;
// }

function populateContractProperties(symbol) {
  validateConnection();
  var wallet = connection.getValidWallet();
  var tm = wallet.tm;
  var addressKey;
  for (let [addrKey] of tm.tokenMapObjects) {
    var searchSymbol = tm.getTokenProperty(addrKey, "symbol");
    if (symbol == searchSymbol) {
      addressKey = addrKey;
      setContractProperties(addressKey);
      break;
    }
  }
  activateWalletBodyDiv("contract_DIV");
}

function setContractProperties(addressKey) {
  var contractAddress = tm.getTokenProperty(addressKey, "address");
  var name = tm.getTokenProperty(addressKey, "name");
  var symbol = tm.getTokenProperty(addressKey, "symbol");
  var contractWeiSupply = tm.getTokenProperty(addressKey, "totalSupply");
  var decimals = tm.getTokenProperty(addressKey, "decimals");
  var ContractTokenSupply = tm.getTokenProperty(addressKey, "tokenSupply");
  var symbolName = "<b>" + symbol + " - " + name + " Contract Details</b>";
  document.getElementById("Contract_Header").innerHTML = symbolName;
  document.getElementById("contractAddress_TX").value = contractAddress;
  document.getElementById("contractDecimals_TX").value = decimals;
  document.getElementById("contractWeiSupply_TX").value = contractWeiSupply;
  document.getElementById("contractTokenSupply_TX").value = ContractTokenSupply;

  var contract = tm.getTokenProperty(addressKey, "contract");
  getAccountBalanceOf(contract, contractAddress, "accountBalanceOf_TX");
  activateWalletBodyDiv("contract_DIV");
}

function addNewTestToken(tableId) {
  var table = document.getElementById(tableId);
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = "NEW Token Name";
  cell2.innerHTML = "NEW Token Symbol";
  cell3.innerHTML = "NEW Token Address";
}

function sortTable(tableId, colIdx) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(tableId);
  switching = true;
  /*Make a loop that will continue until
    no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
      first, which contains table headers):*/
    for (i = 2; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
        one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[colIdx];
      y = rows[i + 1].getElementsByTagName("TD")[colIdx];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function loadColumnValuesAsSet(tableId, colIdx) {
  columnValueSet = new Set();
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(tableId);
  rows = table.rows;
  for (var idx = 1; idx < rows.length; idx++) {
    var row = rows[idx];
    cell = row.getElementsByTagName("TD")[colIdx];
    cellValue = cell.innerHTML;
    columnValueSet.add(cellValue);
  }
  return columnValueSet;
}


function addTableRow(tableId, addrKey) {
  validateConnection();
  wallet = connection.getValidWallet();
//  if (!addressFound(addrKey)) {
    tm = wallet.tm;
    var contract = tm.getTokenProperty(addrKey, "contract");
//    addressMap.set(addrKey, contract);
    var symbol = tm.getTokenProperty(addrKey, "symbol");
    var balanceOf = tm.getTokenProperty(addrKey, "balanceOf");
    var decimals = tm.getTokenProperty(addrKey, "decimals");
    var amount = weiToAmount(balanceOf, decimals);
    insertTableRow(tableId, symbol, amount, addrKey, 2);
    return true;
  // }
  // return false;
}

function insertTableRow(tableId, symbol, amount, addrKey, row) {
  if (row == undefined) row = 2;
  var table = document.getElementById(tableId);

  var row = table.insertRow(row);
  var cell_Idx = 0;

  var cell0 = row.insertCell(cell_Idx++);
  cell0.className = symbol + "_CELL";
  cell0.innerHTML =
    '<a href="#" onclick="populateContractProperties(\'' +
    symbol +
    "')\">" +
    symbol +
    "</a>";

  var cell1 = row.insertCell(cell_Idx++);
  cell1.className = "holdings" + "_CELL";
  cell1.innerHTML = amount;

  var cell2 = row.insertCell(cell_Idx++);
  cell2.className = "address" + "_CELL";
  cell2.className = "address" + "_CELL";
  cell2.innerHTML = addrKey;

  var trash = '<img src="/images/icon-trash.png" height=25 width=25></img>';
  var cell3 = row.insertCell(cell_Idx++);
  cell3.className = "delete" + "_CELL";
  cell3.innerHTML = '<a href="#" onclick="deleteRow(this)">' + trash + "</a>";

  hide_show_table("address_CELL", "hide");
}

function deleteRow(elem) {
  try {
    var row = elem.parentNode.parentNode;
    var table = elem.parentNode.parentNode.parentNode;
   
    //this gives id of tr whose button was clicked
    var cells = row.getElementsByTagName("td");

    var symbol = cells[0].innerHTML;
    var holdings = cells[1].innerHTML;
    var address = cells[2].innerHTML;

    // remove address from tm
    var wallet = connection.getValidWallet();
    var tm = wallet.tm;
    tm.deleteMapEntry(address);

  //  alert("Symbol: " + symbol + "\nHoldings: " + holdings + "\nAddress: " + address);
    table.removeChild(row); // remove the row

  } catch (err) {
    alertLogErrorMessage(err);
  }
}

function deleteTableRows(tableId) {
  var table = document.getElementById(tableId);
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }
}

function hide_show_table(col_name, status) {
  // var status=document.getElementById(col_name).value;
  var all_col = document.getElementsByClassName(col_name);
  if (status == "hide") {
    for (var i = 0; i < all_col.length; i++) {
      all_col[i].style.display = "none";
    }
    // document.getElementById(col_name + "_head").style.display = "none";
    // document.getElementById(col_name).value = "show";
  } else {
    for (var i = 0; i < all_col.length; i++) {
      all_col[i].style.display = "table-cell";
    }
    // document.getElementById(col_name + "_head").style.display = "table-cell";
    // document.getElementById(col_name).value = "hide";
  }
}
