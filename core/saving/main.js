class SavingMain {
    constructor(
        PIPELINEREFERENCEORDER,
        populator,
        sidebarPositioning,

        stagesContainer,
        presetSlider,

        pipelineSlider,
        contextSidebar,
        
        saveButton,
        deleteButton, 
        replaceButton,
        presetNameInput,
        undoSaveButton,
        
        // iE stands for import-export
        iEFocusDiv,
        iEFocusOpener,
        iEFocusCloser,

        iEPresetSlider,
        iEPresetImporter,
        iEPresetImporterTextarea,
        iEPresetExporter,
        iEPresetExporterDiv,
        
        iESaveTextarea,
        iESaveImporter, 
        iESaveExporter,
        iESaveTextareaClearer
    ){
        this.DEFAULTSAVE = [{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"0"},"canvasContextContrast":{"value":"0"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"2","branches":{"lineShape":{"value":"0"},"lineFlip":{"value":"0"},"lineWidth":{"value":"79"},"lineHeight":{"value":"79"},"innerRadius":{"value":"14"},"spinBaseSpeed":{"value":"2"},"spinScaleSpeed":{"value":"6"}}},"id_data_color":{"value":"1","branches":{"colorLightness":{"value":"40"},"colorDim":{"value":"0"},"colorFade":{"value":"40"},"colorRange":{"value":"-25"},"colorBaseSpeed":{"value":"-5"},"colorScaleSpeed":{"value":"6"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"retro","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"0"},"canvasContextContrast":{"value":"0"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"0","branches":{"yOrigin":{"value":"0"}}},"id_data_color":{"value":"0","branches":{"colorLightness":{"value":"35"},"colorDim":{"value":"1"},"colorFade":{"value":"0"},"colorRange":{"value":"0"},"colorShift":{"value":"299"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"purpur","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"0"},"canvasContextContrast":{"value":"0"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"2","branches":{"lineShape":{"value":"2"},"lineFlip":{"value":"0"},"lineWidth":{"value":"99"},"lineHeight":{"value":"79"},"innerRadius":{"value":"24"},"spinBaseSpeed":{"value":"0"},"spinScaleSpeed":{"value":"6"}}},"id_data_color":{"value":"0","branches":{"colorLightness":{"value":"70"},"colorDim":{"value":"2"},"colorFade":{"value":"0"},"colorRange":{"value":"8"},"colorShift":{"value":"360"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"eclipse","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"0"},"canvasContextContrast":{"value":"0"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"1","branches":{}},"id_data_color":{"value":"1","branches":{"colorLightness":{"value":"70"},"colorDim":{"value":"2"},"colorFade":{"value":"0"},"colorRange":{"value":"8"},"colorBaseSpeed":{"value":"-4"},"colorScaleSpeed":{"value":"6"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"slime","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"0"},"canvasContextContrast":{"value":"0"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"2","branches":{"lineShape":{"value":"1"},"lineFlip":{"value":"1"},"lineWidth":{"value":"48"},"lineHeight":{"value":"79"},"innerRadius":{"value":"88"},"spinBaseSpeed":{"value":"1"},"spinScaleSpeed":{"value":"0"}}},"id_data_color":{"value":"1","branches":{"colorLightness":{"value":"70"},"colorDim":{"value":"1"},"colorFade":{"value":"0"},"colorRange":{"value":"25"},"colorBaseSpeed":{"value":"-5"},"colorScaleSpeed":{"value":"6"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"-1"}}}}},"name":"cityscape","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"3"},"canvasContextContrast":{"value":"4"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"2","branches":{"lineShape":{"value":"2"},"lineFlip":{"value":"0"},"lineWidth":{"value":"99"},"lineHeight":{"value":"79"},"innerRadius":{"value":"20"},"spinBaseSpeed":{"value":"2"},"spinScaleSpeed":{"value":"6"}}},"id_data_color":{"value":"0","branches":{"colorLightness":{"value":"50"},"colorDim":{"value":"1"},"colorFade":{"value":"0"},"colorRange":{"value":"6"},"colorShift":{"value":"198"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"nitro","VERSION":"2.0"},{"context":{"value":"lorem ipsum","branches":{"canvasContextBlur":{"value":"5"},"canvasContextContrast":{"value":"10"},"analyserFftValueSlider":{"value":"12"},"analyserDbMinSlider":{"value":"-100"},"analyserDbRangeSlider":{"value":"70"},"analyserSmoothnessSlider":{"value":"64"}}},"pipeline":{"value":"0","branches":{"id_data_animation":{"value":"2","branches":{"lineShape":{"value":"1"},"lineFlip":{"value":"0"},"lineWidth":{"value":"99"},"lineHeight":{"value":"79"},"innerRadius":{"value":"0"},"spinBaseSpeed":{"value":"0"},"spinScaleSpeed":{"value":"6"}}},"id_data_color":{"value":"0","branches":{"colorLightness":{"value":"70"},"colorDim":{"value":"1"},"colorFade":{"value":"0"},"colorRange":{"value":"0"},"colorShift":{"value":"112"}}},"id_data_analyser":{"value":"0","branches":{"minHz":{"value":"5"},"maxHz":{"value":"1"},"compressFactor":{"value":"3"}}}}},"name":"the blob","VERSION":"2.0"}]
        this.VERSION = "2.0"
        this.PIPELINEREFERENCEORDER = PIPELINEREFERENCEORDER
        this.populator = populator
        this.sidebarPositioning = sidebarPositioning

        this.stagesContainer = stagesContainer
        this.presetSlider = presetSlider
        this.pipelineSlider = pipelineSlider
        this.contextSidebar = contextSidebar
        this.presetNameInput = presetNameInput
        this.undoSaveButton = undoSaveButton

        this.save = [] // array of presets, see makePreset(...)
        this.history = [] // array of saves
        this.historyIndex = -1
        this.presetIndexHistory = []

        this.activeAccessTree = {}

        presetSlider.addEventListener('input', () => {
            this.loadSelectedPreset()
        })
        saveButton.addEventListener('click', () => {
            const presetName = this.presetNameInput.value
            this.presetNameInput.value = ""
            this.addPreset(this.makePreset(presetName, ...this.getCurrentValuesTree()))
        })
        deleteButton.addEventListener('click', () => {
            this.deletePreset()
        })
        replaceButton.addEventListener('click', () => {
            const presetName = this.presetNameInput.value
            this.presetNameInput.value = ""
            this.replacePreset(this.makePreset(presetName, ...this.getCurrentValuesTree(), true))
        })
        undoSaveButton.addEventListener('click', () => {
            this.navigateHistory(-1)
        })
        document.addEventListener('keydown', (event) => {
            if (document.querySelector("textarea:focus") === null && document.querySelector('input[type="text"]:focus') === null) {
                if (event.code == 'KeyZ' && event.ctrlKey && !event.shiftKey) { // rollback from history
                    this.navigateHistory(-1)
                    event.preventDefault() // preset input auto focuses and rolls back on its own. prevent this.
                } else if ((event.code == 'KeyY' && event.ctrlKey) || (event.code == 'KeyZ' && event.ctrlKey && event.shiftKey)) { // redo from history
                    this.navigateHistory(1)
                    event.preventDefault() // preset input auto focuses and rolls back on its own. prevent this.
                }
            } else if (event.code == 'Enter' && this.presetNameInput.matches(':focus')){
                const presetName = this.presetNameInput.value
                this.presetNameInput.value = ""
                this.addPreset(this.makePreset(presetName, ...this.getCurrentValuesTree()))
            }
        }, {capture: true})


        // IMPORT EXPORT
        // -window controls
        iEFocusOpener.addEventListener('click', () => {
            iEFocusDiv.style.visibility = "visible"
            iEPresetExporterDiv.textContent = JSON.stringify(this.save[this.presetSlider.value])
            iESaveTextarea.value = JSON.stringify(this.save)
        })

        iEFocusCloser.addEventListener('click', () => {
            iEFocusDiv.style.visibility = "hidden"
        })

        document.addEventListener('keydown', (event) => {
            if (event.code == 'Escape') {
                iEFocusDiv.style.visibility = "hidden"
            }
        })

        // -preset controls
        iEPresetSlider.addEventListener('input', () => {
            this.presetSlider.value = iEPresetSlider.value
            this.loadSelectedPreset()
            iEPresetExporterDiv.textContent = this.save[this.presetSlider.value]
        })
        
        iEPresetExporter.addEventListener('click', () => {    
            const preset = this.save[this.presetSlider.value]

            navigator.permissions.query({name:'clipboard-write'}).then((result) => {
                if (result.state == 'denied'){
                    customAlert("Error: Clipboard-write permissions denied")
                } else {
                    navigator.clipboard.writeText(JSON.stringify(preset)).then(() => {
                        customAlert("\u2713 Copied to clipboard: " + preset.name)
                    })
                }
            })
        })

        iEPresetImporter.addEventListener('click', () => {
            if (iEPresetImporterTextarea.value === ""){
                customAlert("Error: Importing text-area is empty!")
            } else {
                const preset = this.jsonParseAndHandle(iEPresetImporterTextarea.value)

                if (this.presetFormatCheck(preset) === true){
                    this.addPreset(preset)
                    customAlert("\u2713 Added: " + preset.name)
                } else {
                    customAlert("Error loading preset: see console log")
                }
            }
        })
        
        // -save controls
        iESaveExporter.addEventListener('click', () => {
            function writeToClipboard(string) {
                return new Promise((resolve, reject) => {
                    navigator.permissions.query({name:'clipboard-write'}).then((result) => {
                        if (result.state == 'denied'){
                            reject()
                        } else {
                            navigator.clipboard.writeText(string)
                            resolve()
                        }
                    })
                })
            }

            const saveStr = iESaveTextarea.value
            let isSaveInvalid = false

            let saveArr
            try {
                saveArr = JSON.parse(saveStr)
            } catch(e){
                if (e.name = "SyntaxError"){
                    isSaveInvalid = true
                } else {
                    throw e
                }
            }

            if (!isSaveInvalid){
                for (const i in saveArr){
                    const preset = saveArr[i]
                    const result = this.presetFormatCheck(preset)
                    if (result !== true){
                        isSaveInvalid = true
                        break
                    }
                }
            }

            if (!isSaveInvalid){
                writeToClipboard(saveStr).then(
                    () => {customAlert("\u2713 Save copied to clipboard")},
                    () => {customAlert("Error: Clipboard-write permission denied")}
                )
            } else {
                writeToClipboard(saveStr).then(
                    () => {customAlert("Warning: Exported save is invalid: see console log")},
                    () => {customAlert("Error: Clipboard-write permission denied")}
                )
            }
        })
        
        iESaveImporter.addEventListener('click', () => {
            const saveStr = iESaveTextarea.value
    
            if (saveStr === ""){
                this.save = []
                customAlert("\u2713 Save deleted.", undoSaveButton)
                this.saveToLocalStorage()
                this.updatePresetSliderLabels()
                this.loadSelectedPreset()
                this.overwriteSubsequentHistory()
            } else {
                const newSave = this.jsonParseAndHandle(saveStr)
                for (const i in newSave){
                    const preset = newSave[i]
                    const result = this.presetFormatCheck(preset)
                    if (result !== true){
                        customAlert("Invalid save format: see console log")
                        break
                    } else if (i == newSave.length - 1){
                        this.save = newSave
                        customAlert("\u2713 Save loaded")
                        this.saveToLocalStorage()
                        this.updatePresetSliderLabels()
                        this.loadSelectedPreset()
                        this.overwriteSubsequentHistory()
                    }
                }
            }
        })

        iESaveTextareaClearer.addEventListener('click', () => {
            iESaveTextarea.value = ""
            customAlert("\u2713 Text-area cleared")
        })
        // END OF IMPORT EXPORT

        this.loadFromLocalStorage()
        this.updatePresetSliderLabels()
        this.loadSelectedPreset()

        this.overwriteSubsequentHistory()
    }

    updatePresetSliderLabels(){
        const labels = {}
        if (this.save.length === 0){
            this.presetSlider.max = 0
            labels[0] = "None"
        } else {
            presetSlider.max = this.save.length - 1
            this.save.forEach((preset, index) => {
                labels[index] = preset.name
            })
        }

        const dynamicTextFlags = JSON.stringify(labels)
        this.presetSlider.setAttribute("data-dynamicTextFlags", dynamicTextFlags)
    }

    loadSelectedPreset(){
        let pipeline // what to build from
        let preset // values to set the build to
        if (this.save.length == 0){
            preset = null
            pipeline = this.PIPELINEREFERENCEORDER[0]
        } else {
            preset = this.save[this.presetSlider.value]
            pipeline = this.PIPELINEREFERENCEORDER[preset.pipeline.value]
        }
        
        // stages
        const stages = pipeline.getStages()
        function populateStages(populator, sidebarPositioning, stagesContainer, stages, stageValuesTree = undefined){
            const [accessTree, stageSidebarImagePairs] = populator.populateStagesContainer(stages, stagesContainer, sidebarPositioning, stageValuesTree)
            sidebarPositioning.removePairsWithMark("stagepair")
            sidebarPositioning.addPairsArray(stageSidebarImagePairs, "stagepair")
            return accessTree
        }
        let accessTree
        if (preset === null){
            accessTree = populateStages(this.populator, this.sidebarPositioning, this.stagesContainer, stages)
        } else {
            accessTree = populateStages(this.populator, this.sidebarPositioning, this.stagesContainer, stages, preset.pipeline.branches)
        }
        this.activeAccessTree = accessTree

        // set context values tree
        if (preset !== null){
            const slidersArr = this.populator.getDynamicTextContainerSliders(this.contextSidebar)
            slidersArr.forEach((slider) => {
                slider.value = preset.context.branches[slider.id].value
            })
        }

        updateDynamicText()
        this.sidebarPositioning.checkAll()
    }

    getCurrentValuesTree(){ // <branch> = {<branchid>: {value: <num>, branches: { <branch>, ... }}}
        function branchesFromContainer(slidersContainer, populator, lastBranchesInTree=false){
            const branches = {}
            const slidersArr = populator.getDynamicTextContainerSliders(slidersContainer)
            slidersArr.forEach((slider) => {
                const branch = {}
                branch.value = slider.value

                if (!lastBranchesInTree){
                    branch.branches = {}
                }
                
                
                branches[slider.id] = branch
            })

            return branches
        }

        const pipeline = {}
        pipeline.value = this.pipelineSlider.value
        pipeline.branches = {} 

        const accessTree = this.activeAccessTree
        Object.keys(accessTree).forEach((branchId) => {
            const branch = {}
            branch.value = accessTree[branchId].slider.value
            branch.branches = branchesFromContainer(accessTree[branchId].slidersContainer, this.populator, true)

            pipeline.branches[branchId] = branch
        })

        const context = {}
        context.value = "lorem ipsum" // PLACEHOLDER. Until try to mess around with different context styles
        context.branches = branchesFromContainer(this.contextSidebar, this.populator, true)

        return [pipeline, context]
    }

    makePreset(name, pipeline="current", context="current"){
        let currentPipeline
        let currentContext

        if (pipeline !== "current" || pipeline !== "current") {
            const r = this.getCurrentValuesTree()
            currentPipeline = r[0]
            currentContext = r[1]
        }

        if (pipeline === "current") {
            pipeline = currentPipeline
        }
        if (context === "current") {
            context = currentContext
        }

        return {
            context:context,
            pipeline:pipeline,
            name: name,
            VERSION: this.VERSION
        }
    }

    presetFormatCheck(preset){
        class FormatCheckFailed extends Error {
            constructor(message) {
              super(message);
              this.name = 'FormatCheckFailed';
            }
        }

        try {
            function checkIncludes(object, objectName, property){
                if (!Object.hasOwn(object, property)){
                    throw new FormatCheckFailed(objectName + " does not have property: " + property)
                }
                if (property === "value"){
                    if (isNaN(object[property])){
                        throw new FormatCheckFailed(objectName + "'s value '" + object[property] + "' is not numeric")
                    }
                }
            }
            function getIdsFromSliders(sliders){
                let ids = []
                sliders.forEach((slider) => {
                    ids.push(slider.id)
                })
                return ids
            }
            function getIdsFromSliderRequests(sliderRequests){
                let ids = []
                sliderRequests.forEach((request) => {
                    ids.push(request.id)
                })
                return ids
            }
            function checkIdInPossibleIds(id, possibleIds){
                for (let i = 0; i < possibleIds.length; i++){
                    const possibleId = possibleIds[i]
                    if (id == possibleId){
                        return
                    }
                    if (i == possibleIds.length - 1){
                        throw new FormatCheckFailed("<" + id + "> id does not correlate with possible ids: [" + possibleIds + "]")
                    }
                }
            }
            
            checkIncludes(preset, "preset", "VERSION")
            checkIncludes(preset, "preset", "name")

            checkIncludes(preset, "preset", "context")
            // checkIncludes(preset.context, "preset context", "value")
            checkIncludes(preset.context, "preset context", "branches")
            Object.keys(preset.context.branches).forEach((branchId) => {
                const possibleSliders = this.populator.getDynamicTextContainerSliders(this.contextSidebar)
                checkIdInPossibleIds(branchId, getIdsFromSliders(possibleSliders))
            })

            checkIncludes(preset, "preset", "pipeline")
            checkIncludes(preset.pipeline, "preset pipeline", "value")
            checkIncludes(preset.pipeline, "preset pipeline", "branches")
            Object.keys(preset.pipeline.branches).forEach((stageId) => {
                const possibleStages = this.PIPELINEREFERENCEORDER[preset.pipeline.value].stages
                const possibleStageIds = Object.keys(possibleStages)
                checkIdInPossibleIds(stageId, possibleStageIds)

                const stage = preset.pipeline.branches[stageId]
                checkIncludes(stage, "stage: " + stageId, "value")
                checkIncludes(stage, "stage: " + stageId, "branches")

                Object.keys(stage.branches).forEach((styleSliderRequestId) => {
                    const styleId = possibleStages[stageId].referenceOrder[stage.value]
                    const possibleStyleSliderRequests = possibleStages[stageId][styleId].sliderRequests
                    
                    const possibleStyleSliderRequestIds = getIdsFromSliderRequests(possibleStyleSliderRequests)
                    checkIdInPossibleIds(styleSliderRequestId, possibleStyleSliderRequestIds)

                    const style = stage.branches[styleSliderRequestId]
                    checkIncludes(style, "style slider request: " + styleSliderRequestId, "value")
                })
            })
        } catch (e) {
            if (e.name = "FormatCheckFailed"){
                console.error(e)
                return e.message
            } else {
                throw e
            }
        }
        return true
    }

    addPreset(preset){
        if (this.save.length == 0) {
            this.save.unshift(preset)
        } else {
            this.save.splice(Number(this.presetSlider.value) + 1, 0, preset)
            this.presetSlider.max++ // ensure value increment is not truncated when value == max
            this.presetSlider.value++
        }

        this.saveToLocalStorage()
        this.updatePresetSliderLabels()
        this.loadSelectedPreset()

        customAlert("\u2713 Saved: " + preset.name)

        this.overwriteSubsequentHistory()
    }

    deletePreset(){
        if (this.save.length != 0) {
            const nameOfDeleted = this.save[this.presetSlider.value].name
            
            this.save.splice(this.presetSlider.value, 1)

            this.saveToLocalStorage()
            this.updatePresetSliderLabels()
            this.loadSelectedPreset()

            customAlert("\u2713 Deleted: " + String(nameOfDeleted).split("=")[1] + " ", this.undoSaveButton)
    
            this.overwriteSubsequentHistory()
        }
    }

    replacePreset(preset){
        if (this.save.length != 0) {
            let noNewName = false
            if (preset.name == "") {
                noNewName = true
                // use the name of the preset being replaced instead
                preset.name = this.save[this.presetSlider.value].name
            }
            this.save[this.presetSlider.value] = preset
            
            this.saveToLocalStorage()
            this.updatePresetSliderLabels()
            this.loadSelectedPreset()

            if (noNewName) {
                customAlert("\u2713 Updated: " + preset.name)
            } else {
                customAlert("\u2713 Replaced: " + preset.name)
            }

            this.overwriteSubsequentHistory()
        }
    }

    overwriteSubsequentHistory(){
        // truncate history
        const index = this.historyIndex + 1 // second argument of slice is exclusive
        this.history = this.history.slice(0, index)
        this.presetIndexHistory = this.presetIndexHistory.slice(0, index)

        // append current save to history
        this.history.push(Array.from(this.save))
        this.presetIndexHistory.push(this.presetSlider.value)
        this.historyIndex++
    }

    navigateHistory(direction){
        if (this.history.length == 0){
            customAlert("No captures created yet!")
        } else if (this.history.length == 1) {
            customAlert("No captures to roll to yet!")
        } else {
            if (direction > 0){
                if (this.historyIndex >= this.history.length - 1) {
                    customAlert("Already at last capture!")
                } else {
                    this.historyIndex++
                }
            } else if (direction < 0){
                if (this.historyIndex == 0) {
                    customAlert("Already at first capture!")
                } else {
                    this.historyIndex--
                }
            } else {
                throw new Error("invalid navigation direction: " + direction)
            }

            this.save = this.history[this.historyIndex]

            const newPresetSliderValue = this.presetIndexHistory[this.historyIndex]
            this.presetSlider.max = newPresetSliderValue // so that that value-setting can't get capped off.
            this.presetSlider.value = newPresetSliderValue
        
            this.saveToLocalStorage()
            this.updatePresetSliderLabels()
            this.loadSelectedPreset()
        
            customAlert("\u2713 rolled to capture #" + this.historyIndex + "/" + (this.history.length - 1))
        }
    }

    jsonParseAndHandle(jsonStr){
        let jsonObj
        try {
            jsonObj = JSON.parse(jsonStr)
        } catch(e){
            if (e.name = "SyntaxError"){
                customAlert("Error: Could not load local save - invalid Json format")
            } else {
                throw e
            }
        }
        return jsonObj
    }

    saveToLocalStorage(){
        localStorage.setItem("save", JSON.stringify(this.save))
    }
    
    loadFromLocalStorage(){
        const jsonStr = localStorage.getItem("save")
        if (jsonStr === null || jsonStr == "[]"){
            this.save = this.DEFAULTSAVE
            localStorage.setItem("save", JSON.stringify(this.save))
            customAlert("Default presets initialized")
        } else {
            const newSave = this.jsonParseAndHandle(jsonStr)
            for (const i in newSave){
                const preset = newSave[i]
                const result = this.presetFormatCheck(preset)
                if (result !== true){
                    customAlert("Error loading local save: see console log")
                    localStorage.setItem("lastLocalSaveFailed?", "true")
                    break
                } else if (i == newSave.length - 1){
                    if (localStorage.getItem("lastLocalSaveFailed?") == "true"){
                        customAlert("Successfully loaded local save")
                        localStorage.setItem("lastLocalSaveFailed?", "false")
                    }
                    this.save = newSave
                }
            }
        }
    }

    versionControl(preset){
        // TODO version control (when neccessary)
    }
}
