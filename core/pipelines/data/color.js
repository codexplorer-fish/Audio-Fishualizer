function dataPipeline_getColorStyles() {
    let colorStyles = new Object
    colorStyles['name'] = "Color"
    colorStyles['referenceOrder'] = [
        'data_color_manualColorShift',
        'data_color_autoColorShift',
    ]
    colorStyles['data_color_manualColorShift'] = {
        name: 'Static', 
        function: (canvasContext, data, storage, calls, timestamp, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls

            const lightness = customVals.colorLightness
            const colorRange = (Math.pow(customVals.colorRange/5, 2)/25) // square function to smooth out the slider input's potency
            const colorShift = customVals.colorShift
            const fade = customVals.colorFade
            const dimSettings = customVals.colorDim


            const percentVolume = dataValue // 0 to 1
            const percentBars = dataNum/numDatas

            let hue = 0 // 0 -> 360
            let sat = 100 // 0 -> 100
            let lit = 50 // 0 -> 100
            
            if (dimSettings == 1) {
                // change lit with a square function
                // lit = Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
                lit = lightness * percentVolume
            } else if (dimSettings == 2) {
                // lit = lightness - Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
                lit = lightness - lightness * percentVolume
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
        },
        sliderRequests: [
            {id: "colorLightness", name: "Lightness", min: 0, max: 100, default: 70},
            {id: "colorDim", name: "Dim", min: 0, max: 2, default: 1, labels: {0:"None",1:"Low",2:"High"}},
            {id: "colorFade", name: "Fade", min: 0, max: 100, default: 0},
            {id: "colorRange", name: "Range", min: -50, max: 50, default: -25},
            {id: "colorShift", name: "Shift", min: 0, max: 360, default: 0}
        ]
    }

    colorStyles['data_color_autoColorShift'] = {
        name: 'Shifting', 
        function: (canvasContext, data, storage, calls, timestamp, customVals) => {
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
            const dimSettings = customVals.colorDim


            const percentVolume = dataValue // 0 to 1
            const percentBars = dataNum/numDatas

            let hue = 0 // 0 -> 360
            let sat = 100 // 0 -> 100
            let lit = 50 // 0 -> 100
            
            if (dimSettings == 1) {
                // change lit with a square function
                // lit = Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
                lit = lightness * percentVolume
            } else if (dimSettings == 2) {
                // lit = lightness - Math.pow(Math.sqrt(100 * (lightness/100)) * percentVolume, 2)
                lit = lightness - lightness * percentVolume
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
        },
        sliderRequests: [
            {id: "colorLightness", name: "Lightness", min: 0, max: 100, default: 70},
            {id: "colorDim", name: "Dim", min: 0, max: 2, default: 1, labels: {0: "None", 1: "Low", 2: "High"}},
            {id: "colorFade", name: "Fade", min: 0, max: 100, default: 0},
            {id: "colorRange", name: "Range", min: -50, max: 50, default: -25},
            {id: "colorBaseSpeed", name: "Shift Speed", min: -15, max: 15, default: 4},
            {id: "colorScaleSpeed", name: "Shift Jumpiness", min: 0, max: 15, default: 6},
        ]
    }

    return colorStyles
}