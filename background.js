function handleRemoved(tabID, info)
{
    browser.storage.local.get("SO_UI").then(res => {
        if (tabID === res.SO_UI)
        {
            browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
        }
    })
}

function handleCartUpdate(request, sender, sendResponse)
{
    if (request.command === 'SO_update_carts')
    {
        browser.tabs.query({
            url: ["*://logistics.amazon.com/station/dashboard/stage",
                  "https://velktri.github.io/sallyOps-/testing/*"
            ]
        })
        // then() reloadtab (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/reload)
        // then() wait for table to load
        .then(getTableData)
        .then((res) => {
            console.log(res)
            sendResponse({ response: res })
        })
    }
}

function getTableData(tabs)
{
    /* Fix problem where promise dont exist after foreach loop ends */
    tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, { command: "SO_getTableData" }).then(response => {
            console.log('hi from getTableData')
            return storeCartData(response.data)
        })
    })
}

function storeCartData(cartData)
{
    browser.storage.local.set({ carts: cartData })
    console.log('hi from storecartdata')
    return Promise.resolve(cartData)
}

browser.storage.local.set({ SO_audits: {} })

browser.tabs.onRemoved.addListener(handleRemoved)
browser.runtime.onMessage.addListener(handleCartUpdate)

