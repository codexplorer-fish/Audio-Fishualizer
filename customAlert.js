
let alertTimeout = null
let alertTimeoutHalfTime = null
async function customAlert(text){
    alertDiv.textContent = text
    alertDiv.style.opacity = "80%"
    alertDiv.style.visibility = "visible"
    clearTimeout(alertTimeout)
    clearTimeout(alertTimeoutHalfTime)

    /* REFRESHING ANIMATION DOES NOT SEEM TO WORK. DECIDED TO NOT USE CSS ANIMATION
    // from stackoverflow:
    alertDiv.classList.remove('fade-out'); // reset animation
    void alertDiv.offsetWidth; // trigger reflow
    alertDiv.classList.add('fade-out'); // start animation
    */
    
    function hide () {
        alertDiv.style.opacity = "0%"
        alertDiv.style.visibility = "hidden"
        removeEventListener('click', hide)
    }
    
    const duration = 3000

    alertTimeoutHalfTime = setTimeout(() => { // fade a bit at half time
        alertDiv.style.opacity = "50%"
    }, duration/2)

    alertTimeout = setTimeout(hide, duration);

    document.addEventListener('mousedown', hide)
}
