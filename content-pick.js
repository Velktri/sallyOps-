function readTable() 
{
    let tableData = []
    let table = document.getElementsByTagName('table')[0].children[1]
    let rows = table.getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++)
    {
        if (rows[i].childNodes.length !== 0) 
        {
            let rowData = extractRowData(rows[i])
            tableData.push(rowData)
            /*if (tableData[rowData.stationPair] === undefined)
            {
                tableData[rowData.stationPair] = {}
            }*/

            
        }

        /*if (rows[i].childNodes.length !== 0) 
        {
            let rowData = extractRowData(rows[i])
            console.log(rowData)
            if (tableData[rowData.stageTime] === undefined)
            {
                tableData[rowData.stageTime] = {}
            }
    
            let waveRoutes = tableData[rowData.stageTime]
    
            let found = false
            if (waveRoutes[rowData.route] !== undefined)
            {
                waveRoutes[rowData.route].carts.push(rowData.carts)
                found = true
            }
    
            if (!found)
            {
                let temp = {[rowData.route]: { loc: rowData.loc, carts: [rowData.carts] }}
                tableData[rowData.stageTime] = { ...tableData[rowData.stageTime], ...temp }
            }
        }*/
    }

    return tableData
}

function extractRowData(rowData)
{
    let children = rowData.children

    let stationPair = children[0].children[0].innerHTML
    let pickByTime = children[1].children[0].textContent
    let route = children[2].children[0].children[0].innerHTML
    let status = children[3].children[0].children[0].children[0].children[1].innerHTML
    let progress = children[5].children[0].innerHTML
    let duration = children[7].children[0].innerHTML

    if (status === "RouteCut") { status = "Route Cut" }

    return { stationPair, pickByTime, route, status, progress, duration }
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