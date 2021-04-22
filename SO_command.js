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
        waveBody.innerHTML = res.carts
    })

    browser.storage.local.get('SO_UI').then(res => {
        console.log(res.SO_UI)
    })
}

window.onunload = () => {
    browser.storage.local.set({ SO_UI: browser.tabs.TAB_ID_NONE })
}