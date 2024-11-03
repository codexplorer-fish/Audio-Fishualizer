function initSidebarTimedVisibilityHandler(){
    let hideTimeout
    function hideScreen() {
        if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
            uiContainer.style.visibility = "hidden"
            /* hides any active sidebars along with uiContainer. if sidebar is being hovered over, why hide it?
            animationSidebar.style.visibility = "hidden"
            colorSidebar.style.visibility = "hidden"
            analyserSidebar.style.visibility = "hidden"
            */
        }
    }
    document.addEventListener("mousemove", () => {
        uiContainer.style.visibility = "visible"
        clearTimeout(hideTimeout)
        if (uiContainer.matches(":hover")) {
            // Mouse is inside element
        } else {
            // set up timout if outside of uiContainer
            hideTimeout = setTimeout(hideScreen, 2000)
        }
    })
}
initSidebarTimedVisibilityHandler()

function initWindowHandler(){
    document.addEventListener("mouseleave", () => {
        if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
            uiContainer.style.visibility = "hidden"
        }
    })
    document.addEventListener("mouseenter", () => {
        
        uiContainer.style.visibility = "visible"
    })
}
initWindowHandler()

function initAnimationSidebarHandler(){
    animationSidebarImg.addEventListener("mouseleave", () => {
        if (!animationSidebar.matches(':hover')){
            animationSidebar.style.visibility = "hidden"
        }
    })
     animationSidebar.addEventListener('mouseleave', () => {
        animationSidebar.style.visibility = "hidden"
    })

     animationSidebarImg.addEventListener("mouseenter", () => {
        animationSidebar.style.visibility = "visible"
    })
}
initAnimationSidebarHandler()

function initColorSidebarHandler(){
    colorSidebarImg.addEventListener("mouseleave", () => {
        if (!colorSidebar.matches(':hover')){
            colorSidebar.style.visibility = "hidden"
        }
    })
    colorSidebar.addEventListener('mouseleave', () => {
        colorSidebar.style.visibility = "hidden"
    })

    colorSidebarImg.addEventListener("mouseenter", () => {
        colorSidebar.style.visibility = "visible"
    })
}
initColorSidebarHandler()

function initAnalyserSidebarHandler(){
    analyserSidebarImg.addEventListener("mouseleave", () => {
        if (!analyserSidebar.matches(':hover')){
            analyserSidebar.style.visibility = "hidden"
        }
    })
    analyserSidebar.addEventListener('mouseleave', () => {
        analyserSidebar.style.visibility = "hidden"
    })

    analyserSidebarImg.addEventListener("mouseenter", () => {
        analyserSidebar.style.visibility = "visible"
    })
}
initAnalyserSidebarHandler()

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
