// read page data from table
function readTable() 
{
    let table = document.getElementsByTagName('table')[0]
    let rows = table.getElementsByTagName('tr')

    let data = []
    for (i = 2; i < rows.length; i++) 
    {
        data.push(extractData(rows[i]))
    }

    //sort data

    return data
}

function extractRowData(rowData) 
{
    let children = rowData.children

    let cart = children[0].children[0].innerHTML
    let route = children[1].children[0].innerHTML
    let loc = children[4].children[0].innerHTML
    let status = children[5].children[0].innerHTML

    return { cart, route, loc, status }
}