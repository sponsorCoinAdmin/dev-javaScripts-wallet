
let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer


// 1. Connect Metamask with Dapp
// Connect to eth wallet 0x4F75f07232a56c2b98FC9878F496bFc32e317Ace
async function connectMetamask() {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();

    console.log("Account address s:", await signer.getAddress());
}

// 2. Get balance
async function getBalance() {
    const balance = await signer.getBalance()
    const convertToEth = 1e18;
    console.log("account's balance in ether:", balance.toString() / convertToEth);
}

// 3. read data from the USDT contract on kovan 
//const usdtAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4";

const usdtAddress = "0x0Cd5Ec0a1A8633B3e74bea6A2E7bC31d2F4c65ED";

async function readDataFromSmartContract(addr) {
    let abi = getABIFromAddress(addr);
    const contract = new ethers.Contract(addr, abi, signer);
  
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply();
    const balanceOf = await contract.balanceOf(signer.getAddress());
  
    var contractData = `name = ${name}\n`;
    contractData += `symbol = ${symbol}\n`;
    contractData += `decimals = ${decimals}\n`;
    contractData += `totalSupply = ${totalSupply / 1e6}\n`;
    contractData += `balanceOf = ${balanceOf / 1e6}\n`;
  
    alert(contractData);
    console.log(contractData);
  }
  

// 4. Send Usdt to one account to another
async function sendUsdtToAccount() {
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    usdtContract.connect(signer).transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000")
}

function getABIFromAddress(addr) {
    switch (addr) {
      // ETH
      case "0x4f75f07232a56c2b98fc9878f496bfc32e317ace":
        return DEFAULT_ABI;
      // SPCOIN
      case "0xD5D2fd6c5E71618310baE2867513e3c9c90FD837":
        return SPCOIN_ABI;
      // LINK
      case "0x326C977E6efc84E512bB9C30f76E30c160eD06FB":
        return DEFAULT_ABI;
      // USDC
      case "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C":
        return DEFAULT_ABI;
      // UNI
      case "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984":
        return DEFAULT_ABI;
      // TEST
      case "0xC1a1c4568be43E43d3b7D98354Ec76F458075356":
        return DEFAULT_ABI;
      default:
        return DEFAULT_ABI;
    }
  }
