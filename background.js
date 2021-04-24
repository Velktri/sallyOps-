function handleRemoved(tabID, info)
{
    browser.storage.local.get("SO_UI").then(res => {
        if (tabID === res.SO_UI)
        {
            browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
        }
    })
}

browser.tabs.onRemoved.addListener(handleRemoved)