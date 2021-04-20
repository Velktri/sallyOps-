function getTableData(tabs)
{
    let data = []
    tabs.forEach(tab => {
        console.log(tab)
        browser.tabs.sendMessage(tab.id, { command: "SO_getTableData" }).then(response => {
            console.log(response.data)
            if (response.data.length > 0)
            {
                data = response.data
            }
        })
    })

    return data
}

document.getElementById("getTableButton").onclick = () => {

    // get the tab for station command
    let queries = browser.tabs.query({ url: "https://velktri.github.io/sallyOps-/testing/test5.html" /*"*://*.mozilla.org/*"*/ })
    let tableData = queries.then(getTableData)

    // store data
    console.log(tableData)
    /*queries.then.forEach(query => {
        console.log(query)
        testLog()
    })*/
        //.then(testLog)
        //.catch()
    // get the table data
    
}