let activeWaveTab = 1
let sortedStageTimes = []

function selectWave()
{
    let waveBody = document.getElementById("waveData")
    waveBody.innerHTML = "wave " + this.id
    activeWaveTab = parseInt(this.id, 10)

    tablinks = document.getElementsByClassName("tablinks")
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "")
    }

    this.className += " active"
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
    title.className = 'routeTitle'

    let contents = document.createElement('div')
    contents.className = 'routeContents'

    outerShell.appendChild(title)
    outerShell.appendChild(contents)

    if (sallyInfo !== undefined)
    {
        title.innerHTML = sallyInfo.route + ' ' + sallyInfo.loc
        contents.appendChild(list(sallyInfo.carts))
    }
    else
    {
        title.innerHTML = "Empty Sally Row"
    }


    return outerShell
}

function generateBody(routeData)
{
    let sortedRoutes = [...Array(20)]
    let duplicateSallyPorts = []

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
    });

    console.log(sortedRoutes)


    let routesHTML = document.createElement('div')
    routesHTML.className = "flex-container"
    let leftSallys = document.createElement('div')
    leftSallys.className = "sallyColumn flex-container"
    let RightSallys = document.createElement('div')
    RightSallys.className = "sallyColumn flex-container"

    routesHTML.appendChild(leftSallys)
    routesHTML.appendChild(RightSallys)


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
    });

    return routesHTML
}

window.onload = () => {
    browser.storage.local.get('carts').then((res) => {
        let cartData = res.carts
        sortedStageTimes = Object.keys(cartData).sort((x, y) => {
            let xTime = parseInt(x.split(':'))
            let yTime = parseInt(y.split(':'))

            // hours
            if (xTime[0] < yTime[0])
            {
                return -1
            }

            if (xTime[0] > yTime[0])
            {
                return 1
            }

            // mintues
            if (xTime[0] === yTime[0])
            {
                if (xTime[1] < yTime[1])
                {
                    return -1
                }
    
                if (xTime[1] > yTime[1])
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
            tabBtn.id = `${ wave }`
            tabBtn.innerHTML = 'Wave ' + `${i + 1}`
            tabBtn.onclick = selectWave

            tabList.appendChild(tabBtn)
        })

        let waveBody = document.getElementById("waveData")
        waveBody.appendChild(generateBody(cartData["07:20"]))
    })

    browser.storage.local.get('SO_UI').then(res => {
        console.log(res.SO_UI)
    })
}