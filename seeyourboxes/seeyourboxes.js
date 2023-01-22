import boxesofwonders_tokenABI from "./boxesofwonders_token.js"

const btnConnect = document.getElementById('connect-button')
const lMessage = document.getElementById('message')

const POLYGON_MAINNET = '0x89' //137
const BOXES_OF_WONDERS_CONTRACT = '0x2953399124F0cBB46d2CbACD8A89cF0599974963'

const isMetaMaskInstalled = () => {
    const Web3 = require('web3')
    const web3 = new Web3(window.ethereum)
    return Boolean(typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask === true)
}

const isPolygonNetwork = async () => {
    return Boolean(web3.eth.getChainId() === POLYGON_MAINNET)
}

const onClickConnect = async () => {
    try {
        if(await isPolygonNetwork()){
            const contract = new web3.eth.Contract(boxesofwonders_tokenABI, BOXES_OF_WONDERS_CONTRACT)
            const account = web3.eth.accounts[0]
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
    if(!isMetaMaskInstalled()){
        lMessage.textContent = 'Metamask extension not installed'
        btnConnect.onclick = null
    } else {
        lMessage.textContent = ''
        btnConnect.onclick = onClickConnect
    }
}

window.addEventListener('DOMContentLoaded', initialize)