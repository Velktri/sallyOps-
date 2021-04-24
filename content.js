// read page data from table
function readTable() 
{
    let table = document.getElementsByTagName('table')[0]
    let rows = table.getElementsByTagName('tr')

    let data = {}
    for (i = 2; i < rows.length; i++) 
    {
        let rowData = extractRowData(rows[i])

        if (rowData.route in data)
        {
            data[rowData.route].carts.push(rowData.carts)
        }
        else
        {
            let temp = {}
            temp[rowData.route] = { loc: rowData.loc, carts: [rowData.carts] }
            data = {...data, ...temp}
        }
    }

    // ignore parsing waves after depart time or when wave is checked as completed

    return data
}

function extractRowData(rowData)
{
    let children = rowData.children

    let cart = children[0].children[0].innerHTML
    let route = children[1].children[0].textContent
    let loc = children[3].children[0].innerHTML

    let status = children[4].children[0].textContent.trim()
    if (status.slice(0, 3) === "Not")
    {
        status = "Not Ready"
    }

    let dwellTime = children[5].children[0].innerHTML

    return { route, loc, 'carts': { cart, status, dwellTime }}
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

function clickNextPage()
{
    let nextButton = getNextButton()

    console.log(nextButton)
    /* .click()
    while nextButton !== null

    // consider adding a delay

    readTable()
    nextButton = getNextButton()*/
}

console.log("Content script is loaded.")

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "SO_getTableData")
    {
        let data = readTable()
        clickNextPage()
        return Promise.resolve({ data })
    }
})