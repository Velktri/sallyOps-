// read page data from table
function readTable(waveData)
{
    let table = document.getElementsByTagName('table')[0].children[1]
    let rows = table.getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++)
    {
        if (rows[i].childNodes.length !== 0)
        {
            let rowData = extractRowData(rows[i])
            if (waveData[rowData.stageTime] === undefined)
            {
                waveData[rowData.stageTime] = {}
            }
    
            let waveRoutes = waveData[rowData.stageTime]
    
            let found = false
            if (waveRoutes[rowData.route] !== undefined)
            {
                waveRoutes[rowData.route].carts.push(rowData.carts)
                found = true
            }
    
            if (!found)
            {
                let temp = {[rowData.route]: { loc: rowData.loc, carts: [rowData.carts] }}
                waveData[rowData.stageTime] = { ...waveData[rowData.stageTime], ...temp }
            }
        }
    }

    return waveData
}

function extractRowData(rowData)
{
    let children = rowData.children

    let cart = children[0].children[0].innerHTML
    let route = children[1].children[0].textContent
    let stageTime = alignStageTime(children[2].children[0].innerHTML)
    let loc = children[3].children[0].innerHTML
    let dwellTime = children[5].children[0].innerHTML
    let stager = children[6].children[0].innerHTML

    let status = children[4].children[0].textContent.trim()
    if (status.slice(0, 3) === "Not")
    {
        status = "Not Ready"
    }

    return { route, loc, stageTime, 'carts': { cart, status, dwellTime, stager, isAudited: false }}
}

function alignStageTime(stageTime)
{
    let newStageTime = stageTime
    let stageSplit = stageTime.split(':')

    if (stageSplit[1] !== '20' && stageSplit[1] !== '50')
    {
        newStageTime = stageSplit[0] + ':' + (parseInt(stageSplit[1]) + 15)
    }

    return newStageTime
}

function getNextButton()
{
    let pageBtn = document.getElementsByClassName("css-d38mm5")

    for (let i = 0; i < pageBtn.length; i++) {
        if (pageBtn[i].childNodes[0].childNodes[0].getAttribute("aria-label").slice(6, 10) === "next")
        {
            return pageBtn[i]
        }
    }

    return null
}

function getPrevButton()
{
    let pageBtn = document.getElementsByClassName("css-d38mm5")

    for (let i = 0; i < pageBtn.length; i++) {
        if (pageBtn[i].childNodes[0].childNodes[0].getAttribute("aria-label").slice(6, 10) === "prev")
        {
            return pageBtn[i]
        }
    }

    return null
}

function resetToFirstPage()
{
    let prevBtn = getPrevButton()
    while(prevBtn !== null)
    {
        prevBtn.click()
        prevBtn = getPrevButton()
    }
}

function extractDataFromPages()
{
    let data = readTable({})
    let nextButton = getNextButton()
    while (nextButton !== null)
    {
        nextButton.click()
        data = readTable(data)
        nextButton = getNextButton()
    }

    return data
}

function compileData(observer)
{
    if (observer !== undefined) { observer.disconnect() }
    resetToFirstPage()
    return extractDataFromPages()
}

function callback(mutations, observer)
{
    console.log(mutations[0].target.tagName)
    console.log('dom changed')
    if (mutations[0].target.tagName === 'TBODY')
    {
        setTimeout(function() {
            browser.runtime.sendMessage({ command: 'SO_table_data', data: compileData(observer) })
        }, 500)
    }
}

if (window.location.hash === '#/stage')
{
    console.log("Content script is loaded.")
    
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "SO_getTableData")
        {
            return Promise.resolve({ data: compileData() })
        }
    })

    const observer = new MutationObserver(callback)
    observer.observe(document, { attributes: true, childList: true, subtree: true })
}


console.log("Test Content script is loaded.")
browser.runtime.sendMessage({ command: 'SO_table_data', data: compileData() })