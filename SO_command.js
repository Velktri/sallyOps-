let activeWaveTab = 1

function list(elements, classInfo)
{
    let ul = document.createElement('ul');

    elements.forEach(ele => {
        let li = document.createElement('li')
        li.innerHTML = ele.cart
        li.className = classInfo
        ul.appendChild(li)
    })

    return ul
}

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

function generateBody(routeData)
{
    let routeKeys = Object.keys(routeData)
    routeKeys.sort((x, y) => {
        x = parseInt(routeData[x].loc.split('.')[1].slice(1))
        y = parseInt(routeData[y].loc.split('.')[1].slice(1))

        if (x > y) { return 1 }
        if (x < y) { return -1 }

        return 0
    })



    let routesHTML = document.createElement('div')
    routeKeys.forEach(routeKey => {
        let outerShell = document.createElement('div')
        outerShell.className = 'outerShell'

        let title = document.createElement('div')
        title.className = 'routeTitle'

        let contents = document.createElement('div')
        contents.className = 'routeContents'

        outerShell.appendChild(title)
        outerShell.appendChild(contents)

        title.innerHTML = routeKey + ' ' + routeData[routeKey].loc

        contents.appendChild(list(routeData[routeKey].carts))

        routesHTML.appendChild(outerShell)
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

window.onunload = () => {
    browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
}