let activeWaveTab = 0
let sortedStageTimes = []
let cartData = {}
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

        /*cartData[sortedStageTimes[activeWaveTab]].forEach(route => {
            let routeID = Object.keys(route)[0]
            let routeObj = route[routeID]
    
            let sallyIndex = parseInt(routeObj.loc.split('.')[1].slice(1))
            let sallyInfo = { route: routeID, loc: routeObj.loc, carts: routeObj.carts }
    
            if (sortedRoutes[sallyIndex - 1] === undefined)
            {
                sortedRoutes[sallyIndex - 1] = sallyInfo
            }
            else
            {
                duplicateSallyPorts.push(sallyInfo)
            }
        })*/

        return Promise.resolve('Carts are processed.')
    })
}

function injectCartData()
{
    let waveData = cartData[sortedStageTimes[activeWaveTab]]
    document.getElementById('routeAmount').innerHTML = waveData.length

    cartData[sortedStageTimes[activeWaveTab]].forEach(sallyRow => {
        if (sallyRow !== undefined)
        {
            let routeID = Object.keys(sallyRow)[0]
            let routeObj = sallyRow[routeID]
    
            //let sallyIndex = parseInt(routeObj.loc.split('.')[1].slice(1))
            //let sallyInfo = { route: routeID, loc: routeObj.loc, carts: routeObj.carts }
            let sallyLoc = routeObj.loc.split('.')
            if (sallyLoc[0] === 'STG')
            {
                console.log(sallyLoc[1].slice(1))
                let sallyHtmlContainer = document.getElementById('sallyRow_' + sallyLoc[1].slice(1))
                sallyHtmlContainer.childNodes[0].childNodes[1].innerHTML = routeID
            }
        }
    })

    /*if (sallyInfo !== undefined)
    {
        routeTitle.innerHTML = sallyInfo.route
        sallyLoc.innerHTML = sallyInfo.loc
        selectionBtn.innerHTML = 'BTN'
        contents.appendChild(list(sallyInfo.carts))
    }*/
}

function selectWave()
{
    browser.storage.local.get('carts').then((res) => {
        let tablinks = document.getElementsByClassName("tablinks")
        for (var i = 0; i < tablinks.length; i++)
        {
            if (tablinks[i].id === this.id)
            {
                activeWaveTab = i
            }
        }


        let leftSally = document.getElementById("left-sally")
        let rightSally = document.getElementById("right-sally")
        while (leftSally.firstChild && rightSally.firstChild) 
        {
            leftSally.removeChild(leftSally.firstChild);
            rightSally.removeChild(rightSally.firstChild);
        }

        generateBody(res.carts[sortedStageTimes[activeWaveTab]])
        activeWaveTab = parseInt(this.id)

        let clock = this.id.split(':')
        document.getElementById("stage-by-time").innerHTML = parseInt(clock[0]) + ':' + clock[1]

        let departClock = this.id.split(':')
        departClock[1] = parseInt(departClock[1]) + 30
        if (departClock[1] >= 60)
        {
            document.getElementById("depart-time").innerHTML = (parseInt(departClock[0]) + 1) + ':' + (parseInt(departClock[1]) - 60)
        }
        else
        {
            document.getElementById("depart-time").innerHTML = parseInt(departClock[0]) + ':' + departClock[1]
        }


        for (var i = 0; i < tablinks.length; i++)
        {
            tablinks[i].className = tablinks[i].className.replace(" active", "")
        }

        this.className += " active"
    })
}


function list(elements)
{
    let ul = document.createElement('ul');

    elements.forEach(ele => {
        let li = document.createElement('li')
        li.innerHTML = ele.cart
        li.className = "cartList"
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

    let selectionBtn = document.createElement('div')
    selectionBtn.className = 'sallySelection'
    title.appendChild(selectionBtn)


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
        let tabList = document.getElementById('tabList')
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
        })
    
        generateBody()
        injectCartData()
    })
}

function getCartInput()
{
    let cartVal = document.getElementById("cart-scanner")
    document.getElementById("scanned-cart").innerHTML = cartVal.value
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