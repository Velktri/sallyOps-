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

function getNextButton()
{
    let pageBtn = document.getElementsByClassName("css-d38mm5")

    for (let i = 0; i < pageBtn.length; i++) {
        if (pageBtn[i].childNodes[0].childNodes[0].getAttribute("aria-label").slice(6, 10) === "next")
        {
            return pageBtn[i]
        }
    }

    return null
}

function getPrevButton()
{
    let pageBtn = document.getElementsByClassName("css-d38mm5")

    for (let i = 0; i < pageBtn.length; i++) {
        if (pageBtn[i].childNodes[0].childNodes[0].getAttribute("aria-label").slice(6, 10) === "prev")
        {
            return pageBtn[i]
        }
    }

    return null
}

function resetToFirstPage()
{
    let prevBtn = getPrevButton()
    while(prevBtn !== null)
    {
        prevBtn.click()
        prevBtn = getPrevButton()
    }
}

function extractDataFromPages()
{
    let data = readTable({})
    let nextButton = getNextButton()
    while (nextButton !== null)
    {
        nextButton.click()
        data = { ...data, ...readTable(data) }
        nextButton = getNextButton()
    }

    return data
}

function compileData()
{
    resetToFirstPage()
    return extractDataFromPages()
}

function injectModal() 
{
    let bod = document.body
    let modal = document.createElement('div')

    let styles = `
        .modal-content { 
            background-color: #fefefe;
            margin: auto;
            padding: 20px;
            border: 1px solid #000;
            border-radius: 1rem;
            width: 80%;
        }
        .modal {
            position: fixed;
            z-index: 1;
            padding-top: 50vh;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0, 0, 130);
            background-color: rgba(0, 0, 130, 0.8);
        }
        `

    let modalStyle = document.createElement("style")
    modalStyle.type = "text/css"
    modalStyle.innerText = styles
    document.head.appendChild(modalStyle)

    modal.innerHTML = `
    <div id="myModal" class="modal">
        <div class="modal-content">
            <p>This tab is being used by the SallyOps+ addon. Closing it will result in errors. </p>
            <p>Only close this window if you're are sure you don't need to use SallyOps+ anymore.</p>
        </div>
    </div>`

    bod.appendChild(modal)
}

function callback(mutations, pickObserver)
{
    if (mutations[0].target.tagName === 'TBODY')
    {
        if (pickObserver !== undefined) { pickObserver.disconnect() }
        browser.runtime.sendMessage({ command: 'SO_pick_data', data: compileData() })

        setInterval(function() {
            browser.runtime.sendMessage({ command: 'SO_pick_data', data: compileData() })
        }, 30000)
    }
}

if (window.location.hash === '#/pick')
{
    console.log("Content script for pick is loaded.")
    injectModal()

    const pickObserver = new MutationObserver(callback)
    pickObserver.observe(document, { attributes: true, childList: true, subtree: true })
}