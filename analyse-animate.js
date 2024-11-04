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

way more sliders per style
style for analysing (20-20k, log style)
circle cone, long triangles in a circle, no or constant gap throughout
fractals?

completely different pipeline style for images

time offset function for files... playlist system too?

move local storage handlers to own file
add/remove from background, basically lets you stack styles
+ opacity setting, blend setting
- same as presets slider, but all are applied at the same time.
- background image, video?, or color.
- outline for styles? OR JUST MAKE SLIGHTLY BIGGER OUTLINE
... then BACKGROUND PRESET SAVE/LOAD :,)

refactor so that presets already include version and name

db adjust helper

maybe:
"click anywhere to start"
label tags for accessibility purposes
save last unset preset for refresh
keyboard mode - a way to open the sidebars
rgb lights support?


DONE!

... unlikely:
drop audio files?
playlist feature?
fade in/out ui: issues implementing, seems like a low priority issue
prevent screen sleep checkbox <- ez if know how: only relavent for mic & no feedback audio, other souces already suppress sleep because audio will be playing on the system anyway.
info popup per preset <- something in dynamic text, somewhat complicated... use <title>: if important enough, should convey in label.
*/


function initAnalyseAnimate(){

    // canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const canvasContext = canvas.getContext('2d')

    let animationPermObject = {}
    let colorPermObject = {}
    let animationStyle
    let colorStyle


    // audio context
    const audioCtx = new AudioContext()

    let stream = null
    let audioRecSource = null
    let audioShareSource = null
    const audioFileSource = audioCtx.createMediaElementSource(audioElement)
    let analyserSource = null

    const analyser = audioCtx.createAnalyser()

    // fft
    analyser.fftSize = Math.pow(2, analyserFftValueSlider.value)
    analyser.smoothingTimeConstant = 0.8
    let dataArray = new Uint8Array(analyser.frequencyBinCount)
    let previousDataArray = dataArray.slice()
    let previousStyledDataArray = [0]
    let previousAnimationTimestamp = 0

    // AUDIO SOURCE HANDLERS
    function useMuteValue(){ // reads mute value and updates based on it
        if (muteButton.value == 'true' && muteButton.textContent == "Mute"){ // check textContent to know if already muted or not. attempting to disconnect analyser when already disconnected will generate error
            muteButton.textContent = "Muted"
            analyser.disconnect(audioCtx.destination)
        } else if (muteButton.value == 'false' && muteButton.textContent == "Muted") {
            muteButton.textContent = "Mute"
            analyser.connect(audioCtx.destination)
        }
    }    

    muteButton.addEventListener('click', function(){
        if (muteButton.value == 'true'){
            muteButton.value = 'false'
        } else {
            muteButton.value = 'true'
        }
        useMuteValue()
    })

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
            audioFileInput.style.display = "inline"
            reshareMediaButton.style.display = 'none'
            muteButton.value = 'false'
        }

        function micSourceSetup(){
            audioRecSource.connect(analyser)
            analyserSource = audioRecSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            reshareMediaButton.style.display = 'none'
            muteButton.value = 'true'
        }

        function shareSourceSetup(){
            audioShareSource.connect(analyser)
            analyserSource = audioShareSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            reshareMediaButton.style.display = 'inline'
            muteButton.value = 'true'
        }

        function disconnectSource(){
            // don't listen to sourceSelect while processing the source change
            sourceSelect.removeEventListener('change', useSourceSelectValue)

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
        disconnectSource()
        await reconnectSource()

        useMuteValue()

        updateDynamicText()
        sourceSelect.addEventListener('change', useSourceSelectValue)
    }

    sourceSelect.addEventListener('change', useSourceSelectValue)

    audioFileInput.addEventListener('change', function(){
        // "this" refers to audioFileInput in this function
        const audioFile = this.files
        audioElement.src = URL.createObjectURL(audioFile[0])
        audioElement.load() // updates the element
        audioElement.play()
    })

    reshareMediaButton.addEventListener('click', useSourceSelectValue) // useSourceSelectValue should only be visible when media is the source
    // END OF AUDIO SOURCE HANDLERS


    analyserSmoothnessSlider.addEventListener('input', () => {
        analyser.smoothingTimeConstant = Math.pow(analyserSmoothnessSlider.value/100, 1/2)
    })

    analyserDbMinSlider.addEventListener('input', () => {
        const min = Number(analyserDbMinSlider.value)
        const max = analyser.maxDecibels
        if (min < max) {
            analyser.minDecibels = min
        } else {
            analyserDbMaxSlider.value = max + 2
            analyserDbMaxSlider.dispatchEvent(new Event('input'))

            analyser.maxDecibels = min + 2
            analyser.minDecibels = min
        }
    })

    analyserDbMaxSlider.addEventListener('input', () => {
        const min = analyser.minDecibels
        const max = Number(analyserDbMaxSlider.value)
        if (max > min) {
            analyser.maxDecibels = max
        } else {
            analyserDbMinSlider.value = max - 2
            analyserDbMinSlider.dispatchEvent(new Event('input'))

            analyser.minDecibels = max - 2
            analyser.maxDecibels = max
        }
    })


    // set up initial source for analyser
    useSourceSelectValue()

    // default source for file, preloaded sample mp3. RESTRICTED CROSS ORIGIN, MUST HOST ON SERVER TO WORK
    audioElement.src = "lazy-day-stylish-futuristic-chill-by-penguinmusic-pixabay.mp3"
    audioElement.load()
    
    
    analyser.connect(audioCtx.destination)

    // animating loop
    function animate(animationTimestamp){
        function unpackSliderArrValues(sliderArr){
            customVals = {}
            for (i=0; i < sliderArr.length; i++) {
                const slider = sliderArr[i][0]
                customVals[slider.id] = slider.value
            }
            return customVals
        }  

        // clear canvas
        canvasContext.clearRect(0, 0, canvas.width, canvas.height)

        // update fft size
        if (analyser.fftSize != Math.pow(2, analyserFftValueSlider.value)) {
            analyser.fftSize = Math.pow(2, analyserFftValueSlider.value)
            dataArray = new Uint8Array(analyser.frequencyBinCount)
        }

        // get data
        analyser.getByteFrequencyData(dataArray)
        // style data
        analyserCustomVals = unpackSliderArrValues(dynamicAnalyserSliders)
        const analyserParams = [
            dataArray,
            audioCtx.sampleRate,
            analyserCustomVals
        ]
        const styledDataArray = getAnalyserStyles()[analyserStyleSlider.value][1](...analyserParams)
        const styledBufferLength = styledDataArray.length

        
        let animationFrameObject = {}
        let colorFrameObject = {}
        let animationFirstCallInFrame = true
        let colorFirstCallInFrame = true
        let lastCallInFrame = false
        animationStyle = animationStyleSlider.value
        colorStyle = colorStyleSlider.value

        // package custom values for animation style
        let animationCustomVals = unpackSliderArrValues(dynamicAnimationSliders)
        let colorCustomVals = unpackSliderArrValues(dynamicColorSliders)
        

        for (let i = 0; i < styledBufferLength; i++){
            const fftValue = styledDataArray[i] // max fftValue = 255

            if (i + 1 == styledBufferLength) { lastCallInFrame = true }
            let alwaysNumTimestamp = animationTimestamp
            if (alwaysNumTimestamp == undefined) {
                alwaysNumTimestamp = 0
            }
            
            const colorParams = [
                canvasContext,
                [fftValue/255, i, styledBufferLength],
                [colorPermObject, colorFrameObject],
                [colorResetStyle, colorFirstCallInFrame, lastCallInFrame],
                alwaysNumTimestamp,
                colorCustomVals
            ]
            
            const colorStyleMemory = getColorStyles()[colorStyle][1](...colorParams)
            colorPermObject = colorStyleMemory[0]
            colorFrameObject = colorStyleMemory[1]
            colorResetStyle = false
            colorFirstCallInFrame = false


            const animationParams = [
                canvas,
                canvasContext,
                [fftValue/255, i, styledBufferLength],
                [animationPermObject, animationFrameObject],
                [animationResetStyle, animationFirstCallInFrame, lastCallInFrame],
                alwaysNumTimestamp,
                animationCustomVals
            ]
            const animationStyleMemory = getAnimationStyles()[animationStyle][1](...animationParams)
            animationPermObject = animationStyleMemory[0]
            animationFrameObject = animationStyleMemory[1]
            animationResetStyle = false
            animationFirstCallInFrame = false
        }

        // prev trackers
        previousAnimationTimestamp = animationTimestamp
        previousDataArray = dataArray.slice()
        previousStyledDataArray = styledDataArray.slice()

        requestAnimationFrame(animate)
    }
    animate()

}

function initOnce() {
    initAnalyseAnimate()
    window.removeEventListener('click', initOnce)
}
window.addEventListener('click', initOnce)
