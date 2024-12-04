function dataPipeline_getAnimationStyles() {
    let animationStyles = new Object
    animationStyles['name'] = "Animation"
    animationStyles['referenceOrder'] = [
        'data_animate_lines',
        'data_animate_bars',
        'data_animate_circle',
        'data_animate_particle'
    ]
    animationStyles['data_animate_lines'] = {
        name: 'Lines', 
        function: (canvas, canvasContext, data, storage, calls, frameDelay, customVals) => {
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
        function: (canvas, canvasContext, data, storage, calls, frameDelay, customVals) => {
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
        function: (canvas, canvasContext, data, storage, calls, frameDelay, customVals) => {
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
            }
            if (firstCallInFrame) {
                frameObject.totalOfDataValues = 0
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
            frameObject.totalOfDataValues += dataValue

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
                    permObject.rotation += frameDelay * rotationBase * Math.pow(10, -4 - spinScaleSpeed*2) * Math.pow((frameObject.totalOfDataValues*255/numDatas), spinScaleSpeed)
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

    animationStyles['data_animate_particle'] = {
        name:"Particles",
        function: (canvas, canvasContext, data, storage, calls, frameDelay, customVals) => {
            const [dataValue, dataNum, numDatas] = data
            const [permObject, frameObject] = storage
            const [firstCallEver, firstCallInFrame, lastCallInFrame] = calls
            
            if (firstCallEver){
                permObject.colorReferencedParticles = {numDatas: numDatas, indexes: {}} // indexes: {1: [particle1, particle2, ...], 2: [...], ...}
            }
            if (firstCallInFrame){
                frameObject.totalOfDataValues = 0
            }
            frameObject.totalOfDataValues += dataValue

            // reference em'
            if (permObject.colorReferencedParticles.numDatas != numDatas){
                const newIndexes = {}
                Object.keys(permObject.colorReferencedParticles.indexes).forEach((key) => {
                    const particles = permObject.colorReferencedParticles.indexes[key]
                    const oldNumDatas = permObject.colorReferencedParticles.numDatas
                    const rescale = numDatas/oldNumDatas
                    const newKey = Math.round(key * rescale)
                    newIndexes[newKey] = particles
                })
                permObject.colorReferencedParticles.indexes = newIndexes
                permObject.colorReferencedParticles.numDatas = numDatas
            }

            // spawn em'
            let spawnChance = (frameDelay/1000)/numDatas
            if (customVals.particleSpawnRate == 11){
                spawnChance *= dataValue * 100
            } else {
                spawnChance *= customVals.particleSpawnRate**2
            }

            if (Math.random() < spawnChance) {
                const particle = {
                    pos: [undefined, undefined],
                    radius: undefined,
                    vector: [undefined, undefined],
                }


                if (customVals.particleSizeDynamics == 0){
                    particle.radius = percentOfSizeRange(dataNum/numDatas)
                } else {
                    particle.radius = percentOfSizeRange(1 - (dataNum/numDatas))
                }


                const angle = Number(customVals.particleSpawnAngle)
                let slope
                let perpSlope
                if (angle + 90 == 90 || angle + 90 == 270){
                    perpSlope = "vertical"
                } else {
                    perpSlope = Math.tan(((angle + 90) % 360) * Math.PI / 180) 
                }
                if (angle == 90 || angle == 270){
                    slope = "vertical"
                } else {
                    slope = Math.tan(angle * Math.PI / 180)
                }

                let speed
                if (customVals.particleSpeedDynamics == 0){
                    speed = percentOfSpeedRange(dataNum/numDatas)
                } else {
                    speed = percentOfSpeedRange(1 - (dataNum/numDatas))
                }
                if (angle == 90){
                    particle.vector[0] = 0
                    particle.vector[1] = -speed
                } else if (angle == 270){
                    particle.vector[0] = 0
                    particle.vector[1] = speed
                } else {
                    const radians = angle * Math.PI / 180
                    particle.vector[0] = -Math.cos(radians) * speed
                    particle.vector[1] = -Math.sin(radians) * speed
                }
                
                const cornerLine = {s: perpSlope, xy: []}
                const lowerIntersecting = {s: slope, xy: []}
                const upperIntersecting = {s: slope, xy: []}

                const topLeft = [0, 0]
                const topRight = [window.innerWidth, 0]
                const bottomLeft = [0, window.innerHeight]
                const bottomRight = [window.innerWidth, window.innerHeight]
                if (angle < 90){
                    cornerLine.xy = bottomRight
                    lowerIntersecting.xy = bottomLeft
                    upperIntersecting.xy = topRight
                } else if (angle < 180){
                    cornerLine.xy = bottomLeft
                    lowerIntersecting.xy = topLeft
                    upperIntersecting.xy = bottomRight
                } else if (angle < 270){
                    cornerLine.xy = topLeft
                    lowerIntersecting.xy = bottomLeft
                    upperIntersecting.xy = topRight
                } else if (angle <= 360){
                    cornerLine.xy = topRight
                    lowerIntersecting.xy = topLeft
                    upperIntersecting.xy = bottomRight
                }

                
                // spawn
                let spawnLocationPercent
                if (customVals.particleSpawnLocation == 0){
                    spawnLocationPercent = Math.random()
                } else if (customVals.particleSpawnLocation == 1){
                    spawnLocationPercent = dataNum/numDatas
                } else if (customVals.particleSpawnLocation == 2){
                    spawnLocationPercent = 1 - (dataNum/numDatas)
                }

                let cornerLineSelectedX
                let cornerLineSelectedY
                if (cornerLine.s == "vertical"){
                    const yRange = window.innerHeight
                    cornerLineSelectedY = (spawnLocationPercent * yRange)
                    cornerLineSelectedX = yForX(cornerLine, cornerLineSelectedY)
                } else {
                    const lowerXLimit = intersectionOf(lowerIntersecting, cornerLine)
                    const upperXLimit = intersectionOf(upperIntersecting, cornerLine)
                    const xRange = upperXLimit - lowerXLimit
                    cornerLineSelectedX = (spawnLocationPercent * xRange) + lowerXLimit
                    cornerLineSelectedY = xForY(cornerLine, cornerLineSelectedX)
                    // xForY will not return undefined because cornerLine.s vertical is handled in the previous if statement
                }   
                const particleLine = {s: slope, xy: [cornerLineSelectedX, cornerLineSelectedY]}

                // path
                const rectLines = [{s: 0, xy: topLeft}, {s: "vertical", xy: bottomRight}, {s: 0, xy: bottomRight}, {s: "vertical", xy: topLeft}]
                let firstX
                let firstY
                for (i in rectLines){
                    const line = rectLines[i]
                    let intersectX
                    let intersectY
                    if (line.s == 0){
                        intersectY = line.xy[1]
                        intersectX = yForX(particleLine, intersectY)
                    } else if (line.s == "vertical"){
                        intersectX = line.xy[0]
                        intersectY = xForY(particleLine, intersectX)
                        if (intersectY == "undefined"){
                            continue
                        }
                    }

                    if (((intersectX == 0 || intersectX == window.innerWidth) && (intersectY >= 0 && intersectY <= window.innerHeight)) ||
                        ((intersectY == 0 || intersectY == window.innerHeight) && (intersectX >= 0 && intersectX <= window.innerWidth)))
                    {
                        if (cornerLine.xy[0] == intersectX || cornerLine.xy[1] == intersectY){ // intersecting one of the lines in the corner that cornerLine is pivoting off of?
                            firstX = intersectX
                            firstY = intersectY
                            break
                        }
                    }
                }

                /*
                const radians = angle * Math.PI / 180
                const distance = particle.radius
                firstX += Math.cos(radians) * distance
                lastX -= Math.cos(radians) * distance
                */
                particle.pos = [firstX, firstY]
            
                if (permObject.colorReferencedParticles.indexes[dataNum] === undefined){
                    permObject.colorReferencedParticles.indexes[dataNum] = [particle]
                } else {
                    permObject.colorReferencedParticles.indexes[dataNum].push(particle)
                }

                function intersectionOf(l1, l2){
                    if (l1.s == "vertical" && l2.s == "vertical"){
                        if (l1.xy[0] == l2.xy[0]){
                            return l1.xy[0]
                        } else {
                            console.error("Non-intersecting lines are not supposed to happen")
                        }
                    } else if (l1.s == "vertical"){
                        return l1.xy[0]
                    } else if (l2.s == "vertical"){
                        return l2.xy[0]
                    }
                    return ((l1.xy[0]*l1.s) - (l2.xy[0]*l2.s) - l1.xy[1] + l2.xy[1]) / (l1.s - l2.s) // hot from the algebra oven
                }
                function yForX(l, y){
                    if (l.s == "vertical"){
                        return l.xy[0]
                    }
                    return (y - l.xy[1])/l.s + l.xy[0]
                }
                function xForY(l, x){
                    if (l.s == "vertical"){
                        return "undefined"
                    }
                    if (l.s == 0){
                        return l.xy[1]
                    }
                    return l.s*(x - l.xy[0]) + l.xy[1]
                }

                function drawLine(line){
                    canvasContext.moveTo(-200, xForY(line, -200))
                    canvasContext.lineTo(1500, xForY(line, 1500))
                }
            }

            // draw em'  
            if (permObject.colorReferencedParticles.indexes[dataNum] !== undefined) {
                permObject.colorReferencedParticles.indexes[dataNum].forEach((particle) => {
                    if (customVals.particleSpeedDynamics == 2 || customVals.particleSpeedDynamics == 3){
                        let speed
                        if (customVals.particleSpeedDynamics == 2){
                            speed = percentOfSpeedRange(dataValue)
                        } else if (customVals.particleSpeedDynamics == 3){
                            speed = percentOfSpeedRange(1 - dataValue)
                        }
                        const angle = customVals.particleSpawnAngle
                        if (angle == 90){
                            particle.vector[0] = 0
                            particle.vector[1] = -speed
                        } else if (angle == 270){
                            particle.vector[0] = 0
                            particle.vector[1] = speed
                        } else {
                            const radians = angle * Math.PI / 180
                            particle.vector[0] = -Math.cos(radians) * speed
                            particle.vector[1] = -Math.sin(radians) * speed
                        }
                    }

                    if (customVals.particleSizeDynamics == 2){
                        particle.radius = percentOfSizeRange(dataValue)
                    }
                    if (customVals.particleSizeDynamics == 3){
                        particle.radius = percentOfSizeRange(1 - dataValue)
                    }

                    canvasContext.beginPath()
                    canvasContext.arc(particle.pos[0], particle.pos[1], particle.radius, 0, 2 * Math.PI)
                    canvasContext.fill()
                })
            }
            
            // update em'
            if (lastCallInFrame){
                Object.keys(permObject.colorReferencedParticles.indexes).forEach((key) => {                    
                    const particles = permObject.colorReferencedParticles.indexes[key]
                    particles.forEach((particle, index) => {
                        if (particle.vector[0] > 0 && particle.pos[0] > window.innerWidth){
                            permObject.colorReferencedParticles.indexes[key].splice(index, 1)
                            return
                        } else if (particle.vector[0] < 0 && particle.pos[0] < 0){
                            permObject.colorReferencedParticles.indexes[key].splice(index, 1)
                            return
                        }
                        if (particle.vector[1] > 0 && particle.pos[1] > window.innerHeight){
                            permObject.colorReferencedParticles.indexes[key].splice(index, 1)
                            return
                        } else if (particle.vector[1] < 0 && particle.pos[1] < 0){ 
                            permObject.colorReferencedParticles.indexes[key].splice(index, 1)
                            return
                        }

                        let adjustedVector = particle.vector

                        permObject.colorReferencedParticles.indexes[key][index].pos[0] += adjustedVector[0] * (frameDelay/10)
                        permObject.colorReferencedParticles.indexes[key][index].pos[1] += adjustedVector[1] * (frameDelay/10)
                    })
                })
            }
            // add to perm object, update per frame
            // spawn based on clock or random chance, affected by particleSpawnRate and particleSpawnStyle
            
            return [permObject, frameObject]

            function percentOfSpeedRange(percent){
                const min = Math.pow(customVals.particleSpeedMin, 2)/2
                const range = Math.pow(customVals.particleSpeedRange, 2)/2
                return min + (range * percent)
            }
            function percentOfSizeRange(percent){
                const min = Math.pow(customVals.particleSizeMin, 2)
                const range = Math.pow(customVals.particleSizeRange, 2)
                return min + (range * percent)
            }
        },
        sliderRequests: [
            // do particles HAVE to be static after being spawned? alligence, watch: index, volume? + fillstyle would ofc change! yoo
            // ... but kinda breaks the fillstyle -> draw structure. no for now
            {id: "particleSpawnLocation", name: "Sorting", min: 0, max: 2, default: 1, labels: {0: "Random", 1: "Index", 2: "Reverse Index"}},
            {id: "particleSpawnAngle", name: "Angle", min: 0, max: 359, default: 270, labels: {360: "From Center"}},
            {id: "particleSpawnRate", name: "Spawn Rate", min: 1, max: 11, default: 5, labels: {11: "Volume Based"}},

            {id: "particleSizeMin", name: "Size Min", min: 1, max: 10, default: 3},
            {id: "particleSizeRange", name: "Size Range", min: 1, max: 10, default: 5},
            {id: "particleSizeDynamics", name: "Size Dynamics", min: 0, max: 3, default: 2, labels: {0: "Index", 1: "Reverse Index", 2: "Volume", 3: "Reverse Volume"}},

            {id: "particleSpeedMin", name: "Speed Min", min: 1, max: 5, default: 2},
            {id: "particleSpeedRange", name: "Speed Range", min: 1, max: 5, default: 4},
            {id: "particleSpeedDynamics", name: "Speed Dynamics", min: 0, max: 3, default: 1, labels: {0: "Index", 1: "Reverse Index", 2: "Volume", 3: "Reverse Volume"}},
        ]
    }

    return animationStyles
}