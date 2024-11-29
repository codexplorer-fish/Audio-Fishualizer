function initAnalyseAnimate() {
    // canvas
    const canvas = document.getElementById('CANVAS')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const canvasContext = canvas.getContext('2d')

    // Pipelines and supporters
    const sidebarPositioning = new SidebarPositioning()
    const populator = new Populator()
    const dataMain = new DataMain(canvas, canvasContext)

    // context styling - assume analyser and canvas are the only ones
    const contextStyleAnalyser = getContextStyleAnalyser()
    const contextStyleCanvas = getContextStyleCanvas()

    const r = contextStyleCanvas.sliderRequests.concat(contextStyleAnalyser.sliderRequests)
    contextSliders = populator.populateCollapingContainer(r, document.getElementById("contextSidebar"))


    const PIPELINEREFERENCEORDER = [
        dataMain
    ]
    const stages = dataMain.getStages()
    // assume datamain is the only pipeline

    // saving
    const savingMain = new SavingMain(
        PIPELINEREFERENCEORDER,
        populator,
        sidebarPositioning,

        document.getElementById('stagesContainer'),
        document.getElementById("presetSlider"),

        document.getElementById("pipelineSlider"),
        document.getElementById("contextSidebar"),
        
        document.getElementById("presetSaver"),
        document.getElementById("presetDeleter"),
        document.getElementById("presetReplacer"),
        document.getElementById("presetNameInput"),
        document.getElementById("undoSaveButton"),

        document.getElementById("focusImportExport"),
        document.getElementById("iEFocusOpener"),
        document.getElementById("iEFocusCloser"),
        
        document.getElementById("iEPresetSlider"),
        document.getElementById("iEPresetImporter"),
        document.getElementById("iEPresetImporterTextarea"),
        document.getElementById("iEPresetExporter"),
        document.getElementById("iEPresetExporterDiv"),

        document.getElementById("iESaveTextarea"),
        document.getElementById("iESaveImporter"),
        document.getElementById("iESaveExporter"),
        document.getElementById("iESaveTextareaClearer")
    )
    // call saving-main: save a preset, load the preset (populate), get the stage sliders and style slider containers 

    function initInteractionDependent() {
        // source
        const source = new Source(
            document.getElementById("sourceSelect"),
            document.getElementById("muteButton"),
            document.getElementById("audioElement"),
            document.getElementById("audioFileInput"),
            document.getElementById("sourceDelaySlider"),
            document.getElementById("reshareMediaButton"),
        )
        const [analyser, audioCtx] = source.getSource()
        let dataArray = new Uint8Array(analyser.frequencyBinCount)

        let lastTimestamp = document.timeline.currentTime
        function animate(timestamp){
            animateDelay = timestamp - lastTimestamp
            source.setAnimateDelay(animateDelay)

            const [pipelineOptionsTree, contextOptionsTree] = savingMain.getCurrentValuesTree()

            function extractBranchesValues(branches){
                const customValues = {}
                Object.keys(branches).forEach(branchId => {
                    customValues[branchId] = branches[branchId].value
                });
                return customValues
            }
            const contextOptions = extractBranchesValues(contextOptionsTree.branches)
            

            // canvas
            canvasContext.clearRect(0, 0, canvas.width, canvas.height)
            contextStyleCanvas.function(canvas, contextOptions)

            // analyser
            refreshDataArray = contextStyleAnalyser.function(analyser, contextOptions)
            if (refreshDataArray){
                dataArray = new Uint8Array(analyser.frequencyBinCount)
            }
            analyser.getByteFrequencyData(dataArray)

            // draw
            dataMain.animate(timestamp, dataArray, audioCtx.sampleRate, pipelineOptionsTree, extractBranchesValues)

            lastTimestamp = timestamp
            requestAnimationFrame(animate)
        }
        animate()
    }
    window.addEventListener('click', initInteractionDependent, {once: true})

}
initAnalyseAnimate()