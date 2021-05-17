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
    /*let tabList = document.getElementById('tabList')
    sortedStageTimes.forEach((wave, i) => {
        let tabBtn = document.createElement('button')
        tabBtn.className = 'tablinks'
        if (i === activeWaveTab)
        {
            tabBtn.className += ' active'
        }

        tabBtn.id = `${ wave }`
        tabBtn.innerHTML = 'Wave ' + `${i + 1}`
        tabBtn.onclick = selectWave

        tabList.appendChild(tabBtn)
    })*/

    let pageList = document.getElementById('wave-list')

    let pageOne = document.createElement('a')
    pageOne.className = 'pagination-link is-current'
    //pageOne.setAttribute('aria-label', 'Page 1')
    //pageOne.setAttribute('aria-current', 'page')
    pageOne.innerHTML = 1
    pageOne.onclick = () => { selectWave(1) }

    let listOne = document.createElement('li')
    listOne.appendChild(pageOne)
    pageList.appendChild(listOne)

    for (let i = 2; i <= sortedStageTimes.length; i++)
    {
        let pagelink = document.createElement('a')
        pagelink.className = 'pagination-link'
        //pagelink.setAttribute('aria-label', 'Goto page ' + i)
        pagelink.innerHTML = i
        pageList.onclick = () => { selectWave(i) }

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
        for (let i = 1; i <= 20; i++)
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
    })
}

function selectWave(waveIndex)
{
    let pageList = document.getElementById('wave-list').childNodes
    pageList.forEach(page => {
        page.className = 'pagination-link'
    })

    pageList[waveIndex - 1].className = 'pagination-link is-current'
    console.log(pageList[waveIndex - 1])
    activeWaveTab = parseInt(waveIndex - 1)
    //owningBtn.setAttribute('aria-current', 'page')

    /*let tablinks = document.getElementsByClassName("tablinks")
    for (let i = 0; i < tablinks.length; i++)
    {
        if (tablinks[i].id === this.id)
        {
            activeWaveTab = i
        }
    }

    for (let i = 0; i < tablinks.length; i++)
    {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    this.className += " active"*/
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
    let outerShell = document.createElement('div')
    outerShell.id = 'sallyRow_' + (index + 1)
    outerShell.className = 'outerShell'

    let title = document.createElement('div')
    title.className = 'routeTitleContainer flex-container'

    let sallyLoc = document.createElement('div')
    sallyLoc.className = 'sallyLocation'
    title.appendChild(sallyLoc)

    let routeTitle = document.createElement('div')
    routeTitle.className = 'routeTitle'
    title.appendChild(routeTitle)
    routeTitle.innerHTML = "Empty Sally Row"

    let BtnContainer = document.createElement('div')
    BtnContainer.className = 'sallySelection'

    let selectionInput = document.createElement('input')
    selectionInput.id = 'sallyButton_' + (index + 1)
    selectionInput.type = 'checkbox'
    selectionInput.disabled = true
    selectionInput.onclick = () => sendRoute(selectionInput)

    BtnContainer.appendChild(selectionInput)
    title.appendChild(BtnContainer)


    let contents = document.createElement('div')
    contents.className = 'routeContents'

    outerShell.appendChild(title)
    outerShell.appendChild(contents)


    return outerShell
}

function generateBody()
{
    let col1 = document.getElementById('sally-1-5')
    let col2 = document.getElementById('sally-6-10')
    let col3 = document.getElementById('sally-11-15')
    let col4 = document.getElementById('sally-16-20')

    for (let i = 0; i < 20; i++)
    {
        if (i < 5)
        {
            col1.appendChild(buildRouteContainer(i))
        }
        else if (i < 10)
        {
            col2.appendChild(buildRouteContainer(i))
        }
        else if (i < 15)
        {
            col3.appendChild(buildRouteContainer(i))
        }
        else
        {
            col4.appendChild(buildRouteContainer(i))
        }
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