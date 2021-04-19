function testLog(tabs)
{
    tabs.forEach(tab => {
        console.log(tab)
    })

}

document.getElementById("getTableButton").onclick = () => {

    // get the tab for station command
    let queries = browser.tabs.query({ url: "*://logistics.amazon.com/station/dashboard/stage" })
    queries.then(testLog)

    // "*://*.mozilla.org/*"
    /*queries.then.forEach(query => {
        console.log(query)
        testLog()
    })*/
        //.then(testLog)
        //.catch()
    // get the table data
    
}