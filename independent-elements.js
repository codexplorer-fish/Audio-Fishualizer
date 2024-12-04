function initSidebarTimedVisibilityHandler(){
    /*
    click-through: When a button becomes visible off of a touch event, and the button happens to be right under the touch event,
    the user will end up unintentionally clicking a button they didn't see before the click.
    */

    let fadeTimeout
    let hideTimeout

    function show(){
        clearTimeout(fadeTimeout)
        clearTimeout(hideTimeout)

        uiContainer.style.opacity = "80%"
        uiContainer.style.visibility = "visible"
    }

    function startHidingProcess(){
        show()
        
        if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
            fadeTimeout = setTimeout(() => {
                uiContainer.style.opacity = "60%"
            }, 0);
            hideTimeout = setTimeout(() => {
                uiContainer.style.visibility = "hidden"
            }, 500);
        }
    }
    
    let hidingProcessTimeout

    // upon any of these events, show and (maybe) reset the timeout.
    document.addEventListener("mouseleave", () => {
        clearTimeout(hidingProcessTimeout)
        startHidingProcess()
    })
    document.addEventListener("mouseenter", () => {
        clearTimeout(hidingProcessTimeout)
        show()
    })

    document.addEventListener('touchstart', (event) => {
        clearTimeout(hidingProcessTimeout)

        const children = Array.from(uiContainer.children)
        for (i in children){
            if (children[i].matches(":hover")){
                // uiContainer is visible and hovered
                break
            } else if (i == children.length - 1){
            // uiContainer was either hidden before this event, or is not hovered.
            hidingProcessTimeout = setTimeout(startHidingProcess, 2000)

            /*
            Prevent this click from triggering any other event if document was hidden prior. This prevents click-through, 
            where if a button appears under the click location when the uiContainer appears, it gets clicked
            */
            if (uiContainer.style.visibility == 'hidden'){
                show()
                event.stopPropagation()
                event.preventDefault()
            }
            }
        }

    }, {capture: true, passive: false}) // for mobile. stops click event if uiContainer is hidden to prevent click-through

    document.addEventListener('mousemove', () => {
        clearTimeout(hidingProcessTimeout)

        const children = Array.from(uiContainer.children)
        for (i in children){
            if (children[i].matches(":hover")){
                // uiContainer is visible and hovered
                break
            } else if (i == children.length - 1){
                // uiContainer was either hidden before this event, or is not hovered.
                show()
                hidingProcessTimeout = setTimeout(startHidingProcess, 2000)
            }
        }
    })


    // TODO this is broken

    // interacting with sliders does not trigger mousemove on mobile
    // just listen to all sliders in the mainSidebar:
    document.getElementById('presetSlider').addEventListener('input', sliderInteraction)
    
    Array.from(document.getElementsByClassName('styleSlider')).forEach((slider) => {
        slider.addEventListener('input', sliderInteraction)
    });

    function sliderInteraction() {
        uiContainer.style.visibility = "visible"
        clearTimeout(hidingProcessTimeout)
        // must be inside uiContainer because a uiContainer slider triggered this function. therefore, don't reset timeout
    }
}
initSidebarTimedVisibilityHandler()

function initCollapsingSidebarHandlers(){
    collapsingSidebars = Array.from(document.getElementsByClassName('collapsingSidebar'))
    collapsingSidebars.forEach((sidebar) => {
        const myImgAreaId = sidebar.id + 'ImgArea'
        const imgArea = document.getElementById(myImgAreaId)
        const imgDisplay = imgArea.querySelector(":scope > .sidebarImgDisplay")

        let fadeTimeout
        let hideTimeout

        sidebar.style.opacity = "100%" // as a child of uiContainer, start with 100% to have uiContainer's 80% opacity

        function show(){
            clearTimeout(fadeTimeout)
            clearTimeout(hideTimeout)

            sidebar.style.opacity = "100%"
            sidebar.style.visibility = "visible"
        }

        function startHidingProcess(){
            clearTimeout(fadeTimeout)
            clearTimeout(hideTimeout)
            
            if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
                fadeTimeout = setTimeout(() => {
                    sidebar.style.opacity = "80%"
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
    })
}
initCollapsingSidebarHandlers()


function initAboutMeHandler(){
    aboutMeButton.addEventListener('click', () => {
        focusAboutMe.style.visibility = "visible"
    })

    focusAboutMeCloser.addEventListener('click', () => {
        focusAboutMe.style.visibility = "hidden"
    })

    document.addEventListener('keydown', (event) => {
        if (event.code == 'Escape') {
            focusAboutMe.style.visibility = "hidden"
        }
    })
}
initAboutMeHandler()

function initPopupHandler(){
    let pipWindow = null

    function handlePipClose() {
        pipWindow.removeEventListener("pagehide", handlePipClose)
        pipWindow.removeEventListener("resize", handlePipResize)
        pipWindow = null

        documentPictureInPicture.window.close()

        document.body.append(canvas)
        canvasEscapeContainer.style.display = 'none'
        document.body.append(canvasEscapeContainer)

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    }

    function handlePipResize() {
        canvas.width = pipWindow.innerWidth
        canvas.height = pipWindow.innerHeight
    }

    popupButton.addEventListener('click', async () => {
        if (pipWindow) { // if already picture-in-picture
            handlePipClose()
        } else {
            try {
                pipWindow = await documentPictureInPicture.requestWindow({
                    disallowReturnToOpener: true,
                    perferInitialWindowPlacement: true,
                })

                // else, if documentPictureInPicture doesn't throw:
                pipWindow.name = "pipWindow"

                pipWindow.addEventListener("pagehide", handlePipClose)
                pipWindow.addEventListener("resize", handlePipResize)        

                canvasEscapeContainer.append(canvas)
                pipWindow.document.body.append(canvasEscapeContainer)

                canvasEscapeContainer.style.display = "inline"
            } catch (e) {
                if (e.name == "NotAllowedError") {
                    customAlert("Error: picture-in-picture permissions denied")
                } else {
                    throw e
                }
            }
        }
    })
}
initPopupHandler()

function initWindowResizeHandler() {
    window.addEventListener('resize', () => {
        const canvasWin = canvas.ownerDocument.defaultView
        if (canvasWin.name != "pipWindow") { // only resize if canvas is not in the pip window
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
    })
}
initWindowResizeHandler()
