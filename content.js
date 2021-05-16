let waveData = {}
// read page data from table
function readTable() 
{
    let table = document.getElementsByTagName('table')[0]
    let rows = table.getElementsByTagName('tr')

    for (i = 2; i < rows.length; i++)
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
            let temp = {}
            temp[rowData.route] = { loc: rowData.loc, carts: [rowData.carts] }
            waveData[rowData.stageTime] = { ...waveData[rowData.stageTime], ...temp }
        }
        /*waveRoutes.forEach(waveRoute => {
            if (waveRoute[rowData.route] !== undefined)
            {
                waveRoute[rowData.route].carts.push(rowData.carts)
                found = true
            }
        })

        if (!found)
        {
            let temp = {}
            temp[rowData.route] = { loc: rowData.loc, carts: [rowData.carts] }
            waveData[rowData.stageTime].push(temp)
        }*/
    }

    // ignore parsing waves after depart time or when wave is checked as completed
}

function extractRowData(rowData)
{
    let children = rowData.children

    let cart = children[0].children[0].innerHTML
    let route = children[1].children[0].textContent
    let loc = children[3].children[0].innerHTML
    let stageTime = children[2].children[0].innerHTML

    let status = children[4].children[0].textContent.trim()
    if (status.slice(0, 3) === "Not")
    {
        status = "Not Ready"
    }

    let dwellTime = children[5].children[0].innerHTML
    return { route, loc, stageTime, 'carts': { cart, status, dwellTime }}
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

function clickNextPage()
{
    let nextButton = getNextButton()
    while (nextButton !== null)
    {
        nextButton.click()
        readTable()
        nextButton = getNextButton()
    }
}

console.log("Content script is loaded.")

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "SO_getTableData")
    {
        resetToFirstPage()
        readTable()
        clickNextPage()

        let data = waveData
        waveData = {}
        return Promise.resolve({ data })
    }
})