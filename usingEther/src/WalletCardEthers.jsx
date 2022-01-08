import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletCardEthers = () => {
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [defaultAccount, setDefaultAccount] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [provider, setProvider] = useState(null);

    const connectWalletHandler = () => {
        if(window.ethereum && defaultAccount === '') {
            setProvider(new ethers.providers.Web3Provider(window.ethereum));

            window.ethereum.request({ method: 'eth_requestAccounts' }).then(result => {
                setConnButtonText('Wallet Connected');
                setDefaultAccount(result[0]);

                console.log(result);
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
        } else if(!window.ethereum) {
            console.log('Need to install MetaMask');

            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    };

    useEffect(() => {
        if(defaultAccount) {
            provider.getBalance(defaultAccount)
                    .then(balanceResult => {
                        setUserBalance(ethers.utils.formatEther(balanceResult));
                    });
        }
    }, [defaultAccount]);

    return (
        <>
        <div className='walletCard'>
            <h4>Connection to MetaMask using ethers.js</h4>
            <button onClick={connectWalletHandler}>{connButtonText}</button>
            <div className='accountDisplay'>
                <h3>Address: {defaultAccount}</h3>
            </div>
            <div className='balanceDisplay'>
                <h3>Balance: {userBalance}</h3>
            </div>
            {errorMessage}
        </div>
        </>
    );
};

export default WalletCardEthers;