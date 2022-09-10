var addressMap = new Map([]);

function mapWalletToTable(wallet) {
  mapTokensToTable(wallet.tm, "assetsTable");
}

function mapTokensToTable(tm, tableId) {
  for (let [addrKey] of tm.addrMapObjs) {
    addTableRow(tableId, addrKey);
  }
}

function addressFound(addr) {
  return addressMap.get(addr) == undefined ? false : true;
}

function addTableRow(tableId, addrKey) {
  if (!addressFound(addrKey)) {
    var contract = tm.getTokenProperty(addrKey, "contract");
    addressMap.set(addrKey, contract);
    var table = document.getElementById(tableId);
    var tokenSymbol = tm.getTokenProperty(addrKey, "symbol");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = tokenSymbol;
    cell2.innerHTML = addrKey;
    return true;
  }
  return false;
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
    for (i = 1; i < rows.length - 1; i++) {
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
