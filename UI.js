function testLog(tabs)
{
    tabs.forEach(tab => {
        console.log(tab)
    })

}

document.getElementById("getTableButton").onclick = () => {

    // get the tab for station command
    let queries = browser.tabs.query({ url: "*://*.mozilla.org/*" })
    queries.then(testLog)
    /*queries.then.forEach(query => {
        console.log(query)
        testLog()
    })*/
        //.then(testLog)
        //.catch()
    // get the table data
    
}