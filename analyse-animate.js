/*

Done!:
ITS LIVE!


fix denied permissions handling, possibly even unsupported error handling

fade in/out ui
about me and bmac page
"are you sure you want to delete?" page
prevent screen sleep checkbox

info popup per preset

exporting presets page, preset version attached! this will be complicated
increase max potency of spin scale, for when db range creates generally low values
way more sliders per style
style for analysing (20-20k, log style)


DONE!

... unlikely:
drop audio files?
playlist feature?

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
        if (muteButton.value == 'true' && muteButton.textContent == "Mute"){ // check innertext to know if already muted or not. attempting to disconnect analyser when already disconnected will generate error
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

    async function useSourceSliderValue(){
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

        // don't listen to sourceSlider while processing the source change
        sourceSlider.removeEventListener('change', useSourceSliderValue)
        const previousSourceSliderValue = sourceSlider.value

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
        if (sourceSlider.value == 0){ // FILE
            audioFileSource.connect(analyser)
            analyserSource = audioFileSource
            audioElement.style.display = "block"
            audioFileInput.style.display = "inline"
            muteButton.value = 'false'
        } else if (sourceSlider.value == 1){ // MIC
            await setupRecStream()
            audioRecSource.connect(analyser)
            analyserSource = audioRecSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            muteButton.value = 'true'
        } else if (sourceSlider.value == 2){ // WINDOW
            await setupShareStream()
            audioShareSource.connect(analyser)
            analyserSource = audioShareSource
            audioElement.style.display = "none"
            audioFileInput.style.display = "none"
            muteButton.value = 'true'
        } else {
            throw new Error('invalid sourceSlider value: ' + sourceSlider.value)
        }
        useMuteValue()

        sourceSlider.value = previousSourceSliderValue
        updateDynamicText()
        sourceSlider.addEventListener('change', useSourceSliderValue)
    }

    sourceSlider.addEventListener('change', useSourceSliderValue)

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
    useSourceSliderValue()

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
