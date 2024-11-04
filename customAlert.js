
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
        alertPauseableTimeout.resume()
        alertPauseableTimeoutHalfTime.resume()
    }
    setTimeout(() => {
        delayedFocusState = true
    }, 500);
})

// alert with custom css. It dims (50% opacity) and then hides. However, timers pause if tab unfocuses.
async function customAlert(text, button=undefined){
    function getPauseableTimeout(callback, delay){
        function pause() {
            remaining -= Date.now() - lastStart
            clearTimeout(timeoutID)
        }
        function resume() {
            if (!timeoutCleared){
                lastStart = Date.now()
                timeoutID = setTimeout(callback, remaining)
            }
        }
        function clear () {
            timeoutCleared = true
            clearTimeout(timeoutID)
        }

        let remaining = delay
        let lastStart = Date.now()
        let timeoutID = setTimeout(callback, delay)
        let timeoutCleared = false
        return {
            pause,
            resume,
            clear
        }
    }
    
    function calcDuration() {
        if (button !== undefined) {
            return 5000
        } else {
            return 3000
        }
    }
    const duration = calcDuration()

    alertDiv.style.opacity = "80%"
    alertDiv.style.visibility = "visible"

    // set up text
    while (alertDiv.firstChild) {
        alertDiv.removeChild(alertDiv.lastChild);
    }
    alertDiv.textContent = text
    if (button !== undefined) {
        alertDiv.appendChild(button)
        button.style.visibility = 'inherit'
    }

    // reset timeouts
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
    
    function clickHide () {
        if (delayedFocusState == true){ // prevent clicking on the window to focus from hiding the alert
            if (button === undefined || !button.matches(':hover')){
                alertDiv.style.opacity = "0%"
                alertDiv.style.visibility = "hidden"
                document.removeEventListener('mousedown', clickHide)
            }
        }
    }
    

    alertPauseableTimeoutHalfTime = getPauseableTimeout(() => { // fade a bit at half time
        alertDiv.style.opacity = "50%"
    }, duration/2)

    alertPauseableTimeout = getPauseableTimeout(() => {
        alertDiv.style.opacity = "0%"
        alertDiv.style.visibility = "hidden"
        document.removeEventListener('mousedown', clickHide)
    }, duration)

    document.addEventListener('mousedown', clickHide)
}
