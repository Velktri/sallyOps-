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
        browser.tabs.sendMessage(tab.id, { command: "SO_getTableData" }).then(response => {
            storeCartData(response.data)
        }).catch(onError)
    })
}





// Button Behavior
document.getElementById("getTableButton").onclick = () => {
    browser.tabs.query({
        url: ["*://logistics.amazon.com/station/dashboard/stage",
              "https://velktri.github.io/sallyOps-/testing/*"
        ]
    }).then(getTableData).catch(onError)
}

document.getElementById("print").onclick = () => {
    browser.storage.local.get('carts').then((response) => {
        if (response.carts != undefined)
        {
            console.log(response.carts)
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

/* Creates the command tab and updates the tab id in storage */
document.getElementById("cartUI").onclick = () => {
    browser.storage.local.get('SO_UI').then(res => {
        if (res.SO_UI === undefined || res.SO_UI === browser.tabs.TAB_ID_NONE)
        {
            browser.tabs.create({ url: "SO_command.html" }).then((tab) => {
                browser.storage.local.set({ SO_UI: tab.id })
            })
        }
        else
        {
            console.log('hello')
            browser.storage.local.get("SO_UI").then((res) => {
                console.log(res.SO_UI)
                browser.tabs.update(res.SO_UI, { active: true })
            })
        }
    })
}