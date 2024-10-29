// calls functions from presets-saves-and-local-storage, controls the div: focusImportExport

const presetVersion = 'v1'

function initImportExport(){
    function addPresetMetadata(presetStr){
        const sliderFlags = presetSlider.getAttribute('data-dynamicTextFlags')
        const flagsArr = sliderFlags.split(',')
        const flag = flagsArr[presetSlider.value]
        const name = flag.split('=')[1]

        presetStr += ';' + name + ';' + presetVersion
        return presetStr
    }

    importExportButton.addEventListener('click', () => {
        focusImportExport.style.visibility = "visible"
        exportPresetDiv.textContent = addPresetMetadata(getCurrentPreset())
    })

    focusImportExportCloser.addEventListener('click', () => {
        focusImportExport.style.visibility = "hidden"
    })

    importExportPresetSlider.addEventListener('input', () => {
        presetSlider.value = importExportPresetSlider.value
        handlePresetChange()

        exportPresetDiv.textContent = addPresetMetadata(getCurrentPreset())
    })
    
    exportPresetButton.addEventListener('click', () => {    
        text = getCurrentPreset()
        text = addPresetMetadata(text)
        navigator.clipboard.writeText(text).then(() => {
            customAlert("Text Copied")
        })
    })

    importPresetButton.addEventListener('click', () => {
        function extractMetadata(presetStr){
            const presetArr = presetStr.split(';')
            const [presetName, version] = presetArr.splice(-2, 2)
            let newPresetStr = ""
            presetArr.forEach(setting => {
                if (newPresetStr == "") {
                    newPresetStr = setting
                } else {
                    newPresetStr += ";" + setting
                }
            });

            return [newPresetStr, presetName, version]
        } 
        const [preset, presetName, version] = extractMetadata(importPresetTextarea.value)
        importPresetTextarea.value = ""
        savePreset(preset, presetName)
    })
    // give copy buttons functionality
}
initImportExport()