function readTable() 
{
    let tableData = {}
    let table = document.getElementsByTagName('table')[0].children[1]
    let rows = table.getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++)
    {
        if (rows[i].childNodes.length !== 0) 
        {
            tableData = { ...tableData, ...extractRowData(rows[i]) }
        }
    }

    return tableData
}

function extractRowData(rowData)
{
    let children = rowData.children

    let stationPair = children[0].children[0].innerHTML
    let route = children[2].children[0].children[0].children[0].innerHTML
    let status = children[3].children[0].children[0].children[0].children[1].innerHTML
    let progress = children[5].children[0].innerHTML

    if (status === "RouteCut") { status = "Route Cut" }

    return { [route]: { stationPair, status, progress }}
}

function compileData(pickObserver)
{
    if (pickObserver !== undefined) { pickObserver.disconnect() }
    return readTable()
    //clickNextPage()
}

function callback(mutations, pickObserver)
{
    console.log(mutations[0].target.tagName)
    if (mutations[0].target.tagName === 'TBODY')
    {
        setTimeout(function() {
            browser.runtime.sendMessage({ command: 'SO_pick_data', data: compileData(pickObserver) })
        }, 500)
    }
}

if (window.location.hash === '#/pick')
{
    console.log("Content script for pick is loaded.")

    const pickObserver = new MutationObserver(callback)
    pickObserver.observe(document, { attributes: true, childList: true, subtree: true })
}