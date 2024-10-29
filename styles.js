function getSliderRequestsReader() {
    function readSliderRequests(requests, htmlContainer) {
        // save slider values in <allLastSettingsPreset>
        function saveSliderValues() {
            const slidersArr = Array.from(htmlContainer.children)
            for (const i in slidersArr) {
                slider = slidersArr[i]
                if (slider.id) {
                    allLastSettingsPreset[String(slider.id)] = slider.value
                }
            }
        }
        saveSliderValues()

        deleteDynamicSliderTextListeners()
        let slidersArr = [] 
        // can't just loop through dynamicAnimationSliders to remove sliders, must access parent and call removeChild
        while (htmlContainer.firstChild) {
            htmlContainer.removeChild(htmlContainer.lastChild);
        }
        if (requests) {
            const requestsArray = requests.split(";")
            for (let i = 0; i < requestsArray.length; i++) {
                flags = requestsArray[i].split(".")
                const slider = document.createElement("input")
                slider.type = "range"
                slider.class = "dynamicSlider sidebarSliderLabel"
                slider.id = flags[0]
                slider.setAttribute("data-dynamicTextLabel", flags[1])
                slider.min = flags[2]
                slider.max = flags[3]
                if (flags.length >= 6) { // add dynamic text flags if available
                    slider.setAttribute("data-dynamicTextFlags", flags[5])
                }
            
                // try to match slider id with one from allLastSettingsPreset. If found, use the preset for slider value. Otherwise, use default value, flags[4]
                if (allLastSettingsPreset[String(slider.id)]){
                    slider.value = allLastSettingsPreset[String(slider.id)]
                } else {
                    slider.value = flags[4]
                }

                const label = document.createTextNode(slider.id)

                htmlContainer.appendChild(label)
                htmlContainer.appendChild(slider)
                htmlContainer.appendChild(document.createElement("br"))
                htmlContainer.appendChild(document.createElement("br"))
                slidersArr.push([slider, label])
            }
        }
        setupDynamicSliderText(slidersArr)
        return slidersArr
    }
    return readSliderRequests
}

function readAnimationSliderRequests(requests) {
    dynamicAnimationSliders = getSliderRequestsReader()(requests, dynamicAnimationSlidersContainer)
    animationResetStyle = true
}
function readColorSliderRequests(requests) {
    dynamicColorSliders = getSliderRequestsReader()(requests, dynamicColorSlidersContainer)
    colorResetStyle = true
}
function readAnalyserSliderRequests(requests) {
    dynamicAnalyserSliders = getSliderRequestsReader()(requests, dynamicAnalyserSlidersContainer)
}

animationStyleSlider.addEventListener('input', () => {
    readAnimationSliderRequests(getAnimationStyles()[animationStyleSlider.value][2])
})

colorStyleSlider.addEventListener('input', () => {
    readColorSliderRequests(getColorStyles()[colorStyleSlider.value][2])
})

analyserStyleSlider.addEventListener('input', () => {
    readAnalyserSliderRequests(getAnalyserStyles()[analyserStyleSlider.value][2])
})

function getAnimationStyles() {

    /*
    FORMAT:
    name,
    draw function,
    requested sliders = "customValsPropertyName.Display Name For User.min.max.default.(optional flags: 'value=customlabel,value=customlabel,...')"
    */


    let animationStyles = new Array
    animationStyles[0] = ['Lines', 
        (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            yOrigin = customVals.yOrigin

            if (firstCallInFrame) {
                frameObject.y = 0
            }

            const divviedHeight = canvas.height/numDatas // canvas height divvied among each data points
            const barHeight = divviedHeight*dataValue
            const x = 0
            let y = -1*(frameObject.y - canvas.height) - (((canvas.height/numDatas) + barHeight)/2)

            // adjust by y origin
            if (yOrigin == 3) {
                y += (divviedHeight - barHeight)*2 // = x1 of bar height
            } else if (yOrigin == 2) {
                y += (divviedHeight - barHeight) // = x0.5 of bar height
            } else if (yOrigin == 1) {
                y += (divviedHeight - barHeight)/2 // = x0 of bar height (bottom of divvied height range)
            } else if (yOrigin == 0) {
                // pass
            } else if (yOrigin == -3) {
                y -= (divviedHeight - barHeight)*2
            } else if (yOrigin == -2) {
                y -= (divviedHeight - barHeight)
            } else if (yOrigin == -1) {
                y -= (divviedHeight - barHeight)/2
            }
            
            
            

            canvasContext.fillRect(x, y, canvas.width, barHeight)
            frameObject.y += (canvas.height/numDatas)
            return [permObject, frameObject]
        }, "yOrigin.Y Origin.-3.3.0"]

    animationStyles[1] = ['Bars', 
        (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            if (firstCallInFrame) {
                frameObject.x = 0
            }

            const barWidth = canvas.width/numDatas
            const barHeight = canvas.height*(dataValue)
            const x = frameObject.x
            const y = canvas.height - barHeight
            canvasContext.fillRect(x, y, barWidth, barHeight)
            frameObject.x += barWidth
            return [permObject, frameObject]
        }, ""]

    animationStyles[2] = ['Circle', 
        (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            if (firstCallEver){
                permObject.rotation = 0
                permObject.timestamp = timestamp
                permObject.prevTimestamp = timestamp
            }
            if (firstCallInFrame) {
                frameObject.totalDataValues = 0

                permObject.prevTimestamp = permObject.timestamp
                permObject.timestamp = timestamp
            }

            const barWidth = 0.3 * canvas.width/numDatas * (Math.pow(customVals.lineWidth/100, 4))
            // use the lower of width or height to calculate bar height
            let barHeight
            if (canvas.height < canvas.width){
                barHeight = canvas.height * dataValue * 0.5 * 0.8
            } else {
                barHeight = canvas.width * dataValue * 0.5 * 0.8
            }
            frameObject.totalDataValues += dataValue

            const x = (canvas.width * 0.5) 
            const y = (canvas.height * 0.5) 

            canvasContext.save()
            canvasContext.translate(x, y)
            canvasContext.rotate(dataNum * Math.PI * 2 / numDatas)
            canvasContext.rotate(permObject.rotation * Math.PI * 2)
            canvasContext.fillRect(-1 * barWidth / 2, 5, barWidth, barHeight)
            canvasContext.restore()

            if (lastCallInFrame) {
                const spinScaleSpeed = customVals.spinScaleSpeed
                const spinBaseSpeed = customVals.spinBaseSpeed

                frameDelay = permObject.timestamp - permObject.prevTimestamp

                // if slider value is negative, spin backwards
                let rotationBase
                if (spinBaseSpeed > 0) {
                    rotationBase = Math.pow(spinBaseSpeed, 2) * 360/10000
                } else {
                    rotationBase = -1 * Math.pow(spinBaseSpeed, 2) * 360/10000
                }

                // snap to 0 if slider value is 0
                if (spinBaseSpeed == 0){
                    permObject.rotation = 0
                } else {
                    permObject.rotation += frameDelay * rotationBase * Math.pow(10, -4 - spinScaleSpeed*2) * Math.pow((frameObject.totalDataValues*255/numDatas), spinScaleSpeed)
                }
            }
            return [permObject, frameObject]
        }, 
        "lineWidth.Line Width.1.200.100;spinBaseSpeed.Spin Base Speed.-15.15.2;spinScaleSpeed.Spin Jumpiness.0.15.6"]


    return animationStyles
}


function getColorStyles() {

    /*
    FORMAT:
    name,
    draw function,
    requested sliders = "customValsPropertyName,Display Name For User,min,max,default"
    */


    let colorStyles = new Array
    colorStyles[0] = ['Manual Color Shift', 
        (canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            const lightness = customVals.colorLightness
            const colorRange = (Math.pow(customVals.colorRange/5, 2)/25) // square function to smooth out the slider input's potency
            const colorShift = customVals.colorShift
            const fade = customVals.colorFade
            const dimSettings = customVals.colorDimSettings


            const percentVolume = dataValue // 0 to 1
            const percentBars = dataNum/numDatas

            let hue = 0 // 0 -> 360
            let sat = 100 // 0 -> 100
            let lit = 50 // 0 -> 100
            
            if (dimSettings == 1) {
                // change lit with a square function
                lit = Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
            } else if (dimSettings == 2) {
                lit = lightness - Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
            } else {
                lit = lightness
            }
            

            sat = 100 - fade

            // distribute hue across each bar, multiplied by a compressing factor, that being colorRange
            hue = Math.abs((360 * percentBars * colorRange))
            if (customVals.colorRange < 0) {
                hue *= -1
            }
            // color shift hue
            hue += Number(colorShift)

            canvasContext.fillStyle = 'hsl(' + hue + ',' + sat + '%,' + lit + '%)'
            return [permObject, frameObject]
        }, "colorLightness.Lightness.0.100.70;colorDimSettings.Dim Settings.0.2.1.0=No Dim,1=Dim Low,2=Dim High;colorFade.Fade.0.100.0;colorRange.Color Range.-50.50.-25;colorShift.Color Shift.0.360.0"]

    colorStyles[1] = ['Auto Color Shift', 
        (canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            if (firstCallEver){
                permObject.colorShift = 0
                permObject.timestamp = timestamp
                permObject.prevTimestamp = timestamp
            }
            if (firstCallInFrame) {
                frameObject.totalDataValues = 0

                permObject.prevTimestamp = permObject.timestamp
                permObject.timestamp = timestamp
            }

            const lightness = customVals.colorLightness
            const colorRange = (Math.pow(customVals.colorRange/5, 2)/25) // square function to smooth out the slider input's potency
            const fade = customVals.colorFade
            const dimSettings = customVals.colorDimSettings


            const percentVolume = dataValue // 0 to 1
            const percentBars = dataNum/numDatas

            let hue = 0 // 0 -> 360
            let sat = 100 // 0 -> 100
            let lit = 50 // 0 -> 100
            
            if (dimSettings == 1) {
                // change lit with a square function
                lit = Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
            } else if (dimSettings == 2) {
                lit = lightness - Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
            } else {
                lit = lightness
            }

            sat = 100 - fade

            // distribute hue across each bar, multiplied by a compressing factor, that being colorRange
            hue = Math.abs((360 * percentBars * colorRange))
            if (customVals.colorRange < 0) {
                hue *= -1
            }

            hue += Number(permObject.colorShift)

            frameObject.totalDataValues += dataValue

            if (lastCallInFrame) {
                // change bar x offset variable by average volume of bars, arbitrary rotationScale and arbitrary rotationBase
                // one full cycle per 1 barOffset is the standard scale for use
                frameDelay = permObject.timestamp - permObject.prevTimestamp

                const colorScaleSpeed = Number(customVals.colorScaleSpeed)
                const colorBaseSpeed = Number(customVals.colorBaseSpeed)

                // if slider value is negative, color shift backwards
                let colorBase
                if (colorBaseSpeed > 0) {
                    colorBase = Math.pow(colorBaseSpeed, 4) * 360/1000
                } else {
                    colorBase = -1 * Math.pow(colorBaseSpeed, 4) * 360/1000
                }
                // snap to 0 if slider value is 0
                if (colorBaseSpeed == 0){
                    permObject.colorShift = 0
                } else {
                    permObject.colorShift += frameDelay * colorBase * Math.pow(10, -4 - colorScaleSpeed*2) * Math.pow((frameObject.totalDataValues*255/numDatas), colorScaleSpeed)
                }
            }
            canvasContext.fillStyle = 'hsl(' + hue + ',' + sat + '%,' + lit + '%)'
            return [permObject, frameObject]
        }, "colorLightness.Lightness.0.100.70;colorDimSettings.Dim Settings.0.2.1.0=No Dim,1=Dim Low,2=Dim High;colorFade.Fade.0.100.0;colorRange.Color Range.-50.50.-25;colorBaseSpeed.Auto Shift Speed.-15.15.4;colorScaleSpeed.Auto Shift Jumpiness.0.15.6"]


    return colorStyles
}


function getAnalyserStyles() {

    /*
    FORMAT:
    name,
    draw function,
    requested sliders = "customValsPropertyName,Display Name For User,min,max,default"
    */


    let analyserStyles = new Array
    analyserStyles[0] = ['Compressing', 
        (dataArray, sampleRate, customVals) => { // transform fft byte frequency data so that high frequencies are compressed.
            const minHz = Math.pow(2, customVals.minHz)
            const maxHz = customVals.maxHz * 5000
            const rawFactor = customVals.compressFactor
            let adjustedFactor
            if (rawFactor == -1) { // set factor to 0 if slider is at -1
                adjustedFactor = 0
            } else { // adjust raw factor data by a power for exponential results
                adjustedFactor = Math.pow(2, rawFactor) / 10
            }
            
            
            let newArray = []

            // start at the index equivilant to minHz
            let dataIndex = Math.round(dataArray.length * (minHz/(sampleRate/2))) // something something sampling rate needs to be halfed to properly correlate with hertz values

            arrayloop:
            while (dataIndex < dataArray.length) {
                // calculate number of indexes to compress into one index
                let compressNum = Math.pow(1 + (adjustedFactor/10), newArray.length)

                compressNum = Math.ceil(compressNum) // compressNum should never be 0 or less, or an infinite loop can happen

                // get x number of indexes, find highest, and append
                let hiValue = 0
                while (compressNum > 0) {
                    if (dataArray[dataIndex] > hiValue) {
                        hiValue = dataArray[dataIndex]
                    }
                    dataIndex++
                    compressNum--

                    if (dataIndex >= dataArray.length){ // escape if all array indexes are exhausted while still in loop
                        break arrayloop
                    }
                    if (dataIndex/dataArray.length >= maxHz/(sampleRate/2)){ // escape if array index reaches equivilant max hz
                        break arrayloop
                    }
                }
                
                newArray.push(hiValue)
            }

            // add the rest of the dataArray Indexes, compressed into a single data point
            let hiValue = 0
            while (dataIndex < dataArray.length) { // escape when all array indexes are exhausted
                if (dataArray[dataIndex] > hiValue) {
                    hiValue = dataArray[dataIndex]
                }
                dataIndex++
            }
            newArray.push(hiValue)

            return Uint8Array.from(newArray)
        }, "minHz.Min Hz.0.8.5.1=2,2=4,3=8,4=16,5=32,6=64,7=128,8=256" +
        ";maxHz.Max Hz.1.4.1.1=5k,2=10k,3=15k,4=20k" + 
        ";compressFactor.Low Hz Focus.-1.10.3"]


    return analyserStyles
}


function getStyles(){
    return getAnimationStyles()
}