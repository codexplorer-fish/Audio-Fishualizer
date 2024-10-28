/*

Done!:
ITS LIVE!

New:
hide dynamic sliders after 2s too (use same functions) < reverted. now only hides if ui container is not hovered
increase max potency of spin scale, for when db range creates generally low values <- ez, just watch out for backwards compatability: just decrease min db lol
about me and bmac page <- pages open on click, pages close on clicking out, scrollable
switch to <select>
"are you sure you want to delete?" page, shift to bypass, with undo functionality


popup/alert for saving and replacing too. say: ctrl-z to undo

exporting presets page, preset version attached! this will be complicated
- scrollable focus div, text inputs: copy save, load save, copy preset, load preset. Use same functions already used.
- change format, v1 as last value. append to copy inputs, and splice out and read when loading. then modify save as necessary.


fix denied permissions handling, possibly even unsupported error handling

way more sliders per style
style for analysing (20-20k, log style)
circle cone, long triangles in a circle, no or constant gap throughout

add/remove from background, basically lets you stack styles
+ opacity setting, blend setting
- same as presets slider, but all are applied at the same time.
- background image, video?, or color.
- outline for styles? OR JUST MAKE SLIGHTLY BIGGER OUTLINE
... then BACKGROUND PRESET SAVE/LOAD :,)

maybe:
label tag for accessibility purposes
save last unset preset for refresh


DONE!

... unlikely:
drop audio files?
playlist feature?
fade in/out ui: issues implementing, seems like a low priority issue
prevent screen sleep checkbox <- ez if know how: only relavent for mic & no feedback audio, other souces already suppress sleep because audio will be playing on the system anyway.
info popup per preset <- something in dynamic text, somewhat complicated... use <title>: if important enough, should convey in label.

...
upload as extension?
upload as website? 
github pages?
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
        async function setupRecStream() {
            const constraints = { audio: {
                autoGainControl: false,
                echoCancellation: false,
                noiseSuppression: true,
                deviceId: {exact: 'default'}
            } };
            await navigator.mediaDevices.getUserMedia(constraints).then((_stream) => { 
                audioRecSource = audioCtx.createMediaStreamSource(_stream)
                stream = _stream
            })
        }

        async function setupShareStream() {
            const constraints = {
                audio: {
                    autoGainControl: false,
                    echoCancellation: false,
                    noiseSuppression: true,
                }
            };
            await navigator.mediaDevices.getDisplayMedia(constraints).then((_stream) => { 
                audioShareSource = audioCtx.createMediaStreamSource(_stream)
                stream = _stream
            })

        }

        // don't listen to sourceSelect while processing the source change
        sourceSelect.removeEventListener('change', useSourceSelectValue)
        const previousSourceValue = sourceSelect.value

        // disconnect all tracks to end any existing streams 
        if (stream !== null) {
            stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }

        // disconnect current analyser source if it exists
        if (analyserSource !== null) {
            analyserSource.disconnect(analyser)
        }

        // connect new analyser source
        if (sourceSelect.value == 0){ // FILE
            audioFileSource.connect(analyser)
            analyserSource = audioFileSource
            audioElement.style.display = "block"
            audioFileInput.style.display = "inline"
            muteButton.value = 'false'
        } else if (sourceSelect.value == 1){ // MIC
            await setupRecStream()
            audioRecSource.connect(analyser)
            analyserSource = audioRecSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            muteButton.value = 'true'
        } else if (sourceSelect.value == 2){ // WINDOW
            await setupShareStream()
            audioShareSource.connect(analyser)
            analyserSource = audioShareSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            muteButton.value = 'true'
        } else {
            throw new Error('invalid sourceSelect value: ' + sourceSelect.value)
        }
        useMuteValue()

        sourceSelect.value = previousSourceValue
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
