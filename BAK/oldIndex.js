let provider = new ethers.providers.Web3Provider(window.ethereum)
let signer
const usdtAddress = "0x13512979ADE267AB5100878E2e0f485B568328a4";
const spCoinAddress = '0x9BAD613F5DBFd749E7a952Fb4F524cBb03c9F1EA';

// 1. Connect Metamask with Dapp
async function connectMetamask() {
    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    address = await signer.getAddress();
    document.getElementById('connectText').value = address;
    console.log("Account address s:", address);
}

// 2. Get balance
async function getWalletEthBalance() {
    const balance = await signer.getBalance()
    const convertToEth = 1e18;
    const ethbalance = balance.toString() / convertToEth;
    document.getElementById('balanceText').value = ethbalance;
    console.log("account's balance in ether:", balance.toString() / convertToEth);
}

// 3. read data from the USDT contract on kovan 
const usdtAbi = [
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint amount)"
];

const spCoinAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accountKeys",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accountKey",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accountKey",
				"type": "address"
			}
		],
		"name": "getAccount",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "balance",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "sponsor",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "agent",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "sponsoredTime",
						"type": "uint256"
					}
				],
				"internalType": "struct SPC_Token.account",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accountKey",
				"type": "address"
			}
		],
		"name": "getIndexOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_accountKey",
				"type": "address"
			}
		],
		"name": "isInserted",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

/*[
    // Some details about the token
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address) view returns (uint)",
    "function totalSupply() view returns (uint256)",
    "function transfer(address to, uint amount)",
    "function isInserted(address _accountKey) returns (bool)"
];
*/

async function readDataFromSpCoinContract() {
    mainContainer = document.getElementById("spCoinData");
    const spCoinContract = new ethers.Contract(spCoinAddress, spCoinAbi, provider.getSigner());
    const spCoinName = await spCoinContract.name()
    const spCoinSymbol = await spCoinContract.symbol()
 //   const spCoinDecimals = await spCoinContract.decimals()
    const spCoinTotalSupply = await spCoinContract.totalSupply()
    const spcCoinBalance = await spCoinContract.balanceOf("0x4F75f07232a56c2b98FC9878F496bFc32e317Ace")
    //   const spcCoinisInserted = await spCoinContract.isInserted("0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9");
 
    mainContainer.innerHTML = "";
    appendDivData(mainContainer, "spCoinName", spCoinName);   
    appendDivData(mainContainer, "spCoinSymbol", spCoinSymbol);
 // appendDivData(mainContainer, spCoinDecimals, "spCoinDecimals");
    appendDivData(mainContainer, "spCoinTotalSupply", spCoinTotalSupply);
    appendDivData(mainContainer, "spcCoinBalance", spcCoinBalance);
    appendDivData(mainContainer, "spCoinContract", objToString(spCoinContract));
}

async function balanceOf() {
    balanceOfContainer = document.getElementById("balanceOfData");
    addressText = document.getElementById("addressText");
    balanceAddress = addressText.value;
    const spCoinContract = new ethers.Contract(spCoinAddress, spCoinAbi, provider.getSigner());
    const balance = await spCoinContract.balanceOf(balanceAddress);
//    const spcCoinBalance = await spCoinContract.balanceOf("0x4F75f07232a56c2b98FC9878F496bFc32e317Ace");
    balanceOfContainer.innerHTML = "";
    appendDivData(balanceOfContainer, "Balance", balance);
}

async function readDataFromUSDTContract() {
    mainContainer = document.getElementById("usdtData");
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    
    const usdtName = await usdtContract.name()
    const usdtSymbol = await usdtContract.symbol()
    const usdtDecimals = await usdtContract.decimals()
    const usdtTotalSupply = await usdtContract.totalSupply()
    const usdtBalance = await usdtContract.balanceOf("0x06214f2E1e1896739D92F3526Bd496DC028Bd7F9")

    mainContainer.innerHTML = "";
    appendDivData(mainContainer, "name", usdtName);
    appendDivData(mainContainer, "usdtSymbol", usdtSymbol);
    appendDivData(mainContainer, "usdtDecimals", usdtDecimals);
    appendDivData(mainContainer, "usdtTotalSupply", usdtTotalSupply);
    appendDivData(mainContainer, "usdtBalance", usdtBalance);
//    appendDivData(mainContainer, "usdtContract", objToString(usdtContract));
}

function objToString(object) {
    var str = '';
    for (var k in object) {
      if (object.hasOwnProperty(k)) {
        str += k + '::' + object[k] + '\n';
      }
    }
//  console.log(str);
    return str;
  }
  
  function appendDivData(mainContainer, name, val) {
    var div = document.createElement("DIV");
    str = name + " = " + val;
    div.innerHTML = str;
    mainContainer.appendChild(div);
    console.log(str);
}

// 4. Send Usdt to one account to another
async function sendUsdtToAccount() {
    const usdtContract = new ethers.Contract(usdtAddress, usdtAbi, provider);
    usdtContract.connect(signer).transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000")
}

async function sendSPCoinToAccount() {
    const usdtContract = new ethers.Contract(spCoinAddress, usdtAbi, provider);
    usdtContract.connect(signer).transfer("0x6CC3dFBec068b7fccfE06d4CD729888997BdA6eb", "500000000")
}

// 5. deploy contract which you created in remix
async function deployContract() {

    const abi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "MyEvent",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "emitAnEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "incrementNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const numberContractByteCode = "6080604052600160005534801561001557600080fd5b5061023e806100256000396000f3fe60806040526004361061004a5760003560e01c806312065fe01461004f578063273ea3e31461007a5780638381f58a14610091578063910220cf146100bc578063d0e30db0146100d3575b600080fd5b34801561005b57600080fd5b506100646100dd565b604051610071919061015e565b60405180910390f35b34801561008657600080fd5b5061008f6100e5565b005b34801561009d57600080fd5b506100a6610100565b6040516100b3919061015e565b60405180910390f35b3480156100c857600080fd5b506100d1610106565b005b6100db61014d565b005b600047905090565b60016000808282546100f79190610179565b92505081905550565b60005481565b60633373ffffffffffffffffffffffffffffffffffffffff167fdf50c7bb3b25f812aedef81bc334454040e7b27e27de95a79451d663013b7e1760405160405180910390a3565b565b610158816101cf565b82525050565b6000602082019050610173600083018461014f565b92915050565b6000610184826101cf565b915061018f836101cf565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156101c4576101c36101d9565b5b828201905092915050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea2646970667358221220c7ea64001588915ed03183343a38064bf99dd1c9e22cb6e3c634f4bd152aa8ba64736f6c63430008070033"

    const factory = new ethers.ContractFactory(abi, numberContractByteCode, signer)

    const numberContract = await factory.deploy();

    const transactionReceipt = await numberContract.deployTransaction.wait();

    console.log(transactionReceipt)    
}

// 6. Call function on smart contract and wait for it to finish (to be mined)
async function incrementNumberOnSmartContract() {
    const numberContractAddress = "0xf1f3298bc741a5801ac08f2be84f822de2312c97";

    const numberContractAbi = [
        "function number() view returns (uint)",
        "function incrementNumber() external"
    ];

    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    var number = await numberContract.number()
    console.log("initial number ", number.toString())

    const txResponse = await numberContract.connect(signer).incrementNumber()
    await txResponse.wait()
    number = await numberContract.number()
    console.log("updated number = ", number.toString())

}

// 7. Emit event and Print out the event immediately after being emmited
async function emitAnEvent() {
    const numberContractAddress = "0xf1f3298bc741a5801ac08f2be84f822de2312c97";

    const numberContractAbi = [
        "function emitAnEvent() external",
    ];

    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    const tx = await numberContract.connect(signer).emitAnEvent()
    const txReceipt = await tx.wait()

    console.log("event was emmited")

    console.log(txReceipt.events[0])
}

// 8. Listen for events being emmited in the background
// listening for an event to be emitted, and to do a task based on that.

async function listenToEvents() {
    // Subscribe to event calling listener when the event occurs.
    const numberContractAddress = "0xb2f3ebf53ad585ccaefeb4960ff54329ebf2007a";
    const numberContractAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "MyEvent",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "emitAnEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "incrementNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // The Contract object
    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    numberContract.on("MyEvent", (from, number) => {
        console.log(`address emiting the event = ${from}`)
        console.log(`number from event = ${number}`)
    })
}

async function sendEtherWhenCallingFunction() {
    const numberContractAddress = "0xb2f3ebf53ad585ccaefeb4960ff54329ebf2007a";
    const numberContractAbi = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "randomNumber",
                    "type": "uint256"
                }
            ],
            "name": "MyEvent",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "deposit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "emitAnEvent",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getBalance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "incrementNumber",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "number",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    // The Contract object
    const numberContract = new ethers.Contract(numberContractAddress, numberContractAbi, provider);

    const options = {value: ethers.utils.parseEther("0.005")}

    const txResponse = await numberContract.connect(signer).deposit(options)

    await txResponse.wait()

    const balance = await numberContract.getBalance()
    console.log(`balance = ${balance.toString()}`)
}


async function readFromSCOnctractStorage() {
    const storageSlot = 0 // 1 means 2 storage slot because we are starting from 0
    const contractAddress = "0x9d6F5181065e3beD0e29de393165b43B7fF9E33B"
    const data = await provider.getStorageAt(contractAddress, storageSlot);
    console.log(data)
}
