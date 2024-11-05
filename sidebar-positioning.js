function isClippingWindowY(element) {
    const rect = element.getBoundingClientRect()

    if (rect.top >= 0 && rect.bottom <= window.innerHeight){
        return false
    } else {
        return true
    }
}

function isClippingWindowX(element) {
    const rect = element.getBoundingClientRect()

    if (rect.left >= 0 && rect.right <= window.innerWidth){
        return false
    } else {
        return true
    }
}

function isRightClippingX(slider, x) {
    const rect = slider.getBoundingClientRect()

    if (rect.right <= x) {
        return false
    } else {
        return true
    }
}

function isOverflowingY ({ clientHeight, scrollHeight }) { // yoinked (and modified) from stackoverflow
    return scrollHeight > clientHeight
}

function checkMain(){
    const mainSidebar = document.getElementById("mainSidebar")

    mainSidebar.style.setProperty('top', '15%')
    mainSidebar.style.setProperty('bottom', '15%')
    mainSidebar.style.setProperty('overflow-y', 'visible')

    if (isOverflowingY(mainSidebar)) {
        // console.log(mainSidebar.clientWidth, mainSidebar.clientHeight, mainSidebar.scrollWidth, mainSidebar.scrollHeight)
        mainSidebar.style.setProperty('top', '0')
        mainSidebar.style.setProperty('bottom', '0')

        if (isOverflowingY(mainSidebar)) {
            mainSidebar.style.setProperty('overflow-y', 'scroll')
        }
    }
}

function checkCollapsing(){
    function calcBorderWidth(element){
        let width = getComputedStyle(element).getPropertyValue('border-width')
        width = width.slice(0, -2) // remove trailing "px"
        return width
    }

    function setCollapingDefaults(collapsingSidebars, mainSidebar) {
        collapsingSidebars.forEach(sidebar => {
            function calcMyImg(sidebar){
                if (sidebar.id == 'animationSidebar'){
                    return document.getElementById('animationSidebarImg')
                } else if (sidebar.id == 'colorSidebar'){
                    return document.getElementById('colorSidebarImg')
                } else if (sidebar.id == 'analyserSidebar'){
                    return document.getElementById('analyserSidebarImg')
                }
            }
            function calcPosition(sidebar, myImgRect){
                let top = myImgRect.top
                let left = myImgRect.left
                left -= sidebar.clientWidth
                left -= calcBorderWidth(mainSidebar)
                left -= calcBorderWidth(sidebar)
    
                return [top, left]
            }
    
            const myImg = calcMyImg(sidebar)
            const myImgRect = myImg.getBoundingClientRect()

            // set default properties before calculation
            sidebar.style.setProperty('overflow-y', 'visible') // removes y scroll bar
            sidebar.style.setProperty('overflow-x', 'visible') // removes x scroll bar
            sidebar.style.setProperty('bottom', 'auto') // lets the bottom auto expand with content
            sidebar.style.setProperty('width', 'auto') // lets the width auto expand with content

            const [top, left] = calcPosition(sidebar, myImgRect)

            sidebar.style.setProperty('top', top + 'px')
            sidebar.style.setProperty('left', left + 'px')
        });
    }

    const mainSidebar = document.getElementById("mainSidebar")
    const collapsingSidebars = Array.from(document.getElementsByClassName("collapsingSidebar"))

    setCollapingDefaults(collapsingSidebars, mainSidebar)



    collapsingSidebars.forEach((sidebar) => {
        // for some reason, checking and adjusting x clipping first will prevent word-wrapping from breaking the check.
        // the other way around, it seems like checking the x will adjust the height too, if the div is narrow enough to start word-wrapping
        // thus, y needs to be check after to account for how the word-wrapping changes the y after x is checked
        if (isClippingWindowX(sidebar)){
            let width = mainSidebar.getBoundingClientRect().left
            width -= calcBorderWidth(mainSidebar)
            width += calcBorderWidth(sidebar) * 2

            sidebar.style.setProperty('left', '0')
            sidebar.style.setProperty('width', width + 'px')

            sidebar.style.setProperty('overflow-x', 'scroll')
        }
        
        if (isClippingWindowY(sidebar)){
            sidebar.style.setProperty('top', 'auto')
            sidebar.style.setProperty('bottom', '0')

            if (isClippingWindowY(sidebar)){
                sidebar.style.setProperty('top', '0')
                sidebar.style.setProperty('overflow-y', 'scroll')
            }
        }
    })
}

function checkAll(){
    checkMain()
    checkCollapsing()
}

checkAll()

window.addEventListener('resize', checkAll)

document.getElementById("mainSidebar").addEventListener('scroll', checkCollapsing)

Array.from(document.getElementsByClassName('styleSlider')).forEach((slider) => {
    slider.addEventListener('input', checkCollapsing)
})
document.getElementById('presetSlider').addEventListener('input', checkCollapsing)