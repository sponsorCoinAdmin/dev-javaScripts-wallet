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

  setTokenProperty(_address, propertyKey, propertyValue) {
    if (!isEmpty(_address) && !isEmpty(propertyKey)) {
      var token = this.tokenMapObjects.get(_address);
      if (token == null || token == undefined || token == "")
        token = this.addNewAddressMapObject(_address);
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

  mapContractToWallet(_contract) {
    var addressKey = contract.address;
    this.setTokenProperty(addressKey, "contract", _contract);
  }

  getTokenProperty(_address, propertyKey) {
    var propertyValue = null;
    var tokenMap = this.getTokenMapValues(_address)
    if (tokenMap != null && !isEmpty(propertyKey)) {
      propertyValue = tokenMap.get(propertyKey);
    }
    return propertyValue;
  }
  
  getTokenMapValues(_address) {
    var tokenMap;
    if (!isEmpty(_address)) {
      tokenMap = this.tokenMapObjects.get(_address);
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


