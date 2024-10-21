
function initWindowHandler(){
    document.addEventListener("mouseleave", () => {
        if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
            uiContainer.style.visibility = "hidden"
        }
    })
    document.addEventListener("mouseenter", () => {
        
        uiContainer.style.visibility = "visible"
    })

    let hideTimeout
    function hideScreen() {
        if (!presetNameInput.matches(':focus')){ // only hide if text input is not selected (don't want to hide the ui while user is typing)
            uiContainer.style.visibility = "hidden"
        }
    }
    document.addEventListener("mousemove", () => {
        uiContainer.style.visibility = "visible"
        clearTimeout(hideTimeout)
        hideTimeout = setTimeout(hideScreen, 2000);
    })
}
initWindowHandler()

function initAnimationSidebarHandler(){
    animationSidebarImg.addEventListener("mouseleave", () => {
        animationSidebar.style.visibility = "hidden"
     })
     animationSidebarImg.addEventListener("mouseenter", () => {
        animationSidebar.style.visibility = "visible"
     })
}
initAnimationSidebarHandler()

function initColorSidebarHandler(){
    colorSidebarImg.addEventListener("mouseleave", () => {
        colorSidebar.style.visibility = "hidden"
    })
    colorSidebarImg.addEventListener("mouseenter", () => {
        colorSidebar.style.visibility = "visible"
    })
}
initColorSidebarHandler()

function initAnalyserSidebarHandler(){
    analyserSidebarImg.addEventListener("mouseleave", () => {
        analyserSidebar.style.visibility = "hidden"
    })
    analyserSidebarImg.addEventListener("mouseenter", () => {
        analyserSidebar.style.visibility = "visible"
    })
}
initAnalyserSidebarHandler()

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
            pipWindow = await documentPictureInPicture.requestWindow({
                disallowReturnToOpener: true,
                perferInitialWindowPlacement: true,
            })
            pipWindow.name = "pipWindow"

            pipWindow.addEventListener("pagehide", handlePipClose)
            pipWindow.addEventListener("resize", handlePipResize)        

            canvasEscapeContainer.append(canvas)
            pipWindow.document.body.append(canvasEscapeContainer)

            canvasEscapeContainer.style.display = "inline"
        }
    })
}
initPopupHandler()

function initWindowResizeHandler() {
    window.addEventListener('resize', () => {
        canvasWin = canvas.ownerDocument.defaultView
        if (canvasWin.name != "pipWindow") { // only resize if canvas is not in the pip window
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
    })
}
initWindowResizeHandler()
