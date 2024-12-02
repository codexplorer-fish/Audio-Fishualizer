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
                spawnChance *= dataValue * 5
            } else {
                spawnChance *= customVals.particleSpawnRate
            }

            if (Math.random() < spawnChance || true) {
                const particle = {
                    pos: [undefined, undefined],
                    radius: undefined,
                    vector: [undefined, undefined],
                    start: [undefined, undefined],
                    end: [undefined, undefined]
                }

                if (customVals.particleSpeedDynamics == 0){
                    const speed = percentOfSpeedRange(dataValue)
                    const radians = Math.atan(particle.vector[1]/particle.vector[0])

                    particle.vector[0] = Math.sin(radians) * speed
                    particle.vector[1] = Math.cos(radians) * speed
                } else {
                    const speed = percentOfSpeedRange(1 - dataValue)
                    const radians = Math.atan(particle.vector[1]/particle.vector[0])

                    particle.vector[0] = Math.sin(radians) * speed
                    particle.vector[1] = Math.cos(radians) * speed
                }

                if (customVals.particleSizeDynamics == 0){
                    particle.radius = percentOfSizeRange(dataValue)
                } else {
                    particle.radius = percentOfSizeRange(1 - dataValue)
                }


                const angle = Number(customVals.particleSpawnAngle) * 2
                const perpSlope = Math.tan(((angle + 90) % 360) * Math.PI / 180) 
                const slope = Math.tan(angle * Math.PI / 180)
                
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
                canvasContext.save()
                canvasContext.scale(0.5, 0.5)
                canvasContext.translate(200, 200)

                // x markers
                const lowerXLimit = intersectionOf(lowerIntersecting, cornerLine)
                const upperXLimit = intersectionOf(upperIntersecting, cornerLine)

                // spawn
                const xRange = upperXLimit - lowerXLimit
                const cornerLineSelectedX = (Math.random() * xRange) + lowerXLimit
                const cornerLineSelectedY = xForY(cornerLine, cornerLineSelectedX)
                const particleLine = {s: slope, xy: [cornerLineSelectedX, cornerLineSelectedY]}

                // path
                const rectLines = [{s: 0, xy: topLeft}, {s: "vertical", xy: bottomRight}, {s: 0, xy: bottomRight}, {s: "vertical", xy: topLeft}]
                let firstX
                let lastX
                console.log("e")
                rectLines.forEach((line) => {
                    let intersectX
                    if (line.s == "vertical"){
                        intersectX = line.xy[0]
                    } else {
                        intersectX = yForx(particleLine, line.xy[1])
                    }
                    const intersectY = xForY(particleLine, intersectX)

                    console.log(intersectX, intersectY) // TODO broken :(
                    if (((intersectX == 0 || intersectX == window.innerWidth) && (intersectY >= 0 && intersectY <= window.innerHeight)) ||
                        ((intersectY == 0 || intersectY == window.innerHeight) && (intersectX >= 0 && intersectX <= window.innerWidth)))
                    {
                        if (cornerLine.xy[0] == intersectX || cornerLine.xy[1] == intersectY){ // is intersect one of the lines in the corner that cornerLine is pivoting off of?
                            firstX = intersectX
                        } else {
                            lastX = intersectX
                        }
                    }
                })

                const radians = angle * Math.PI / 180
                const distance = particle.radius
                firstX += Math.cos(radians) * distance
                lastX -= Math.cos(radians) * distance
                
                particle.start = [firstX, xForY(particleLine, firstX)]
                particle.end = [lastX, xForY(particleLine, lastX)]
                particle.pos = particle.start
                
                if (permObject.colorReferencedParticles.indexes[dataNum] === undefined){
                    permObject.colorReferencedParticles.indexes[dataNum] = [particle]
                } else {
                    permObject.colorReferencedParticles.indexes[dataNum].push(particle)
                }

                canvasContext.beginPath()
                canvasContext.rect(0, 0, window.innerWidth, window.innerHeight)
                canvasContext.stroke()
                canvasContext.restore()

                function intersectionOf(l1, l2){
                    return ((l1.xy[0]*l1.s) - (l2.xy[0]*l2.s) - l1.xy[1] + l2.xy[1]) / (l1.s - l2.s) // hopefully works. hot from the algebra oven
                }
                function yForx(l, y){
                    return (y - l.xy[1])/l.s + l.xy[0]
                }
                function xForY(l, x){
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
                    if (customVals.particleSpeedDynamics == 2){
                        const speed = percentOfSpeedRange(dataValue)
                        const radians = Math.atan(particle.vector[1]/particle.vector[0])

                        particle.vector[0] = Math.sin(radians) * speed
                        particle.vector[1] = Math.cos(radians) * speed
                    }
                    if (customVals.particleSpeedDynamics == 3){
                        const speed = percentOfSpeedRange(1 - dataValue)
                        const radians = Math.atan(particle.vector[1]/particle.vector[0])

                        particle.vector[0] = Math.sin(radians) * speed
                        particle.vector[1] = Math.cos(radians) * speed
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


                        const SMOOTHING = 3
                        let adjustedVector = particle.vector
                        const travelPercent = Math.abs(particle.pos[0] - particle.start[0])/Math.abs(particle.end[0] - particle.start[0])
                        if (customVals.particleSpeedPath == 0){
                            // linear is the default
                        } else if (customVals.particleSpeedPath == 1 || customVals.particleSpeedPath == 3){
                            if (travelPercent < 0.5){
                                adjustedVector[0] = particle.vector[0] * Math.pow(travelPercent*2, 1/SMOOTHING)
                                adjustedVector[1] = particle.vector[1] * Math.pow(travelPercent*2, 1/SMOOTHING)
                            }
                        } else if (customVals.particleSpeedPath == 2 || customVals.particleSpeedPath == 3){
                            if (travelPercent > 0.5){
                                adjustedVector[0] = particle.vector[0] * Math.pow(abs(travelPercent - 1)*2, 1/SMOOTHING)
                                adjustedVector[1] = particle.vector[1] * Math.pow(abs(travelPercent - 1)*2, 1/SMOOTHING)
                            }
                        }

                        particle.pos[0] += adjustedVector[0]
                        particle.pos[1] += adjustedVector[1]
                    })
                })
            }
            // add to perm object, update per frame
            // spawn based on clock or random chance, affected by particleSpawnRate and particleSpawnStyle
            
            return [permObject, frameObject]

            function percentOfSpeedRange(percent){
                const min = Math.pow(customVals.particleSpeedMin, 2)
                const range = Math.pow(customVals.particleSpeedRange, 2)
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
            {id: "particleSpawnAngle", name: "Angle x2", min: 0, max: 180, default: 45, labels: {360: "From Center"}},
            {id: "particleSpawnRate", name: "Spawn Rate", min: 1, max: 11, default: 5, labels: {11: "Volume Based"}},

            {id: "particleSizeMin", name: "Size Min", min: 0, max: 10, default: 0},
            {id: "particleSizeRange", name: "Size Range", min: 0, max: 10, default: 0},
            {id: "particleSizeDynamics", name: "Size Dynamics", min: 0, max: 3, default: 0, labels: {0: "Index", 1: "Inverse Index", 2: "Volume", 3: "Inverse Volume"}},

            {id: "particleSpeedMin", name: "Speed Min", min: 0, max: 10, default: 0},
            {id: "particleSpeedRange", name: "Speed Range", min: 0, max: 10, default: 0},
            {id: "particleSpeedDynamics", name: "Speed Dynamics", min: 0, max: 3, default: 0, labels: {0: "Index", 1: "Inverse Index", 2: "Volume", 3: "Inverse Volume"}},
            {id: "particleSpeedPath", name: "Ease", min: 0, max: 3, default: 0, labels: {0: "None", 1: "In", 2: "Out", 3: "In-Out"}},
        ]
    }

    return animationStyles
}