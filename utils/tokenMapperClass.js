class TokenMap {
  constructor() {
    this.tokenMapObjects = new Map([]);
  }

  get(_address) {
    var contract = this.tokenMapObjects.get(_address)
    return contract;
  }

  getTokenKeys() {
    var tokenKeys = [...this.tokenMapObjects.keys()];
    return tokenKeys;
  }

  getContractSet() {
    var tokenKeys = this.getTokenKeys();
    return new Set(tokenKeys);
  }

  setTokenProperty(address, propertyKey, propertyValue) {
    if (!isEmpty(address) && !isEmpty(propertyKey)) {
      var token = this.tokenMapObjects.get(address);
      if (token == null || token == undefined || token == "")
        token = this.addNewAddressMapObject(address);
      if (token instanceof Map) {
        token.set(propertyKey, propertyValue)
        return token;
      }
    }
    return null;
  }

  deleteMapEntry(_key) {
    this.tokenMapObjects.delete(_key);
  }

  addNewAddressMapObject(_address) {
    var objMap = new Map();
    objMap.set("address", _address)
    this.tokenMapObjects.set(_address, objMap);
    return objMap;
  }

  mapContractToWallet(contract) {
    var addressKey = contract.address;
    this.setTokenProperty(addressKey, "contract",    contract);
  }
  
  mapWalletObjectByAddressKey(walletObj) {
    var contract = walletObj.contract;
    var addressKey = walletObj.address;
    var name = walletObj.name;
    var symbol = walletObj.symbol;
    var totalSupply = walletObj.totalSupply;
    var decimals = walletObj.decimals;
    var tokenSupply = walletObj.tokenSupply;

    this.setTokenProperty(addressKey, "contract",    contract);
    this.setTokenProperty(addressKey, "name",        name);
    this.setTokenProperty(addressKey, "symbol",      symbol);
    this.setTokenProperty(addressKey, "totalSupply", totalSupply);
    this.setTokenProperty(addressKey, "decimals",    decimals);
    this.setTokenProperty(addressKey, "tokenSupply", tokenSupply);
    
    var contractMap = this.get(addressKey);
    return this.getTokenMapValues(addressKey);
  }

  getTokenProperty(address, propertyKey) {
    var propertyValue = null;
    var tokenMap = this.getTokenMapValues(address)
    if (tokenMap != null && !isEmpty(propertyKey)) {
      propertyValue = tokenMap.get(propertyKey);
    }
    return propertyValue;
  }
  
  getTokenMapValues(address) {
    var tokenMap;
    if (!isEmpty(address)) {
      tokenMap = this.tokenMapObjects.get(address);
    }
    return tokenMap;
  }

  toString() {
    let text = "";
    for (const entry of this.tokenMapObjects.entries()) {
        text += "Contract: " + entry[0] + ":\n";
        for (const val of entry[1].entries())
        text += "            " + val + ":\n";
      }
    return(text);
  }
}


