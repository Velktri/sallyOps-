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

    //sort data

    return data
}

function extractRowData(rowData) 
{
    let children = rowData.children

    let cart = children[0].children[0].innerHTML
    let route = children[1].children[0].textContent
    let loc = children[3].children[0].innerHTML
    /*let status = children[4].children[0].textContent.trim()
    status = status.replace(/(\r\n|\n|\r)/gm, "")*/

    return { cart, route, loc /*, status */ }
}

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "SO_getTableData")
    {
        let data = readTable()
        return Promise.resolve({ data })
    }
})