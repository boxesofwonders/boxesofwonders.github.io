const btnConnect = document.getElementById('connect-button')
const lAccount = document.getElementById('account')
const lBalance = document.getElementById('balance')

const isMetaMaskInstalled = () => {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
}

const setLabels = async (sAccount, sBalance) => {
    lAccount.textContent = sAccount
    lBalance.textContent = sBalance
}

const isPolygonNetwork = async () => {
     
    const chainId = await ethereum.request({
        method: 'eth_chainId',
    })
    console.error(chainId)
    const testChain = chainId == 'https://polygon-rpc.com'

    const networkId = await ethereum.request({
        method: 'net_version',
    })
    console.error(networkId)
    const testNetwork = networkId == 137

    return testChain && testNetwork
}

const onClickConnect = async () => {
    try {
        if(isPolygonNetwork()){
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })
            const account = accounts[0];

            ethereum.request({method: 'eth_getBalance', params:[account, 'latest']}).then(result => {
                const balance = parseInt(result,16) / (10**18);
                lBalance.textContent = balance + ' MATIC';
            });
        } else {
            setLabels('Switch to Polygon network', '')
        }
    } catch (error) {
        setLabels('Connection error', '')
    }
}
  
const initialize = async () => {
    if(!isMetaMaskInstalled()){
        setLabels('Metamask extension not installed', '')
        btnConnect.onclick = null
    } else {
        setLabels('', '')
        btnConnect.onclick = onClickConnect
    }
}

window.addEventListener('DOMContentLoaded', initialize)