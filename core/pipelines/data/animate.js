function dataPipeline_getAnimationStyles() {
    let animationStyles = new Object
    animationStyles['name'] = "Animation"
    animationStyles['referenceOrder'] = [
        'data_animate_lines',
        'data_animate_bars',
        'data_animate_circle'
    ]
    animationStyles['data_animate_lines'] = {
        name: 'Lines', 
        function: (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
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
        },
        sliderRequests: [{id: "yOrigin", name: "Y Origin", min: -3, max: 3, default: 0}]
    }

    animationStyles['data_animate_bars'] = {
        name: 'Bars', 
        function: (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
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
        },
        sliderRequests: []
    }

    animationStyles['data_animate_circle'] = {
        name: 'Circle', 
        function: (canvas, canvasContext, data, storage, calls, timestamp, customVals) => {
            function sideLengthFromRegularPolygonInradius(inradius, sides){
                function toDegrees (angle) {
                    return angle * (180 / Math.PI);
                }
                function toRadians (angle) {
                    return angle * (Math.PI / 180);
                }
                function degSin(degree){
                    return toDegrees(Math.sin(toRadians(degree)))
                }
                function degCos(degree){
                    return toDegrees(Math.cos(toRadians(degree)))
                }
                const radius = inradius/degCos(180/sides)
                const sideLength =  radius * 2 * degSin(180/sides)
                return sideLength
            }
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

            let barHeight
            let innerRadius
            if (canvas.height < canvas.width){
                barHeight = canvas.height * dataValue * 0.5 * (customVals.lineHeight/100)
                innerRadius = canvas.height * (customVals.innerRadius/100)               
            } else {
                barHeight = canvas.width * dataValue * 0.5 * (customVals.lineHeight/100)
                innerRadius = canvas.width * (customVals.innerRadius/100)  
            }
            frameObject.totalDataValues += dataValue

            let x = (canvas.width * 0.5) 
            let y = (canvas.height * 0.5)

            canvasContext.save()
            canvasContext.translate(x, y)
            canvasContext.rotate(dataNum * Math.PI * 2 / numDatas)
            canvasContext.rotate(permObject.rotation * Math.PI * 2)
            if (customVals.lineFlip == 1){
                canvasContext.translate(0, 0 - (innerRadius*2))
            }

            if (customVals.lineShape == 0){
                const barWidth = sideLengthFromRegularPolygonInradius(innerRadius, numDatas) * Math.pow(customVals.lineWidth/100, 4)
                canvasContext.fillRect(-1 * barWidth / 2, innerRadius, barWidth, barHeight)
            } else if (customVals.lineShape == 1){
                canvasContext.beginPath()
                canvasContext.moveTo(0, innerRadius)
                const inradius = barHeight + innerRadius
                const sideLength = sideLengthFromRegularPolygonInradius(inradius, numDatas)
                const wedgeWidth = (sideLength/2)*customVals.lineWidth/100
                canvasContext.lineTo(0 - wedgeWidth, inradius)
                canvasContext.lineTo(wedgeWidth, inradius)
                canvasContext.closePath()
                canvasContext.fill()
            } else if (customVals.lineShape == 2){
                canvasContext.beginPath()
                canvasContext.moveTo(0, barHeight + innerRadius)
                const inradius = innerRadius
                const sideLength = sideLengthFromRegularPolygonInradius(inradius, numDatas)
                const wedgeWidth = (sideLength/2)*customVals.lineWidth/100
                canvasContext.lineTo(0 - wedgeWidth, innerRadius)
                canvasContext.lineTo(wedgeWidth, innerRadius)
                canvasContext.closePath()
                canvasContext.fill()
            }

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
        sliderRequests: [
            {id: "lineShape", name: "Shape", min: 0, max: 2, default: 0, labels: {0: "Rect",1: "Wedge",2: "Spike"}},
            {id: "lineFlip", name: "Flip?", min: 0, max: 1, default: 0, labels: {0:"No",1:"Yes"}},
            {id: "lineWidth", name: "Width", min: 1, max: 200, default: 100},
            {id: "lineHeight", name: "Height", min: 0, max: 250, default: 80},
            {id: "innerRadius", name: "Radius", min: 0, max: 130, default: 10},
            {id: "spinBaseSpeed", name: "Spin Base Speed", min: -15, max: 15, default: 2},
            {id: "spinScaleSpeed", name: "Spin Jumpiness", min: 0, max: 15, default: 6},
        ]
    }

    return animationStyles
}