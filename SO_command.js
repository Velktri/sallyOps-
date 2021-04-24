let activeWaveTab = 1

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

function buildRouteContainer(data, key)
{
    let outerShell = document.createElement('div')
    outerShell.className = 'outerShell'

    let title = document.createElement('div')
    title.className = 'routeTitle'

    let contents = document.createElement('div')
    contents.className = 'routeContents'

    outerShell.appendChild(title)
    outerShell.appendChild(contents)

    if (key !== undefined || data !== undefined)
    {
        title.innerHTML = key + ' ' + data[key].loc
        contents.appendChild(list(data[key].carts))
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
    Object.keys(routeData).forEach(key => {
        let sallyIndex = parseInt(routeData[key].loc.split('.')[1].slice(1))
        if (sortedRoutes[sallyIndex - 1] === undefined)
        {
            sortedRoutes[sallyIndex - 1] = key
        }
        else
        {
            duplicateSallyPorts.push(key)
        }
    });


    let routesHTML = document.createElement('div')
    routesHTML.className = "flex-container"
    let leftSallys = document.createElement('div')
    leftSallys.className = "sallyColumn flex-container"
    let RightSallys = document.createElement('div')
    RightSallys.className = "sallyColumn flex-container"

    routesHTML.appendChild(leftSallys)
    routesHTML.appendChild(RightSallys)


    sortedRoutes.forEach((routeKey, index) => {
        if (index < 10)
        {
            if (routeKey !== undefined)
            {
                leftSallys.appendChild(buildRouteContainer(routeData, routeKey))
            }
            else
            {
                leftSallys.appendChild(buildRouteContainer())
            }
        }
        else 
        {
            if (routeKey !== undefined)
            {
                RightSallys.appendChild(buildRouteContainer(routeData, routeKey))
            }
            else
            {
                RightSallys.appendChild(buildRouteContainer())
            }
        }
    });

    return routesHTML
}

document.getElementById('1').onclick = selectWave
document.getElementById('2').onclick = selectWave
document.getElementById('3').onclick = selectWave
document.getElementById('4').onclick = selectWave
document.getElementById('5').onclick = selectWave
document.getElementById('6').onclick = selectWave
document.getElementById('7').onclick = selectWave
document.getElementById('8').onclick = selectWave
document.getElementById('9').onclick = selectWave

window.onload = () => {
    browser.storage.local.get('carts').then((res) => {
        let waveBody = document.getElementById("waveData")
        waveBody.appendChild(generateBody(res.carts))
    })

    browser.storage.local.get('SO_UI').then(res => {
        console.log(res.SO_UI)
    })
}