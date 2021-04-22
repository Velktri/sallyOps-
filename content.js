// read page data from table
function readTable() 
{
    let table = document.getElementsByTagName('table')[0]
    let rows = table.getElementsByTagName('tr')

    let data = []
    for (i = 2; i < rows.length; i++) 
    {
        data.push(extractRowData(rows[i]))
    }

    // sort data
    // consider building a dictionary for routes
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

    return { cart, route, loc, status, dwellTime }
}

function clickNextPage() 
{
    let nextButton = document.getElementsByClassName("css-1jr2uut")

    nextButton.forEach(but => {
        console.log(but)
    });
    //document.getElementsByClassName("css-1jr2uut")[0].click()
}

console.log("Content script is loaded.")

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "SO_getTableData")
    {
        let data = readTable()
        console.log(data)
        //clickNextPage()
        return Promise.resolve({ data })
    }
})