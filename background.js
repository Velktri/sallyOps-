function handleRemoved(tabID, info)
{
    browser.storage.local.get("SO_UI").then(res => {
        if (tabID === res.SO_UI)
        {
            browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
        }
    })
}

function handleCartAudit(request, sender, sendResponse)
{
    if (request.command === 'SO_cart_audit')
    {
        browser.storage.local.set({ SO_audits: request.auditedCarts })
    }
}

browser.storage.local.set({ SO_audits: {} })

browser.tabs.onRemoved.addListener(handleRemoved)
browser.runtime.onMessage.addListener(handleCartAudit)

