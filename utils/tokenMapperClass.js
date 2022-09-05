class TokenMap {
  constructor() {
    this.addrMapObjs = new Map([]);
  }

  get(_address) {
    var contract = this.addrMapObjs.get(_address)
    return contract;
  }

  getTokenKeys() {
    var tokenKeys = [...this.addrMapObjs.keys()];
    return tokenKeys;
  }

  setTokenProperty(address, propertyKey, propertyValue) {
    if (!isEmpty(address) && !isEmpty(propertyKey)) {
      var token = this.addrMapObjs.get(address);
      if (token == null || token == undefined || token == "")
        token = this.addNewAddressMapObject(address);
      if (token instanceof Map) {
        token.set(propertyKey, propertyValue)
        return token;
      }
    }
    return null;
  }

  addNewAddressMapObject(_address) {
    var objMap = new Map();
    objMap.set("address", _address)
    this.addrMapObjs.set(_address, objMap);
    return objMap;
  }

  mapWalletObjectByAddressKey(walletObj) {
    var addressKey = walletObj.address;
    var name = walletObj.name;
    var symbol = walletObj.symbol;
    var totalSupply = walletObj.totalSupply;
    var decimals = walletObj.decimals;
    var tokenSupply = walletObj.tokenSupply;

    this.setTokenProperty(addressKey, "contract",    walletObj);
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
      tokenMap = this.addrMapObjs.get(address);
    }
    return tokenMap;
  }
}
