// calls functions from presets-saves-and-local-storage, controls the div: focusImportExport

function initImportExport(){
    // window controls
    importExportButton.addEventListener('click', () => {
        focusImportExport.style.visibility = "visible"
        exportPresetDiv.textContent = addPresetMetadata(getCurrentPreset(), presetSlider.value)

        importExportSaveTextarea.value = addSaveMetadata(getPresets())
    })

    focusImportExportCloser.addEventListener('click', () => {
        focusImportExport.style.visibility = "hidden"
    })

    // preset controls
    importExportPresetSlider.addEventListener('input', () => {
        presetSlider.value = importExportPresetSlider.value
        handlePresetChange()

        exportPresetDiv.textContent = addPresetMetadata(getCurrentPreset(), presetSlider.value)
    })
    
    exportPresetButton.addEventListener('click', () => {    
        const text = addPresetMetadata(getCurrentPreset(), presetSlider.value)
        const name = text.split(';').at(-2)
        navigator.clipboard.writeText(text).then(() => {
            customAlert("Copied: " + name)
        })
    })

    importPresetButton.addEventListener('click', () => {
        const [preset, presetName, version] = extractPresetMetadata(importPresetTextarea.value)
        importPresetTextarea.value = ""
        savePreset(preset, presetName)
        customAlert("Added: " + presetName)
    })
    
    // save controls
    exportSaveButton.addEventListener('click', () => {
        const presetsStr = getPresets()
        const saveStr = addSaveMetadata(presetsStr)
        navigator.clipboard.writeText(saveStr).then(() => {
            customAlert("Save Copied")
        })
    })
    
    importSaveButton.addEventListener('click', () => {
        const saveStr = importExportSaveTextarea.value
        const [presetsStr, sliderFlags] = extractSaveMetadata(saveStr)
        changeSave(presetsStr, sliderFlags)
        customAlert("Save Applied")
    })

    exportClearTextarea.addEventListener('click', () => {
        importExportSaveTextarea.value = ""
    })

}
initImportExport()