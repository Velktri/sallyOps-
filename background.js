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
    /* User clicked the Update button */
    if (request.command === 'SO_reload_content')
    {
        LoadContentWindow()
    }

    /* Table data returning from the execute script */
    if (request.command === 'SO_stage_data')
    {
        storeCartData(request.data)
    }

    if (request.command === 'SO_pick_data')
    {
        console.log(request.data)
        //storeCartData(request.data)
    }

    /* Greeting returning from content script */
    if (request.command === 'SO_window_message')
    {
        /* Send Execute script to tab */
        browser.storage.local.get("SO_Content_Tabs").then((result) => {
            let contentFiles = ["/content-stage.js", "/content-pick.js"]
            let contentTabs = result.SO_Content_Tabs

            for (let i = 0; i < contentTabs.length; i++)
            {
                if (sender.tab.id === contentTabs[i].id)
                {
                    browser.tabs.executeScript(
                        sender.tab.id,
                        {
                            file: contentFiles[i],
                            allFrames: true
                        }
                    )
                }
            }
        })
    }
}

function mergeCartData(newData)
{
    return browser.storage.local.get('carts').then(res => {
        let oldData = res.carts
        if (Object.keys(oldData).length === 0) { return Promise.resolve(newData) }
        if (Object.keys(newData).length === 0) { return Promise.resolve(oldData) }

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
                                updatedData = { ...updatedData, ...{[newWaveTime]: newData[newWaveTime] }}
                                updatedData[newWaveTime][newRoute] = newData[newWaveTime][newRoute]
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

    /* Close stage tab */
    browser.storage.local.get("SO_Content_Tabs").then((result) => {
        if (result.SO_Content_Tabs[0].id !== browser.tabs.TAB_ID_NONE)
        {
            browser.tabs.remove(result.SO_Content_Tabs[0].id)
            browser.storage.local.set({ SO_Content_Tabs: [browser.tabs.TAB_ID_NONE, result.SO_Content_Tabs[1]] })
        }
    })
}

function LoadContentWindow()
{
    browser.windows.create({
        url: ['https://logistics.amazon.com/station/dashboard/stage',
              'https://logistics.amazon.com/station/dashboard/pick'
            ],
    }).then(windowInfo => {
        browser.windows.update(
            windowInfo.id,
            {
                state: "minimized"
            }
        )
        
        browser.storage.local.set({ SO_Content_Tabs: windowInfo.tabs })
    })
}

function handleBrowserActionClick() {
    LoadContentWindow()

    /* Create or focus sally dashboard tab */
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
browser.storage.local.set({ SO_Content_Tabs: [] })
browser.storage.local.set({ carts: {} })