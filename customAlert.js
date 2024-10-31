
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

// alert with custom css. It dims (50% opacity) and then hides. However, timers pause if unfocused. 
async function customAlert(text){
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
