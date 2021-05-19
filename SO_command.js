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

function sendCart(btn)
{
    let cartName = btn.parentNode.childNodes[1].innerHTML

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

    btn.blur()

    browser.runtime.sendMessage({
        command: 'SO_cart_audit',
        auditedCarts
    })
}

function updateCart(cartName, routeData)
{
    let loc = parseInt(routeData.loc.split('.')[1].slice(1))
    let sallyHtmlContainer = document.getElementById('sallyRow_' + loc)

    let routeList = sallyHtmlContainer.childNodes[1].childNodes[0].childNodes
    routeList.forEach(ele => {
        if (ele.childNodes[1].innerHTML === cartName) 
        {
            ele.childNodes[0].checked = true
            sendCart(ele.childNodes[0])
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
/*
    let duplicateRoutes = []
    for (let i = 1; i <= 20; i++) {
        let sallyHtmlContainer = document.getElementById('sallyRow_' + i)
        let sallyTitle = sallyHtmlContainer.childNodes[0]
        let sallyContents = sallyHtmlContainer.childNodes[1]

        let sallyRoutes = Object.keys(waveData).filter(potentialRow => {
            let sallyLoc = waveData[potentialRow].loc.split('.')
            if (sallyLoc[0] === 'STG')
            {
                return parseInt(sallyLoc[1].slice(1)) === i
            }
            return false
        })


        let sallyRoute = sallyRoutes[0]
        for (let j = 1; j < sallyRoutes.length; j++)
        {
            duplicateRoutes.push(sallyRoutes[j])
        }

        while (sallyContents.firstChild)
        {
            sallyContents.removeChild(sallyContents.firstChild)
        }
        sallyTitle.childNodes[2].checked = false

        if (sallyRoute !== undefined)
        {
            sallyTitle.childNodes[0].innerHTML = waveData[sallyRoute].loc.split('.')[1]
            sallyTitle.childNodes[1].innerHTML = sallyRoute
            sallyTitle.childNodes[2].childNodes[0].disabled = false
            sallyContents.appendChild(list(waveData[sallyRoute].carts))
        }
        else
        {
            sallyTitle.childNodes[0].innerHTML = ''
            sallyTitle.childNodes[1].innerHTML = 'Empty'
            sallyTitle.childNodes[2].childNodes[0].disabled = true

        }
    }

    duplicateRoutes.forEach(route => {
        for (let i = 20; i >= 1; i--)
        {
            let sallyHtmlContainer = document.getElementById('sallyRow_' + i)
            let sallyTitle = sallyHtmlContainer.childNodes[0]
            let sallyContents = sallyHtmlContainer.childNodes[1]
            if (sallyTitle.childNodes[1].innerHTML === 'Empty')
            {
                sallyTitle.childNodes[1].innerHTML = route
                sallyTitle.childNodes[0].innerHTML = waveData[route].loc.split('.')[1]
                sallyTitle.childNodes[2].childNodes[0].disabled = false
                sallyContents.appendChild(list(waveData[route].carts))

                break
            }
        }
    })*/
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


function list(elements)
{
    let ul = document.createElement('ul')

    elements.forEach(ele => {
        let li = document.createElement('li')
        li.className = "cart-list"

        let cartInput = document.createElement('input')

        if (auditedCarts[ele.cart] !== undefined)
        {
            cartInput.checked = auditedCarts[ele.cart]
        }
        cartInput.className = 'cart-input'
        cartInput.type = 'checkbox'
        cartInput.onclick = () => sendCart(cartInput)

        li.appendChild(cartInput)
        let cartLabel = document.createElement('label')
        cartLabel.innerHTML = ele.cart
        li.appendChild(cartLabel)

        ul.appendChild(li)
    })

    return ul
}

function buildRouteContainer(index)
{
     return `<div class="column">
                <div id="sallyRow_${index + 1}" class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            CX4
                        </p>

                        <p class="card-header-title is-centered">
                        A01
                        </p>
                        <button class="card-header-icon" aria-label="more options">
                            <span class="icon">
                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                    </header>
                    <div class="card-content">
                        <button class="button is-fullwidth is-dark">
                            <span class="icon is-small">
                                <i class="fas fa-check"></i>
                            </span>
                            <span>CRT1-153-FLJ</span>
                        </button>
                        <button class="button is-fullwidth is-dark">CRT1-605-AXV</button>
                        <button class="button is-fullwidth is-dark">CRT1-710-OPO</button>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item">Staged</a>
                    </footer>
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