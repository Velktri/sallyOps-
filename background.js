function handleRemoved(tabID)
{
    browser.storage.local.get("SO_UI").then(res => {
        if (tabID === res.SO_UI)
        {
            browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
        }
    })
}

function handleMessages(request, sender, sendResponse)
{
    if (request.command === 'SO_reload_content')
    {
        browser.tabs.query({
            url: ["*://logistics.amazon.com/station/dashboard/stage",
                  "https://velktri.github.io/sallyOps-/testing/*"
            ]
        }).then(tabs => {
            tabs.forEach(tab => {
                browser.tabs.reload(tab.id)
            })
        })
    }

    if (request.command === 'SO_table_data')
    {
        storeCartData(request.data)
    }
}

function getTableData(tab)
{
    browser.tabs.sendMessage(tab.id, { command: "SO_getTableData" }).then(response => {
        storeCartData(response.data)
    })
}

function mergeCartData(newData)
{
    return browser.storage.local.get('carts').then(res => {
        let oldData = res.carts
        if (Object.keys(oldData).length === 0) { return Promise.resolve(newData) }
        if (Object.keys(newData).length === 0) { return Promise.resolve(oldData) }

        //console.log(newData)
        //console.log(oldData)
        //console.log('\n')
        let updatedData = {}
        Object.keys(newData).forEach(newWaveTime => {
            Object.keys(oldData).forEach(oldWaveTime => {
                if (newWaveTime === oldWaveTime)
                {
                    Object.keys(newData[newWaveTime]).forEach(newRoute => {
                        Object.keys(oldData[oldWaveTime]).forEach(oldRoute => {
                            if (newRoute === oldRoute)
                            {
                                newData[newWaveTime][newRoute].carts.forEach(newCart => {
                                    oldData[oldWaveTime][oldRoute].carts.forEach(oldCart => {
                                        if (newCart.cart === oldCart.cart)
                                        {
                                            newCart.isAudited = oldCart.isAudited
                                        }
                                    })
                                })

                                //console.log(updatedData[oldWaveTime])
                                //console.log(newData[newWaveTime][newRoute])


                                updatedData = { ...updatedData, ...{[newWaveTime]: newData[newWaveTime] }}

                                updatedData[newWaveTime][newRoute] = newData[newWaveTime][newRoute]

                                //console.log(updatedData)
                                //console.log('\n')
                            }
                            else
                            {

                                updatedData[newWaveTime] = { ...updatedData[newWaveTime], ...{ [newRoute]: newData[newWaveTime][newRoute] } }
                            }
                        })
                    })
                }
                else
                {
                    updatedData = { ...oldData, ...newData }
                }
            })
        })

        //console.log(updatedData)

        return Promise.resolve(updatedData)
    })
}

function storeCartData(cartData)
{
    mergeCartData(cartData).then(carts => {
        browser.storage.local.set({ carts })
        browser.storage.local.get('SO_UI').then((res) => {
            browser.tabs.sendMessage(res.SO_UI, { command: 'SO_carts_updated' })
        })
    })
}

function handleBrowserActionClick() {
    /* Create station command tab */
    browser.tabs.query({
        url: ["*://logistics.amazon.com/station/dashboard/stage",
              "https://velktri.github.io/sallyOps-/testing/*"
        ]
    }).then(tabs => {

        if (tabs.length === 0)
        {
            browser.tabs.create({ url: 'https://logistics.amazon.com/station/dashboard/stage' }) //https://velktri.github.io/sallyOps-/testing/new-routes.html' })
        }
        else
        {
            getTableData(tabs[0])
        }
    })

    /* Create sally dashboard tab */
    browser.storage.local.get('SO_UI').then(res => {
        if (res.SO_UI === undefined || res.SO_UI === browser.tabs.TAB_ID_NONE)
        {
            browser.tabs.create({ url: 'build/index.html' }).then((tab) => {
                browser.storage.local.set({ SO_UI: tab.id })
            })
        }
        else
        {
            browser.storage.local.get("SO_UI").then((res2) => {
                browser.tabs.update(res2.SO_UI, { active: true })
            })
        }
    })
}

browser.tabs.onRemoved.addListener(handleRemoved)
browser.runtime.onMessage.addListener(handleMessages)

browser.browserAction.onClicked.addListener(handleBrowserActionClick)

browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
browser.storage.local.set({ carts: {} })

