let data = []

function getTableData(tabs)
{
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
    let queries = browser.tabs.query({ url: "*://logistics.amazon.com/station/dashboard/stage" /*"https://velktri.github.io/sallyOps-/testing/test5.html"  "*://logistics.amazon.com/station/dashboard/stage", "*://*.mozilla.org/*"*/ })
    let tableData = queries.then(getTableData)

    // store data
    console.log(tableData)
}

document.getElementById("print").onclick = () => {
    console.log(data)
}