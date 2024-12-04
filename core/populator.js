class Populator{
    constructor(){
        this.lastSetPairs = {}

        // container added to document to store dynamic collapsing containers for stages
        this.stageCollapsingContainers = document.createElement("div")
        document.body.appendChild(this.stageCollapsingContainers)
    }
    clearContainer(htmlContainer) {
        // can't just loop through dynamicAnimationSliders to remove sliders, must access parent and call removeChild
        while (htmlContainer.firstChild) {
            htmlContainer.removeChild(htmlContainer.lastChild);
        }
    }
    getDynamicTextContainerSliders(container) {
            let slidersArr = []
            Array.from(container.querySelectorAll("div.dynamicTextContainer.sidebarSliderLabel")).forEach((dynamicTextContainer) => {
                const slider = dynamicTextContainer.querySelector("input")
                slidersArr.push(slider)
            })
            return slidersArr
        }
    updateLastSetPairs(dynamicTextContainer){
        const slidersArr = this.getDynamicTextContainerSliders(dynamicTextContainer)
        slidersArr.forEach((slider) => {
            this.lastSetPairs[slider.id] = slider.value
        })
    }
    matchWithLastSetPairs(id, fallback){
        if (this.lastSetPairs[id]){
            return this.lastSetPairs[id]
        } else {
            return fallback
        }
    }
    createSlider(flags) {
        const slider = document.createElement("input")
        slider.type = "range"
        slider.class = "dynamicSlider sidebarSliderLabel"
        slider.id = flags.id
        slider.setAttribute("data-dynamicTextLabel", flags.name)
        slider.min = flags.min
        slider.max = flags.max
        if (flags.labels !== undefined) { // add dynamic text flags if available
            slider.setAttribute("data-dynamicTextFlags", JSON.stringify(flags.labels))
        }
        return slider
    }
    

    populateCollapingContainer(requests, slidersContainer, styleValuesTree = undefined) {
        // save slider values in <lastSetPairs> before clearing out
        this.updateLastSetPairs(slidersContainer)

        let slidersArr = [] 
        this.clearContainer(slidersContainer)

        if (requests) {
            requests.forEach((flags) => {
                function pickStyleValue(self, styleValuesTree, styleId, defaultValue){
                    if (styleValuesTree === undefined){
                        return self.matchWithLastSetPairs(styleId, defaultValue)
                    } else {
                        return styleValuesTree[styleId].value
                    }
                }

                const slider = this.createSlider(flags)
                slider.classList.add("slider")
                slider.value = pickStyleValue(this, styleValuesTree, flags.id, flags.default)
                
                const label = document.createElement("div")
                label.classList.add("dynamicText")

                slider.addEventListener("input", () => {setText(slider, label)})

                const sliderAndLabel = document.createElement("div")
                sliderAndLabel.classList.add("dynamicTextContainer","sidebarSliderLabel")
                sliderAndLabel.appendChild(label)
                sliderAndLabel.appendChild(slider)
                slidersContainer.appendChild(sliderAndLabel)

                setText(slider, label)

                slidersArr.push(slider)
            })
        }
        return slidersArr
    }

    autoPopulateCollapsing(slider, possibleRequests, slidersContainer){
        slider.addEventListener('input', () => {
            const requests = possibleRequests[slider.value]
            this.populateCollapingContainer(requests, slidersContainer)
        })
    }

    // populates stages
    populateStagesContainer(stages, stagesContainer, sidebarPositioning, stageValuesTree = undefined){
        this.updateLastSetPairs(stagesContainer)
        this.clearContainer(stagesContainer)

        this.clearContainer(this.stageCollapsingContainers)

        let accessTree = {}
        let stageSidebarImagePairs = []

        Object.keys(stages).forEach((stageId) => {
            function calcParentSliderFlags(sliderName, sliderId, allStyles, selectedStyleIndex){
                const labels = {}
                allStyles.forEach((style, index) => {
                    labels[index] = style.name
                })
                return {
                    id: sliderId,
                    name: sliderName,
                    min: 0,
                    max: allStyles.length - 1,
                    default: selectedStyleIndex,
                    labels: labels,
                }
            }
            function calcPossibleRequests(possibleStylesArr){
                let allPossibleRequests = []
                possibleStylesArr.forEach((possibleStyle) => {
                    allPossibleRequests.push(possibleStyle.sliderRequests)
                })
                return allPossibleRequests
            }
            function linkCollapsingSidebar(sidebar, imgArea, imgDisplay){
                let fadeTimeout
                let hideTimeout

                function show(){
                    clearTimeout(fadeTimeout)
                    clearTimeout(hideTimeout)

                    sidebar.style.opacity = "80%"
                    sidebar.style.visibility = "visible"
                }

                function startHidingProcess(){
                    clearTimeout(fadeTimeout)
                    clearTimeout(hideTimeout)
                    
                    if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
                        fadeTimeout = setTimeout(() => {
                            sidebar.style.opacity = "60%"
                        }, 0);
                        hideTimeout = setTimeout(() => {
                            sidebar.style.visibility = "hidden"
                        }, 500);
                    }
                }
                
                function instantHide(){
                    clearTimeout(fadeTimeout)
                    clearTimeout(hideTimeout)
                    sidebar.style.visibility = "hidden"
                }


                function hoveringExtension(){
                    const hovered = document.querySelector('.sidebarImgHoverExtension:hover')
                    if (hovered === null) {
                        return false
                    } else {
                        function ownTheSidebar(){ // now that hovered is the element keeping the sidebar alive, it must handle sidebar closing.
                            if (!sidebar.matches(':hover') && !imgArea.matches(':hover')){
                                instantHide()
                                hovered.removeEventListener("mouseleave", ownTheSidebar)
                            }
                        }
                        hovered.addEventListener("mouseleave", ownTheSidebar)

                        return true
                    }
                }
                
                imgArea.addEventListener("mouseleave", () => {
                    if (!sidebar.matches(':hover') && !hoveringExtension()){ 
                        instantHide()
                    }
                })
                sidebar.addEventListener('mouseleave', () => {
                    if (!imgArea.matches(':hover') && !hoveringExtension()){
                        startHidingProcess()
                    }
                })
                sidebar.addEventListener('mouseenter', show)

                imgDisplay.addEventListener("mouseenter", show)
            }
            function sortStageStyles(stage) {
                const orderedIdArr = stage.referenceOrder
                let sortedArr = []
                orderedIdArr.forEach((styleId) => {
                    sortedArr.push(stage[styleId])
                })
                return sortedArr
            }
            function pickStyleIndex(self, stageValuesTree, stageId){
                if (stageValuesTree === undefined){
                    return self.matchWithLastSetPairs(stageId, 0)
                } else {
                    return stageValuesTree[stageId].value
                }
            }


            const stage = stages[stageId]
            const possibleStylesArr = sortStageStyles(stage)
            const selectedStyleIndex = pickStyleIndex(this, stageValuesTree, stageId)
            const selectedStyle = possibleStylesArr[selectedStyleIndex]
            accessTree[stageId] = {}

            const img = document.createElement("div")
            img.classList.add("sidebarImg")
            const imgDisplay = document.createElement("div")
            imgDisplay.classList.add("sidebarImgDisplay")
            const imgHoverExtension = document.createElement("div")
            imgHoverExtension.classList.add("sidebarImgHoverExtension")
            img.appendChild(imgDisplay)
            img.appendChild(imgHoverExtension)

            const collapsingSidebar = document.createElement("div")
            collapsingSidebar.classList.add("sidebar", "collapsingSidebar", "hidingVis")
            linkCollapsingSidebar(collapsingSidebar, img, imgDisplay)
            stageSidebarImagePairs.push({sidebar: collapsingSidebar, image: img})
            accessTree[stageId].slidersContainer = collapsingSidebar

            const sliderAndLabel = document.createElement("div")
            sliderAndLabel.classList.add("dynamicTextContainer", "sidebarSliderLabel")
            const dynamicText = document.createElement("div")
            dynamicText.classList.add("dynamicText")
            const slider = this.createSlider(calcParentSliderFlags(stage.name, stageId, possibleStylesArr, selectedStyleIndex))
            slider.classList.add("slider")
            slider.value = selectedStyleIndex
            accessTree[stageId].slider = slider
            slider.addEventListener("input", () => {
                setText(slider, dynamicText)
                setTimeout(() => { // to fix run order. for some reason, checkCollapsing() will trigger before setText().
                    sidebarPositioning.checkCollapsing()
                }, 0);
            })
            sliderAndLabel.appendChild(dynamicText)
            sliderAndLabel.appendChild(slider)

            if (stageValuesTree == undefined){
                this.autoPopulateCollapsing(slider, calcPossibleRequests(possibleStylesArr), collapsingSidebar)
                this.populateCollapingContainer(selectedStyle.sliderRequests, collapsingSidebar)
            } else {
                this.autoPopulateCollapsing(slider, calcPossibleRequests(possibleStylesArr), collapsingSidebar)
                const styleValuesTree = stageValuesTree[stageId].branches
                this.populateCollapingContainer(selectedStyle.sliderRequests, collapsingSidebar, styleValuesTree)
            }
    
            stagesContainer.appendChild(img)
            stagesContainer.appendChild(sliderAndLabel)
            this.stageCollapsingContainers.appendChild(collapsingSidebar)
        })
        return [accessTree, stageSidebarImagePairs]
    }
}
