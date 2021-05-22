let activeWaveTab = 0
let sortedStageTimes = []
let cartData = {}
let auditedCarts = {}
let sortedRoutes = [...Array(20)]
let duplicateSallyPorts = []

function processCartData()
{
    return browser.storage.local.get('carts').then((res) => {
        cartData = res.carts
        sortedStageTimes = Object.keys(cartData).sort((x, y) => {
            let xTime = x.split(':')
            let yTime = y.split(':')

            let xHour = parseInt(xTime[0])
            let yHour = parseInt(yTime[0])

            // hours
            if (xHour < yHour)
            {
                return -1
            }
            else if (xHour > yHour)
            {
                return 1
            }

            // mintues
            if (xHour === yHour)
            {
                let xMinute = parseInt(xTime[1])
                let yMinute = parseInt(yTime[1])

                if (xMinute < yMinute)
                {
                    return -1
                }

                if (xMinute > yMinute)
                {
                    return 1
                }
            }

            return 0
        })

        return browser.storage.local.get('SO_audits').then((result) => {
            auditedCarts = result.SO_audits
            return Promise.resolve('Carts are processed.')
        })
    })
}

function buildWavePagination()
{
    let pageList = document.getElementById('wave-list')
    for (let i = 0; i < sortedStageTimes.length; i++)
    {
        let pagelink = document.createElement('a')
        pagelink.className = 'pagination-link'
        if (i == 0) { pagelink.className += ' is-current' }

        pagelink.innerHTML = i + 1
        pagelink.onclick = () => { selectWave(i) }

        let listEle = document.createElement('li')
        listEle.appendChild(pagelink)
        pageList.appendChild(listEle)
    }
}

function sendRoute(btn)
{
    let routeList = btn.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].childNodes

    routeList.forEach(element => {
        let cartName = element.childNodes[1].innerHTML
        element.childNodes[0].checked = btn.checked
        
        let found = false
        if (auditedCarts[cartName] !== undefined)
        {
            auditedCarts[cartName] = btn.checked
            found = true
        }
    
        if (!found)
        {
            let temp = {}
            temp[cartName] = btn.checked
            auditedCarts = { ...auditedCarts, ...temp }
        }
    })

    btn.blur()

    browser.runtime.sendMessage({
        command: 'SO_cart_audit',
        auditedCarts
    })
}

function sendCart(btn, isAlwaysTrue)
{
    let cartName = btn.children[0].children[0].children[1].innerHTML

    let uniqueCartName = activeWaveTab + '|' + cartName
    let flip = (btn.getAttribute('data-val') === 'true') ? false : true
    flip = flip || isAlwaysTrue

    btn.setAttribute('data-val', flip)

    let found = false
    if (auditedCarts[uniqueCartName] !== undefined)
    {
        auditedCarts[uniqueCartName] = flip
        found = true
    }

    if (!found)
    {
        let temp = {}
        temp[uniqueCartName] = flip
        auditedCarts = { ...auditedCarts, ...temp }
    }

    btn.children[0].children[0].children[0].innerHTML = setListStyle(flip)

    browser.runtime.sendMessage({
        command: 'SO_cart_audit',
        auditedCarts
    })
}


function updateCart(cartName, routeData)
{
    let sallyHtmlContainer = undefined
    for (let i = 1; i <= 20; i++)
    {
        let potentialContainer = document.getElementById('sallyRow_' + i)
        if (potentialContainer.children[0].children[0].innerHTML === routeData.loc.split('.')[1])
        {
            sallyHtmlContainer = potentialContainer
        }
    }

    let routeList = sallyHtmlContainer.children[1].children
    Array.from(routeList).forEach(ele => {
        if (ele.children[0].children[0].children[1].innerHTML === cartName) 
        {
            sendCart(ele, true)
        }
    })
}

function checkForCart(cartName)
{
    let waveData = cartData[sortedStageTimes[activeWaveTab]]
    Object.keys(waveData).forEach(routeKey => {
        waveData[routeKey].carts.forEach(ele => {
            if (cartName === ele.cart)
            {
                updateCart(cartName, waveData[routeKey])
                return
            }
        })
    })
}

function injectCartData()
{
    let waveData = cartData[sortedStageTimes[activeWaveTab]]
    let clock = sortedStageTimes[activeWaveTab].split(':')

    document.getElementById('route-amount').innerHTML = Object.keys(waveData).length
    document.getElementById('stage-by-time').innerHTML = parseInt(clock[0]) + ':' + clock[1]

    if ((parseInt(clock[1]) + 30) >= 60)
    {
        document.getElementById("depart-time").innerHTML = (parseInt(clock[0]) + 1) + ':' + (parseInt(clock[1]) - 30)
    }
    else
    {
        document.getElementById("depart-time").innerHTML = parseInt(clock[0]) + ':' + (parseInt(clock[1]) + 30)
    }

    let sortedRoutes = {}
    let overflowRoutes = []
    Object.keys(waveData).forEach(route => {
        let sallyLoc = waveData[route].loc.split('.')
        if (sallyLoc[0] === 'STG')
        {
            if (Object.keys(sortedRoutes).includes(sallyLoc[1].charAt(0)))
            {
                if (sortedRoutes[sallyLoc[1].charAt(0)].length < 4)
                {
                    sortedRoutes[sallyLoc[1].charAt(0)].push(route)
                }
                else
                {
                    overflowRoutes.push(route)
                }
            }
            else
            {
                sortedRoutes[sallyLoc[1].charAt(0)] = []
                sortedRoutes[sallyLoc[1].charAt(0)].push(route)
            }

        }
    })

    let letterMap = ['A', 'B', 'C', 'D', 'E']
    let routeList = Array(20).fill(undefined)
    for (let i = 0; i < letterMap.length; i++)
    {
        if (Object.keys(sortedRoutes).includes(letterMap[i]))
        {
            for (let j = 0; j < sortedRoutes[letterMap[i]].length; j++)
            {
                routeList[(i * 4) + j] = sortedRoutes[letterMap[i]][j]
            }
        }
    }

    for (let i = 1; i <= 20; i++)
    {
        let sallyHtmlContainer = document.getElementById('sallyRow_' + i)
        let sallyTitle = sallyHtmlContainer.children[0]
        let sallyContents = sallyHtmlContainer.children[1]

        while (sallyContents.firstChild)
        {
            sallyContents.removeChild(sallyContents.firstChild)
        }

        let sallyRoute = routeList[i - 1]
        if (sallyRoute !== undefined)
        {
            sallyTitle.children[0].innerHTML = waveData[sallyRoute].loc.split('.')[1]
            sallyTitle.children[1].innerHTML = sallyRoute
            sallyContents.innerHTML = buildRouteList(waveData[sallyRoute].carts)

            Array.from(sallyContents.children).forEach(element => {
                element.onclick = () => sendCart(element, false)
            })

            sallyTitle.children[2].children[0].innerHTML = setListStyle(isRouteAudited(sallyHtmlContainer))
        }
        else
        {
            sallyTitle.children[0].innerHTML = ''
            sallyTitle.children[1].innerHTML = 'Empty'
        }
    }
}

function selectWave(waveIndex)
{
    
    let pageList = Array.from(document.getElementById('wave-list').childNodes).filter(node => {
        return node.tagName === 'LI'
    })

    pageList.forEach(page => {
        page.childNodes[0].className = 'pagination-link'
    })

    pageList[waveIndex].childNodes[0].className = 'pagination-link is-current'
    activeWaveTab = parseInt(waveIndex)

    injectCartData()
}

function buildRouteList(elements)
{
    let statusMap = { 'Staged': 'is-success', 'Ready': 'is-warning', 'Not Ready': 'is-light', 'Missing': 'is-danger', 'Sidelined': 'is-danger' }
    let routeList = ''
    elements.forEach(ele => {

        let uniqueCartName = activeWaveTab + '|' + ele.cart
        let auditData = auditedCarts[uniqueCartName]
        if (auditedCarts[uniqueCartName] === undefined) { auditData = false }

        routeList += `<div class="so-button" data-val="${auditData}">
                        <div class="level">
                            <div class="level-left">
                                <span class="icon so-icon-margin-right">
                                    ${setListStyle(auditData)}
                                </span>
                                <span>${ele.cart}</span>
                            </div>
        
                            <div class="level-right">
                                <div class="tag ${statusMap[ele.status]}">${ele.status}</div>
                            </div>
                        </div>
                    </div>`
    })

    return routeList
}

function setListStyle(isAudited)
{
    return (isAudited) ? '<i class="icon has-text-success ion-md-checkmark-circle so-icon-large"></i>' :
                         '<i class="icon has-text-danger ion-md-radio-button-off so-icon-large"></i>'
}

function isRouteAudited(sallyCard)
{
    sallyCard.children[1].children[0]
    return false
}


function buildRouteContainer(index)
{
     return `<div class="column">
                <div id="sallyRow_${index + 1}" class="card">
                    <header class="card-header">
                        <p class="card-header-title"></p>

                        <p class="card-header-title is-centered"></p>

                        <div class="so-button card-header-icon is-inverted" aria-label="more options">
                            <span class="icon"></span>
                        </div>
                    </header>
                    <div class="card-content">
                    </div>
                </div>
            </div>`
}

function generateBody()
{
    let contentBody = document.getElementById('waveData')
    let section
    for (let i = 0; i < 20; i++)
    {
        if (i % 4 === 0)
        {
            section = document.createElement('div')
            section.className = 'columns tab-spacing'
            contentBody.appendChild(section)
        }

        section.innerHTML += buildRouteContainer(i)
    }
}

window.onload = () => {
    processCartData().then(res => {
        buildWavePagination()
        generateBody()
        injectCartData()
    })
}

function getCartInput()
{
    let cartVal = document.getElementById("cart-scanner")
    document.getElementById("scanned-cart").innerHTML = cartVal.value

    checkForCart(cartVal.value)

    cartVal.value = ""
    cartVal.blur()
}

document.addEventListener("keypress", (e) => {
    if (e.target.tagName !== "INPUT")
    {
        var input = document.getElementById("cart-scanner")
        input.select()
        input.value = e.key
        e.preventDefault()
        setTimeout(getCartInput, 200)
    }
})