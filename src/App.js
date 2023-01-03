import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { ethers } from "ethers";
import Web3 from "web3"; // eslint-disable-line import/no-unresolved
import { useAlert } from 'react-alert'

function App() {
  const [balance, setBalance] = useState(0);
  const [vaultAddress, setVaultAddress] = useState("");
  const [depositValue,setDepositValue] = useState("");

  const contractAbi = JSON.parse('[{"inputs":[],"name":"createVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_USDC","type":"address"},{"internalType":"address","name":"_feeRecipient","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"usdcAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userContracts","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]'); 
  const vaultABI = JSON.parse('[{"inputs":[{"internalType":"address","name":"_USDC","type":"address"},{"internalType":"address","name":"_feeRecipient","type":"address"},{"internalType":"uint256","name":"_fee","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"USDC","outputs":[{"internalType":"contractIERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"adminWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"fee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeRecipient","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]');
  const erc20ABI = JSON.parse('[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}]');
  const factoryAddress = "0xc07601f4ef103bed0cb9A763f43CE2927aaD4E9f";
  const erc20Addr = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

  const detectCurrentProvider = async () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      alert(
        'Non-Ethereum  onConnectbrowser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };
  
  const handleInputChange = async (event) => {
    const inputValue = event.target.value;
    console.log("depositValue:", inputValue);
    setDepositValue(inputValue);
  }

  const connectToMetaMask = async () => {
    try {

      const currentProvider = await detectCurrentProvider();
      if (currentProvider) {

        if (currentProvider !== window.ethereum) {
          alert(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }

        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        // saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
        await checkVault(account, web3);

      }


    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.',err 
      );
    }
  };

  const checkVault = async (signer, web3) => {
    try {
     
        const factoryContract = new web3.eth.Contract(
          contractAbi, // Replace with the contract ABI
          factoryAddress, // Replace with the contract address
        );

        // Call the "createVault" function of the contract
        const tx = factoryContract.methods.userContracts(signer).call().then((contractAddr) => {
        console.log("userContracts:", contractAddr)
        if (contractAddr != '0x0000000000000000000000000000000000000000') {
          setVaultAddress(contractAddr);

          // // Create a new instance of the vault contract
          const erc20Contract = new web3.eth.Contract(
            erc20ABI,
            erc20Addr
          );

          // Call the "deposit" function of the contract, passing in an amount to deposit
          // Call the "createVault" function of the contract
          const tx = erc20Contract.methods.balanceOf(contractAddr).call().then((response) => {

            setBalance(response);
          });
        } else {
          alert(
            'You donot have Vault Yet!'
          );
        }
       });
    } catch(err) {
      console.log("error:", err);
    }
    
  }
  // const connectToMetaMask = async () => {
  //   try {
  //     await connect(Web3);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // Connect to MetaMask and get the current user's account
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const account = await signer.getAddress();
  //   console.log(account);
  // };

  const createVault = async () => {
    // Create a new vault contract instance
    const currentProvider = await detectCurrentProvider();

    const web3 = new Web3(currentProvider);
    const userAccount = await web3.eth.getAccounts();
    const account = userAccount[0];

    // // Ensure that the user is connected to MetaMask and has a vault
    if (!account) {
      alert("Please connect to MetaMask first");
      return;
    }

    // // Create a new instance of the vault contract
    const vaultContract = new web3.eth.Contract(
      contractAbi,
      factoryAddress
    );

    // // Call the "deposit" function of the contract, passing in an amount to deposit
    // Call the "createVault" function of the contract
    const tx = vaultContract.methods.createVault().send({from: account}).then((response) => {
      console.log("response:", response);

    });

    // // Update the state with the new vault address
    // setVaultAddress(newVaultAddress);
  };


  const approve = async () => {
    const currentProvider = await detectCurrentProvider();

    const web3 = new Web3(currentProvider);
    const userAccount = await web3.eth.getAccounts();
    const account = userAccount[0];

    // // Ensure that the user is connected to MetaMask and has a vault
    if (!account || !vaultAddress) {
      alert("Please connect to MetaMask and create a vault first");
      return;
    }

    // // Create a new instance of the vault contract
    const erc20Contract = new web3.eth.Contract(
      erc20ABI,
      erc20Addr
    );

    // Call the "deposit" function of the contract, passing in an amount to deposit
    // Call the "createVault" function of the contract
    const tx = erc20Contract.methods.approve(vaultAddress, "1000000000000000000000000").send({from: account}).then((response) => {
      console.log("response:", response);
    });

    // // Wait for the transaction to be mined
    // await tx.wait();

    // // Update the balance by calling the "balanceOf" function of the contract
    // const updatedBalance = await vaultContract.balanceOf(account);
    // setBalance(updatedBalance);
  };

  const deposit = async () => {

    const currentProvider = await detectCurrentProvider();

    const web3 = new Web3(currentProvider);
    const userAccount = await web3.eth.getAccounts();
    const account = userAccount[0];

    // // Ensure that the user is connected to MetaMask and has a vault
    if (!account || !vaultAddress) {
      alert("Please connect to MetaMask and create a vault first");
      return;
    }

    // // Create a new instance of the vault contract
    const vaultContract = new web3.eth.Contract(
      vaultABI,
      vaultAddress
    );

    // // Call the "deposit" function of the contract, passing in an amount to deposit
    // Call the "createVault" function of the contract
    const tx = vaultContract.methods.deposit(depositValue).send({from: account}).then((response) => {
      console.log("response:", response);
    });

  };

  const withdraw = async () => {
    const currentProvider = await detectCurrentProvider();

    const web3 = new Web3(currentProvider);
    const userAccount = await web3.eth.getAccounts();
    const account = userAccount[0];

    // // Ensure that the user is connected to MetaMask and has a vault
    if (!account || !vaultAddress) {
      alert("Please connect to MetaMask and create a vault first");
      return;
    }

    // // Create a new instance of the vault contract
    const vaultContract = new web3.eth.Contract(
      vaultABI,
      vaultAddress
    );

    // // Call the "deposit" function of the contract, passing in an amount to deposit
    // Call the "createVault" function of the contract
    const tx = vaultContract.methods.withdraw(balance).send({from: account}).then((response) => {
      console.log("response:", response);
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ethereum Vault</h1>
        <p>
          Connect to MetaMask to create and manage your Ethereum vault.
        </p>
        <button onClick={connectToMetaMask}>Connect to MetaMask</button>
        {vaultAddress ? (
          <>
            <p>Your vault address: {vaultAddress}</p>
            <p>Your balance: {balance} ETH</p>
            <button onClick={approve}>Approve</button>
            <label>
            <p class="big-input"> Set Deposit Value:
              <input type="text"  class="big-input"  value={depositValue} onChange={handleInputChange} />
              <button onClick={deposit}>Deposit</button>
            </p>
            </label>            
            <button onClick={withdraw}>Withdraw</button>
          </>
        ) : (
          <button onClick={createVault}>Create Vault</button>
        )}
      </header>
    </div>
  );

// return (
//     <div>
//       <button onClick={connectToMetaMask}>Connect to MetaMask</button>
//       { (
//         <>
//           <button onClick={createVault}>Create Vault</button>
//           <button onClick={deposit}>Deposit</button>
//           <button onClick={withdraw}>Withdraw</button>
//           <div>Balance: {balance}</div>
//         </>
//       )}
//     </div>
//   );
}

export default App;
