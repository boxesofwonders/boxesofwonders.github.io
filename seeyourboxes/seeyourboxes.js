import boxesofwonders_tokenABI from "./boxesofwonders_token.js"

const btnConnect = document.getElementById('connect-button')
const lMessage = document.getElementById('message')

const POLYGON_MAINNET = 137 //'0x89'
const BOXES_OF_WONDERS_CONTRACT = '0x2953399124F0cBB46d2CbACD8A89cF0599974963'

const isMetaMaskInstalled = async () => {
    const provider = await detectEthereumProvider()
    return Boolean(provider)
}

const isPolygonNetwork = async () => {
    const chainId = await web3.eth.getChainId()
    return Boolean(chainId && chainId === POLYGON_MAINNET)
}

const onClickConnect = async () => {
    try {
        if(await isPolygonNetwork()){
            const accounts = await web3.eth.getAccounts()
            const account = accounts[0]

            const contract = new web3.eth.Contract(boxesofwonders_tokenABI, BOXES_OF_WONDERS_CONTRACT)
            contract.defaultAccount = account
            const numberOfBoxes = await contract.methods.balanceOf(account).call()

            for(let i = 0; i < numberOfBoxes; i++){
                const boxId = await contract.methods.tockenOfOwnerByIndex(account, i).call()
                let boxMetadataURI = await contract.methods.tokenURI(boxId).call()

                if(boxMetadataURI.startsWith("ipfs://")){
                    boxMetadataURI = `https://ipfs.io/ipfs/${boxMetadataURI.split("ipfs://")[1]}`
                }

                const boxMetadata = await fetch(boxMetadataURI).then((response) => response.json())
                
                const boxElement = document.getElementById("nft_template").content.cloneNode(true)
                boxElement.querySelector("h1").innerText = boxMetadata['name']
                boxElement.querySelector("a").href = `https://opensea.io/assets/matic/${BOXES_OF_WONDERS_CONTRACT}/${boxId}`
                boxElement.querySelector("img").src = boxMetadata['image']
                boxElement.querySelector("img").alt = boxMetadata['description']
            }
        } else {
            lMessage.textContent = 'Switch to Polygon network'
        }
    } catch (error) {
        lMessage.textContent = 'Connection error'
    }
}
  
const initialize = async () => {
    if(await isMetaMaskInstalled()){
        const web3 = new Web3(provider)
        lMessage.textContent = ''
        btnConnect.onclick = onClickConnect
    } else {
        lMessage.textContent = 'Metamask extension not installed'
        btnConnect.onclick = null
    }
}

window.addEventListener('DOMContentLoaded', initialize)