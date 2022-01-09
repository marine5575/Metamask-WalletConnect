import React, { useState } from "react";
import { ethers } from 'ethers';

const WalletCard = () => {
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [userBalance, setUserBalance] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const connectWalletHandler = () => {
        const { ethereum } = window;

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
        const { ethereum } = window;

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

    if (window.ethereum) {
        connectWalletHandler();
    } else {
        window.addEventListener('ethereum#initialized', connectWalletHandler, {
            once: true,
        });
        
        // If the event is not dispatched by the end of the timeout,
        // the user probably doesn't have MetaMask installed.
        setTimeout(connectWalletHandler, 3000); // 3 seconds
    }

    window.ethereum.on('accountsChanged', accountChangeHandler);
    window.ethereum.on('chainChanged', chainChangedHandler);

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