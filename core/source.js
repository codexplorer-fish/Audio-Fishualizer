/*

Done!:
ITS LIVE!

New:
hide dynamic sliders after 2s too (use same functions) < reverted. now only hides if ui container is not hovered
increase max potency of spin scale, for when db range creates generally low values <- ez, just watch out for backwards compatability: just decrease min db lol
about me and bmac page <- pages open on click, pages close on clicking out, scrollable
switch to <select>
popup/alert for saving and replacing too. say: ctrl-z to undo
exporting presets page, preset version attached! this will be complicated
- scrollable focus div, text inputs: copy save, load save, copy preset, load preset. Use same functions already used.
- change format, v1 as last value. append to copy inputs, and splice out and read when loading. then modify save as necessary.
fix denied permissions handling, possibly even unsupported error handling - user input, user permission denial, application permission denial
crop focus divs and remove audio controls margins
scroll when overflow - resize main sidebar, then scroll; snap to floor sidebar (bottom = 0), then scroll
- if overflow, snap or resize
- if still overflow, scroll.
change window source btn
esc bind for focusdivs
<mobile mode, settings focusdiv with radio, save to local, auto detect if not in local - not used, just fixed window not detecting slider interaction on mobile
<in mobile mode, only hide/show document if document is clicked on its own
prevent click-through to ui when ui is hidden
hyperlike buttons for alerts
Error handling on file select cancel
auto delay adjust setting
pipeline has sidebar. for canvas, specifies things like blur.
completely different pipeline style for images
merge analyse animate with pipeline function, sort into folders and dynamically load them.
refactor so that localsave presets already include version and name
each pipeline style has a sidebar attached
keyboard enter adds preset
add back presets and saves

proper typing check?

saving and dynamic-text as classes
zen mode: sliders labels only show name until interacted with (dynamic-text becomes class, register zen slider-labels and adjust global update accordingly)
saving: update latency time function (fix time offset), sliderRequests: stereo, left, right

fractals (pipeline style)
pipeline for analysing (20-20k, log style)

gradient color style
particle animation style

db adjust helper - overrides db sliders, helps you find the best range... remove db sliders for redundancy?
+ preset hint for preferred db range: any, or full (for full: top is highest, bottom is minimum)

tooltip as a hyperlinked alert div

playlist system for files

abstract pipeline handler (draw context?)

add/remove from background, basically lets you stack styles
+ opacity setting, blend setting
- same as presets slider, but all are applied at the same time.
- background image, video?, or color.
- outline for styles? OR JUST MAKE SLIGHTLY BIGGER OUTLINE
... then BACKGROUND PRESET SAVE/LOAD :,)
- different sources per layer possible
- non-mono source !! :O
- source: screen except selected tab, run a subtract function?
    - try -1 audio gain node & channel merger
- audio param functions, linearRampToValueAtTime, etc. to fix 'clicks' when instantly set

maybe:
"click anywhere to start"
label tags for accessibility purposes
save last unset preset for refresh
keyboard mode - a way to open the sidebars
rgb lights support?
violation animation time warning? (or just an fps option in settings)
cap spin speed to avoid epileptic displays


DONE!

... unlikely:
drop audio files?
playlist feature?
fade in/out ui: issues implementing, seems like a low priority issue
prevent screen sleep checkbox <- ez if know how: only relavent for mic & no feedback audio, other souces already suppress sleep because audio will be playing on the system anyway.
info popup per preset <- something in dynamic text, somewhat complicated... use <title>: if important enough, should convey in label.
*/


function initSource(sourceSelect, muteButton, audioElement, audioFileInput, sourceDelaySlider, reshareMediaButton){
    function useMuteValue(){ // reads mute value and updates based on it
        if (muteButton.value == 'true' && muteButton.textContent == "Mute"){ // check textContent to know if already muted or not. attempting to disconnect analyser when already disconnected will generate error
            muteButton.textContent = "Muted"
            delayNode.disconnect(audioCtx.destination)
            analyser.disconnect(delayNode)
        } else if (muteButton.value == 'false' && muteButton.textContent == "Muted") {
            muteButton.textContent = "Mute"
            delayNode.connect(audioCtx.destination)
            analyser.connect(delayNode)
        }
    }

    function changeDelay(ms){
        const delay = ms/1000
        delayNode.delayTime.value = delay
    }

    async function useSourceSelectValue(){
        async function recStreamSetup() {
            const constraints = { audio: {
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: true,
                deviceId: {exact: 'default'}
            } }
            try {
                await navigator.mediaDevices.getUserMedia(constraints).then((_stream) => { 
                    audioRecSource = audioCtx.createMediaStreamSource(_stream)
                    stream = _stream
                })
            } catch (e) {
                if (e.name == "NotAllowedError"){
                    return "NotAllowedError"
                } else {
                    throw e
                }
            }
        }

        async function shareStreamSetup() {
            const constraints = {
                audio: {
                    autoGainControl: false,
                    echoCancellation: false,
                    noiseSuppression: true,
                }
            }
            try {
                await navigator.mediaDevices.getDisplayMedia(constraints).then((_stream) => { 
                    audioShareSource = audioCtx.createMediaStreamSource(_stream)
                    stream = _stream
                })
            } catch (e) {
                if (e.name == "NotAllowedError"){
                    return "NotAllowedError"
                } else if (e.name == "InvalidStateError"){
                    return "InvalidStateError"
                } else {
                    throw e
                }
            }
        }

        function fileSourceSetup(){
            audioFileSource.connect(analyser)
            analyserSource = audioFileSource
            audioElement.style.display = "block"
            sourceDelayContainer.style.display = 'inline'
            audioFileInput.style.display = "inline"
            reshareMediaButton.style.display = 'none'
            muteButton.value = 'false'
            if (sourceDelaySlider.value < 0){
                changeDelay(0)
                sourceDelaySlider.value = 0
                updateDynamicText()
            } else {
                changeDelay(sourceDelaySlider.value)
            }
            
        }

        function micSourceSetup(){
            audioRecSource.connect(analyser)
            analyserSource = audioRecSource
            audioElement.style.display = "none"
            sourceDelayContainer.style.display = 'none'
            audioFileInput.style.display = "none"
            reshareMediaButton.style.display = 'none'
            muteButton.value = 'true'
            changeDelay(0)
        }

        function shareSourceSetup(){
            audioShareSource.connect(analyser)
            analyserSource = audioShareSource
            audioElement.style.display = "none"
            sourceDelayContainer.style.display = 'none'
            audioFileInput.style.display = "none"
            reshareMediaButton.style.display = 'inline'
            muteButton.value = 'true'
            changeDelay(0)
        }

        function disconnectSource(){
            // disconnect all tracks to end any existing streams 
            if (stream !== null) {
                stream.getTracks().forEach(function(track) {
                    track.stop();
                });
            }

            // disconnect current analyser source if it exists. it won't exist on the first run
            if (analyserSource !== null) {
                analyserSource.disconnect(analyser)
            }
        }

        async function reconnectSource(){
            // connect new analyser source
            if (sourceSelect.value == 0){ // FILE
                fileSourceSetup()
            } else if (sourceSelect.value == 1){ // MIC
                const error = await recStreamSetup()
                if (error == "NotAllowedError"){
                    customAlert("Error: Microphone permission denied")
                    fileSourceSetup() // set up as file source instead
                    sourceSelect.value = 0
                } else {
                    micSourceSetup()
                }
            } else if (sourceSelect.value == 2){ // WINDOW
                const error = await shareStreamSetup()
                if (error == "NotAllowedError"){
                    customAlert("Error: Screen share permission denied")
                    fileSourceSetup() // set up as file source instead
                    sourceSelect.value = 0
                } else if (error == "InvalidStateError") {
                    customAlert("Error: Audio not enabled in share")
                    fileSourceSetup() // set up as file source instead
                    sourceSelect.value = 0
                } else {
                    shareSourceSetup()
                }
            } else {
                throw new Error('invalid sourceSelect value: ' + sourceSelect.value)
            }
        }
        // don't listen to sourceSelect while processing the source change
        sourceSelect.removeEventListener('change', useSourceSelectValue)

        disconnectSource()
        await reconnectSource()

        useMuteValue()

        updateDynamicText()
        sourceSelect.addEventListener('change', useSourceSelectValue)
    }

    sourceSelect.addEventListener('change', useSourceSelectValue)

    function loadAudioFileInput(){
        // "this" refers to audioFileInput in this function
        const audioFiles = this.files
        if (audioFiles.length != 0) {
            audioElement.src = URL.createObjectURL(audioFiles[0])
            audioElement.load() // updates the element
            audioElement.play()
        }
    }
    audioFileInput.addEventListener('change', loadAudioFileInput)

    function flipMuteValue(){
        if (muteButton.value == 'true'){
            muteButton.value = 'false'
        } else {
            muteButton.value = 'true'
        }
        useMuteValue()
    }
    muteButton.addEventListener('click', flipMuteValue)

    function sourceDelayDefault() {
        if (sourceDelaySlider.value != -1) { // will be handled by 'change' event listener instead
            changeDelay(sourceDelaySlider.value)
        }
    }
    sourceDelaySlider.addEventListener('input', sourceDelayDefault)

    function sourceDelayAuto() {
        if (sourceDelaySlider.value == -1){
            if (animateDelay <= sourceDelaySlider.max) {    
                sourceDelaySlider.value = Math.round(animateDelay)
            } else {
                sourceDelaySlider.value = sourceDelaySlider.max
                customAlert("Alert: Detected delay:" + animateDelay + "ms Is greater than max delay: " + sourceDelaySlider.max + "ms")
            }
            changeDelay(sourceDelaySlider.value)
            updateDynamicText()
        }
    }
    sourceDelaySlider.addEventListener('change', sourceDelayAuto)

    reshareMediaButton.addEventListener('click', useSourceSelectValue) // useSourceSelectValue should only be visible when media is the source
    // END OF AUDIO SOURCE HANDLERS

    // audio context
    const audioCtx = new AudioContext()

    let stream = null
    let audioRecSource = null
    let audioShareSource = null
    const audioFileSource = audioCtx.createMediaElementSource(audioElement)
    let analyserSource = null
    let delayNode = audioCtx.createDelay(1)

    const analyser = audioCtx.createAnalyser()

    // set up initial source for analyser
    useSourceSelectValue()

    // default source for file, preloaded sample mp3. RESTRICTED CROSS ORIGIN, MUST HOST ON SERVER TO WORK
    audioElement.src = "lazy-day-stylish-futuristic-chill-by-penguinmusic-pixabay.mp3"
    audioElement.load()

    analyser.connect(delayNode)
    delayNode.connect(audioCtx.destination)

    return [analyser, audioCtx]
}
