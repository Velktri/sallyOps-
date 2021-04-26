// read page data from table
function readTable() 
{
    let table = document.getElementsByTagName('table')[0]
    let rows = table.getElementsByTagName('tr')

    let waveData = {}
    for (i = 2; i < rows.length; i++)
    {
        let rowData = extractRowData(rows[i])

        if (waveData[rowData.stageTime] === undefined)
        {
            waveData[rowData.stageTime] = []
        }

        let waveRoutes = waveData[rowData.stageTime]

        let found = false
        waveRoutes.forEach(waveRoute => {
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
            //waveRoutes = { ...waveRoutes, ...temp }
            waveData[rowData.stageTime].push(temp)
        }


        /*if (rowData.route in waveRoutes)
        {
            waveRoutes[rowData.route].carts.push(rowData.carts)
        }
        else
        {
            let temp = {}
            temp[rowData.route] = { loc: rowData.loc, carts: [rowData.carts] }
            waveRoutes = { ...waveRoutes, ...temp }
        }*/

        
    }

    // ignore parsing waves after depart time or when wave is checked as completed

    return waveData
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
    let pageBtn = document.getElementsByClassName("css-1jr2uut")

    for (let i = 0; i < pageBtn.length; i++) {
        if (pageBtn[i].getAttribute("aria-label").slice(6, 10) === "next")
        {
            return pageBtn[i]
        }
    }

    return null
}

function clickNextPage(data)
{
    let nextButton = getNextButton()

    console.log(nextButton)
    while (nextButton !== null)
    {
        nextButton.click()
        console.log('clicked next page')
        data = { ...data, ...readTable() }
        nextButton = getNextButton()
    }

    return data
}

console.log("Content script is loaded.")

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "SO_getTableData")
    {
        let data = readTable()
        //data = clickNextPage(data)

        return Promise.resolve({ data })
    }
})