const defaultContractAddress = '0x9BAD613F5DBFd749E7a952Fb4F524cBb03c9F1EA';
var provider;
var signer;
var contractAddress = defaultContractAddress;
var accountAddress;
var contract;
var accountList;


// 1. Connect Metamask with Dapp
async function connectMetaMaskWallet() {
	try {
		// MetaMask requires requesting permission to connect users accounts
		provider = new ethers.providers.Web3Provider(window.ethereum)
		accountList = await provider.send("eth_requestAccounts", []);
		signer = await provider.getSigner();
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}

// 2. Connect Metamask Account
async function connectMetaMaskAccount() {
	try {
		// MetaMask requires requesting permission to connect users accounts
		accountAddress = await signer.getAddress();
		document.getElementById('connMetaMaskAccount_TB').value = accountAddress;
		console.log("Account address s:", accountAddress);
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}

// 3. Get Ethereum balance
async function getWalletEthBalance() {
	try {
		const balance = await signer.getBalance()
		const convertToEth = 1e18;
		const ethbalance = balance.toString() / convertToEth;
		document.getElementById('balanceText').value = ethbalance;
		console.log("account's balance in ether:", balance.toString() / convertToEth);
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}

// 4. Connect contract
async function connectContract() {
	try {
		alert("Executing connectContract " + contractAddress);
		contractContainer = document.getElementById("contractData");
		contractText = document.getElementById("contractText");
		contractAddress = contractText.value;
		contract = new ethers.Contract(contractAddress, spCoinABI, signer);
	}
	catch(err) {
		contractConnectError = "Cannot Connect to Address" + contractAddress + "\n" + err.message;
		console.log(contractConnectError);
		alert(contractConnectError);
	}
}

// 5. Read contract data from the contract on the connected account
async function readContractData() {
	try {
		alert("Contract = " + contract);
//################
        contractContainer = document.getElementById("contractData");
		contractText = document.getElementById("contractText");
		contractAddress = contractText.value;
		contract = new ethers.Contract(contractAddress, spCoinABI, signer);
//################
		alert("Contract = " + contract);
		mainContainer = document.getElementById("spCoinData");
		spCoinName = await contract.name()
		spCoinSymbol = await contract.symbol()
	//  spCoinDecimals = await contract.decimals()
		spCoinTotalSupply = await contract.totalSupply()

		mainContainer.innerHTML = "";
		appendDivData(mainContainer, "spCoinName", spCoinName);   
		appendDivData(mainContainer, "spCoinSymbol", spCoinSymbol);
	// appendDivData(mainContainer, spCoinDecimals, "spCoinDecimals");
		appendDivData(mainContainer, "spCoinTotalSupply", spCoinTotalSupply);
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}

async function balanceOf() {
	try {
		balance = await contract.balanceOf(accountAddress);
		balanceOfContainer.innerHTML = "";
		appendDivData(balanceOfContainer, "Balance", balance);
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}
  
function appendDivData(mainContainer, name, val) {
	try {
		var div = document.createElement("DIV");
		str = name + " = " + val;
		div.innerHTML = str;
		mainContainer.appendChild(div);
		console.log(str);
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}

async function sendSPCoinToAccount() {
	try {
		const spCoinContract = new ethers.Contract(contractAddress, spCoinABI, provider);
    	spCoinContract.connect(signer).transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000")
	}
	catch(err) {
		console.log(err.message);
		alert(err.message);
	}
}
