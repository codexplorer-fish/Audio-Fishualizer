
class DataMain {
    constructor(canvas, canvasContext) {
        this.name = "Data"

        this.canvas = canvas
        this.canvasContext = canvasContext

        this.stages = {}
        this.stages['id_data_animation'] = dataPipeline_getAnimationStyles()
        this.stages['id_data_color'] = dataPipeline_getColorStyles()
        this.stages['id_data_analyser'] = dataPipeline_getAnalyserStyles()

        this.permObjects = this.matchPipelineKeys()

        this.lastSelectedStages = this.matchPipelineKeys()
    }

    matchPipelineKeys() {
        let object = {}
        Object.keys(this.stages).forEach((key) => {
            object[key] = {}
        })
        return object
    }

    getStages() {
        return this.stages
    }

    getMySliderDynamicFlags() {
        let flagsObj = {}
        Object.keys(this.stages).forEach((key, index) => {
            flagsObj[index] = key
        })
        const flagsJson = JSON.stringify(flagsObj)
        return flagsJson
    }
    // in main: set it up: populate dynamic sliders container, flag slider, set up hide-show func, etc.
     


    animate(animationTimestamp, dataArray, sampleRate, pipelineOptionsTree, extractBranchesValues) {
        const stageBranches = pipelineOptionsTree.branches
        const selectedStages = extractBranchesValues(stageBranches)
        
        // if style index changed, signal to style that it needs to be restarted
        let resetStyle = this.matchPipelineKeys()
        Object.keys(this.lastSelectedStages).forEach((key) => {
            if (this.lastSelectedStages[key] == selectedStages[key]){
                resetStyle[key] = false
            } else {
                resetStyle[key] = true
            }
        })        
        this.lastSelectedStages = selectedStages

        // style data
        const analyserParams = [
            dataArray,
            sampleRate,
            extractBranchesValues(stageBranches['id_data_analyser'].branches)
        ]
        let styleIndex = this.stages['id_data_analyser'].referenceOrder[selectedStages['id_data_analyser']]
        const styledDataArray = this.stages['id_data_analyser'][styleIndex].function(...analyserParams)

        const styledBufferLength = styledDataArray.length


        let frameObjects = this.matchPipelineKeys()
        let firstCallInFrame = true
        let lastCallInFrame = false

        for (let i = 0; i < styledBufferLength; i++) {
            const fftValue = styledDataArray[i] // max fftValue = 255

            if (i + 1 == styledBufferLength) {
                lastCallInFrame = true
            } 
            let alwaysNumTimestamp = animationTimestamp
            if (alwaysNumTimestamp == undefined) {
                alwaysNumTimestamp = 0
            }

            const colorParams = [
                this.canvasContext,
                [fftValue / 255, i, styledBufferLength],
                [this.permObjects['id_data_color'], frameObjects['id_data_color']],
                [resetStyle['id_data_color'], firstCallInFrame, lastCallInFrame],
                alwaysNumTimestamp,
                extractBranchesValues(stageBranches['id_data_color'].branches)
            ]
            styleIndex = this.stages['id_data_color'].referenceOrder[selectedStages['id_data_color']]
            const colorStyleMemory = this.stages['id_data_color'][styleIndex].function(...colorParams)

            this.permObjects['id_data_color'] = colorStyleMemory[0]
            frameObjects['id_data_color'] = colorStyleMemory[1]


            const animationParams = [
                canvas,
                this.canvasContext,
                [fftValue / 255, i, styledBufferLength],
                [this.permObjects['id_data_animation'], frameObjects['id_data_animation']],
                [resetStyle['id_data_animation'], firstCallInFrame, lastCallInFrame],
                alwaysNumTimestamp,
                extractBranchesValues(stageBranches['id_data_animation'].branches)
            ]
            styleIndex = this.stages['id_data_animation'].referenceOrder[selectedStages['id_data_animation']]
            const animationStyleMemory = this.stages['id_data_animation'][styleIndex].function(...animationParams)

            this.permObjects['id_data_animation'] = animationStyleMemory[0]
            frameObjects['id_data_animation'] = animationStyleMemory[1]


            firstCallInFrame = false
            Object.keys(resetStyle).forEach((stageId) => {
                resetStyle[stageId] = false
            })
        }
    }
}