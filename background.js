function handleRemoved(tabID)
{
    browser.storage.local.get("SO_UI").then(res => {
        if (tabID === res.SO_UI)
        {
            browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
        }
    })

    browser.storage.local.get("SO_Content_Tabs").then(res => {
        res.SO_Content_Tabs.forEach((tab, i) => {
            if (tabID === tab)
            {
                let update = res.SO_Content_Tabs
                update[i] = browser.tabs.TAB_ID_NONE
                browser.storage.local.set({ SO_Content_Tabs: update })
            }
        })
    })
}

function handleMessages(request, sender, sendResponse)
{
    /* Table data returning from the execute script */
    if (request.command === 'SO_stage_data')
    {
        storeData(request.data, 0)
    }

    if (request.command === 'SO_pick_data')
    {
        storeData(request.data, 1)
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
                if (sender.tab.id === contentTabs[i])
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

function storeData(data, tabID)
{
    /* Flush previous day's data */
    browser.storage.local.get('currentDate').then(res => {
        let date = new Date()
        if (res.currentDate !== date.toDateString())
        {
            browser.storage.local.set({ carts: {} })
        }
    })


    /* Store content data */
    browser.storage.local.get("SO_Content_Data_Seperate").then(result => {
        result.SO_Content_Data_Seperate[tabID] = data
        browser.storage.local.set({ SO_Content_Data_Seperate: result.SO_Content_Data_Seperate })

        if (Object.keys(result.SO_Content_Data_Seperate[0]).length > 0 && Object.keys(result.SO_Content_Data_Seperate[1]).length > 0)
        {
            mergeCartData(result.SO_Content_Data_Seperate[0]).then(cartData => {
                browser.storage.local.set({ carts: injectPickData(cartData, result.SO_Content_Data_Seperate[1]) })
                browser.storage.local.set({ SO_Content_Data_Seperate: [{}, {}] })
                browser.storage.local.get('SO_UI').then((res) => {
                    browser.tabs.sendMessage(res.SO_UI, { command: 'SO_carts_updated' })
                })
            })
        }
    })
}

function injectPickData(cartData, pickData)
{
    Object.keys(cartData).forEach(waveTime => {
        Object.keys(cartData[waveTime]).forEach(routeId => {
            cartData[waveTime][routeId] = { ...cartData[waveTime][routeId], ...pickData[routeId] }
        })
    })

    return cartData
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
        
        browser.storage.local.set({ SO_Content_Tabs: windowInfo.tabs.map(tab => tab.id) })
    })
}

function handleBrowserActionClick() {
    browser.storage.local.get('currentDate').then(res => {
        if (res.currentDay === undefined) 
        {
            let date = new Date()
            browser.storage.local.set({ currentDate: date.toDateString() })
        }
    })


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
            browser.tabs.update(res.SO_UI, { active: true })
        }
    })
    
    browser.storage.local.get('SO_Content_Tabs').then(res => {
        /* No tabs exist */
        if (res.SO_Content_Tabs[0] === browser.tabs.TAB_ID_NONE &&
            res.SO_Content_Tabs[1] === browser.tabs.TAB_ID_NONE) 
        {
            LoadContentWindow()
        }
        /* Both tabs exist */
        else if (res.SO_Content_Tabs[0] !== browser.tabs.TAB_ID_NONE &&
            res.SO_Content_Tabs[1] !== browser.tabs.TAB_ID_NONE)
        {
            // do nothing
        }
        /* One tabs exists */
        else 
        {
            res.SO_Content_Tabs.forEach(tab => {
                if (tab !== browser.tabs.TAB_ID_NONE)
                {
                    browser.tabs.remove(tab)
                }
            })

            LoadContentWindow()
        }
    })
}

/* Listeners */
browser.tabs.onRemoved.addListener(handleRemoved)
browser.runtime.onMessage.addListener(handleMessages)
browser.browserAction.onClicked.addListener(handleBrowserActionClick)

/* Storage API */
browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
browser.storage.local.set({ SO_Content_Data_Seperate: [{}, {}] })
browser.storage.local.set({ SO_Content_Tabs: [browser.tabs.TAB_ID_NONE, browser.tabs.TAB_ID_NONE] })
browser.storage.local.set({ carts: {} })
browser.storage.local.set({ currentDate: undefined })