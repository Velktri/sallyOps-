// read page data from table
function readTable(waveData)
{
    let table = document.getElementsByTagName('table')[0].children[1]
    let rows = table.getElementsByTagName('tr')

    for (let i = 1; i < rows.length; i++)
    {
        if (rows[i].childNodes.length !== 0)
        {
            let rowData = extractRowData(rows[i])
            if (waveData[rowData.stageTime] === undefined)
            {
                waveData[rowData.stageTime] = {}
            }
    
            let waveRoutes = waveData[rowData.stageTime]
    
            let found = false
            if (waveRoutes[rowData.route] !== undefined)
            {
                waveRoutes[rowData.route].carts.push(rowData.carts)
                found = true
            }
    
            if (!found)
            {
                let temp = {[rowData.route]: { loc: rowData.loc, carts: [rowData.carts] }}
                waveData[rowData.stageTime] = { ...waveData[rowData.stageTime], ...temp }
            }
        }
    }

    return waveData
}

function extractRowData(rowData)
{
    let children = rowData.children

    let stageTime = children[0].children[0].innerHTML //alignStageTime(children[0].children[0].innerHTML)
    let route = children[1].children[0].textContent
    let cart = children[2].children[0].innerHTML
    let loc = children[4].children[0].innerHTML


    let status = children[5].children[0].textContent.trim()
    if (status.slice(0, 3) === "Not") { status = "Not Ready" }

    let dwellTime = children[6].children[0].innerHTML
    let stager = children[7].children[0].innerHTML

    return { route, loc, stageTime, 'carts': { cart, status, dwellTime, stager, isAudited: false }}
}

function alignStageTime(stageTime)
{
    let newStageTime = stageTime
    let stageSplit = stageTime.split(':')

    if (stageSplit[1] !== '20' && stageSplit[1] !== '50')
    {
        newStageTime = stageSplit[0] + ':' + (parseInt(stageSplit[1]) + 15)
    }

    return newStageTime
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
        data = readTable(data)
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

function callback(mutations, observer)
{
    if (mutations[0].target.tagName === 'TBODY')
    {
        if (observer !== undefined) { observer.disconnect() }
        browser.runtime.sendMessage({ command: 'SO_stage_data', data: compileData() })

        setInterval(function() {
            browser.runtime.sendMessage({ command: 'SO_stage_data', data: compileData() })
        }, 30000)
    }
}

if (window.location.hash === '#/stage')
{
    console.log("Content script for Stage is loaded.")

    injectModal()

    const observer = new MutationObserver(callback)
    observer.observe(document, { attributes: true, childList: true, subtree: true })
}