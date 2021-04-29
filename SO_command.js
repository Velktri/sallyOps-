let activeWaveTab = 0
let sortedStageTimes = []

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
        document.getElementById("stage-by-time").innerHTML = this.id

        let departClock = this.id.split(':')
        /*departClock[1] += 30
        if (departClock[1])
        document.getElementById("depart-time").innerHTML = parseInt(this.id) + 30
*/
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

function buildRouteContainer(sallyInfo)
{
    let outerShell = document.createElement('div')
    outerShell.className = 'outerShell'

    let title = document.createElement('div')
    title.className = 'routeTitleContainer flex-container'

    let sallyLoc = document.createElement('div')
    sallyLoc.className = 'sallyLocation'
    title.appendChild(sallyLoc)

    let routeTitle = document.createElement('div')
    routeTitle.className = 'routeTitle'
    title.appendChild(routeTitle)

    let selectionBtn = document.createElement('div')
    selectionBtn.className = 'sallySelection'
    title.appendChild(selectionBtn)


    let contents = document.createElement('div')
    contents.className = 'routeContents'

    outerShell.appendChild(title)
    outerShell.appendChild(contents)

    if (sallyInfo !== undefined)
    {
        routeTitle.innerHTML = sallyInfo.route
        sallyLoc.innerHTML = sallyInfo.loc
        selectionBtn.innerHTML = 'BTN'
        contents.appendChild(list(sallyInfo.carts))
    }
    else
    {
        routeTitle.innerHTML = "Empty Sally Row"
    }


    return outerShell
}

function generateBody(routeData)
{
    let sortedRoutes = [...Array(20)]
    let duplicateSallyPorts = []

    document.getElementById('routeAmount').innerHTML = Object.keys(routeData).length

    routeData.forEach(route => {
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
    })


    let leftSallys = document.getElementById('left-sally')
    let RightSallys = document.getElementById('right-sally')

    sortedRoutes.forEach((sallyInfo, index) => {
        if (index < 10)
        {
            if (sallyInfo !== undefined)
            {
                leftSallys.appendChild(buildRouteContainer(sallyInfo))
            }
            else
            {
                leftSallys.appendChild(buildRouteContainer())
            }
        }
        else 
        {
            if (sallyInfo !== undefined)
            {
                RightSallys.appendChild(buildRouteContainer(sallyInfo))
            }
            else
            {
                RightSallys.appendChild(buildRouteContainer())
            }
        }
    })
}

window.onload = () => {
    browser.storage.local.get('carts').then((res) => {
        let cartData = res.carts

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

        generateBody(cartData[sortedStageTimes[activeWaveTab]])
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