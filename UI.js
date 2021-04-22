function onError(error)
{
    console.error(`Error: ${error}`)
}

function storeCartData(cartData)
{
    browser.storage.local.set({ carts: cartData })
}

function getTableData(tabs)
{
    tabs.forEach(tab => {
        console.log(tab)
        browser.tabs.sendMessage(tab.id, { command: "SO_getTableData" }).then(response => {
            if (response.data.length > 0)
            {
                storeCartData(response.data)
            }
        }).catch(onError)
    })
}





// Button Behavior
document.getElementById("getTableButton").onclick = () => {
    let queries = browser.tabs.query({
        url: ["*://logistics.amazon.com/station/dashboard/stage",
              "https://velktri.github.io/sallyOps-/testing/*"
        ]
    })
    queries.then(getTableData).catch(onError)
}

document.getElementById("print").onclick = () => {
    let carts = browser.storage.local.get('carts')
    carts.then((response) => {
        if (response.carts != undefined && response.carts.length > 0)
        {
            console.log(response.carts[0])
        }
        else
        {
            console.log('No Carts')
        }
    })
}

document.getElementById("clear").onclick = () => {
    browser.storage.local.clear()
}

document.getElementById("cartUI").onclick = () => {
    
}