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

    /* Data returning from the content script */
    if (request.command === 'SO_table_data')
    {
        storeCartData(request.data)
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

    /* Close Content Window */
    browser.storage.local.get("SO_Content_Window").then((result) => {
        if (result.SO_Content_Window !== browser.windows.WINDOW_ID_NONE)
        {
            browser.windows.remove(result.SO_Content_Window)
            browser.storage.local.set({ SO_Content_Window: browser.windows.WINDOW_ID_NONE })
        }
    })
}

function LoadContentWindow()
{
    browser.windows.create({
        url: 'https://logistics.amazon.com/station/dashboard/stage',
    }).then(windowInfo => {
        browser.windows.update(
            windowInfo.id,
            {
                state: "minimized"
            }
        )

        let gate = false
        let tabStatusCheck = setInterval(function() {
            browser.tabs.executeScript(
                windowInfo.tabs[0].id,
                {
                    code: "console.log('ping')"
                }
            ).then(() => {
                console.log('tick')
                if (gate === false)
                {
                    gate = true
                    clearInterval(tabStatusCheck)
                    console.log('success')
                    browser.tabs.executeScript(
                        windowInfo.tabs[0].id,
                        {
                            file: "/content.js",
                            allFrames: true
                        }
                    )
                }
            }, (error) => {
                console.log(error)
            })
        }, 500)

        browser.storage.local.set({ SO_Content_Window: windowInfo.id })
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
browser.storage.local.set({ SO_Content_Window: browser.windows.WINDOW_ID_NONE })
browser.storage.local.set({ carts: {} })