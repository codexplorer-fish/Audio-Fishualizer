
let alertPauseableTimeout = null
let alertPauseableTimeoutHalfTime = null
let delayedFocusState = true // tracks focus state, delayed by a little bit

window.addEventListener('blur', () => {
    if (alertPauseableTimeout !== null){
        alertPauseableTimeout.pause()
        alertPauseableTimeoutHalfTime.pause()
    }
    setTimeout(() => {
        delayedFocusState = false
    }, 500);
})

window.addEventListener('focus', () => {
    if (alertPauseableTimeout !== null){
        alertPauseableTimeout.continue()
        alertPauseableTimeoutHalfTime.continue()
    }
    setTimeout(() => {
        delayedFocusState = true
    }, 500);
})

// alert with custom css. It dims (50% opacity) and then hides. However, timers pause if unfocused. 
async function customAlert(text){
    const date = new Date
    function getPauseableTimeout(callback, delay){
        let remaining = delay
        let lastStart = date.getDate()
        let timeoutID = setTimeout(callback, delay)
        let timeoutCleared = false
        return {
            pause: () => {
                remaining -= date.getDate() - lastStart
                clearTimeout(timeoutID)
            },
            continue: () => {
                if (!timeoutCleared){
                    lastStart = date.getDate()
                    timeoutID = setTimeout(callback, delay)
                }
            },
            clear: () => {
                timeoutCleared = true
                clearTimeout(timeoutID)
            }
        }
    }
    

    alertDiv.textContent = text
    alertDiv.style.opacity = "80%"
    alertDiv.style.visibility = "visible"
    if (alertPauseableTimeout !== null){
        alertPauseableTimeout.clear()
        alertPauseableTimeoutHalfTime.clear()
    }

    /* REFRESHING ANIMATION DOES NOT SEEM TO WORK. DECIDED TO NOT USE CSS ANIMATION
    // from stackoverflow:
    alertDiv.classList.remove('fade-out'); // reset animation
    void alertDiv.offsetWidth; // trigger reflow
    alertDiv.classList.add('fade-out'); // start animation
    */
    
    function hide () {
        alertDiv.style.opacity = "0%"
        alertDiv.style.visibility = "hidden"
        document.removeEventListener('mousedown', clickHide)
    }
    function clickHide () {
        if (delayedFocusState == true){
            alertDiv.style.opacity = "0%"
            alertDiv.style.visibility = "hidden"
            document.removeEventListener('mousedown', clickHide)
        }
    }
    
    const duration = 3000

    alertPauseableTimeoutHalfTime = getPauseableTimeout(() => { // fade a bit at half time
        alertDiv.style.opacity = "50%"
    }, duration/2)

    alertPauseableTimeout = getPauseableTimeout(hide, duration)

    document.addEventListener('mousedown', clickHide)
}
