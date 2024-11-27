class SidebarPositioning {
    constructor() {
        this.mainSidebar = document.getElementById('mainSidebar')
    
        this.sidebarsAndImages = [] // [{sidebar: <sidebar>, image: <image>}, {...}, ...]
        this.sidebarsAndImages.push({sidebar: document.getElementById("contextSidebar"), image: document.getElementById("contextSidebarImgArea")})
        
        this.checkAll()
        window.addEventListener('resize', () => {
            this.checkAll()
        })
        this.mainSidebar.addEventListener('scroll', () => {
            this.checkCollapsing()
        })
    }

    addPair(sidebar, image, mark = undefined) {
        if (mark !== undefined){
            this.sidebarsAndImages.push({sidebar: sidebar, image: image, mark: mark})
        } else {
            this.sidebarsAndImages.push({sidebar: sidebar, image: image})
        }
        sidebar.addEventListener("input", () => {
            this.checkCollapsing()
        })
    }

    addPairsArray(pairsArray, mark = undefined){
        pairsArray.forEach(pairsArray => {
            this.addPair(pairsArray.sidebar, pairsArray.image, mark)
        });
    }

    removePairsWithMark(mark){
        this.sidebarsAndImages = this.sidebarsAndImages.filter((pair) => pair.mark != mark)
    }
    
    checkMain(){
        const mainSidebar = this.mainSidebar
        
        function isOverflowingY ({ clientHeight, scrollHeight }) { // yoinked (and modified) from stackoverflow
            return scrollHeight > clientHeight
        }

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
    
    checkCollapsing(){
        const mainSidebar = this.mainSidebar
        const sidebarsAndImages = this.sidebarsAndImages

        sidebarsAndImages.forEach(sidebarAndImage => {
            function calcBorderWidth(element){
                let width = getComputedStyle(element).getPropertyValue('border-width')
                width = width.slice(0, -2) // remove trailing "px"
                return width
            }
            function isClippingWindowX(element) {
                const rect = element.getBoundingClientRect()
            
                if (rect.left >= 0 && rect.right <= window.innerWidth){
                    return false
                } else {
                    return true
                }
            }
            function isClippingWindowY(element) {
                const rect = element.getBoundingClientRect()
            
                if (rect.top >= 0 && rect.bottom <= window.innerHeight){
                    return false
                } else {
                    return true
                }
            }
            
            // SET TO DEFAULT
            const sidebar = sidebarAndImage.sidebar
            const myImg = sidebarAndImage.image
            const myImgRect = myImg.getBoundingClientRect()
    
            // set default properties before calculation
            sidebar.style.setProperty('overflow-y', 'visible') // removes y scroll bar
            sidebar.style.setProperty('overflow-x', 'visible') // removes x scroll bar
            sidebar.style.setProperty('bottom', 'auto') // lets the bottom auto expand with content
            sidebar.style.setProperty('width', 'auto') // lets the width auto expand with content
    
            const top = myImgRect.top
            const left =  ((myImgRect.left - sidebar.clientWidth) - calcBorderWidth(mainSidebar)) - calcBorderWidth(sidebar)
    
            sidebar.style.setProperty('top', top + 'px')
            sidebar.style.setProperty('left', left + 'px')
    
            // CHECK FOR COLLISION AND ADJUST
            // x check must happen first or else word wrap's effects will be ignored.
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
    
    checkAll(){
        this.checkMain()
        this.checkCollapsing()
    }
}

