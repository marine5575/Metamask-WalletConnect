import React, { useState } from "react";
import { ethers } from 'ethers';

const WalletCard = () => {
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const { ethereum } = window;

    const connectWalletHandler = () => {
        if(ethereum && ethereum.isMetaMask) {
            // metamask가 있음
            ethereum.request({method: 'eth_requestAccounts'})
            .then((result) => {
                accountChangeHandler(result[0]);

                setConnButtonText('Wallet Connected');
                getUserBalance(result[0]);
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
        } else {
            setErrorMessage('Install MetaMask');
        }
    };

    const accountChangeHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        getUserBalance(newAccount.toString());
    };

    const getUserBalance = (address) => {
        ethereum.request({method: 'eth_getBalance', params: [address, 'latest']})
        .then(balance => {
            setUserBalance(ethers.utils.formatEther(balance));
        })
        .catch(error => {
            setErrorMessage(error.message);
        });
    };

    const chainChangedHandler = () => {
        window.location.reload();
    };

    ethereum.on('accountsChanged', accountChangeHandler);
    ethereum.on('chainChanged', chainChangedHandler);

    return (
        <>
        <div className="walletCard">
            <h4>{"Connection to MetaMask using window.ethereum methods"}</h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div className="accountDisplay">
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div className="balanceDisplay">
                <h3>Balance: {userBalance}</h3>
            </div>
            {errorMessage}
        </div>
        </>
    );
}

export default WalletCard;