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

        navigator.permissions.query({name:'clipboard-write'}).then((result) => {
            if (result.state == 'denied'){
                customAlert("Error: Clipboard-write permissions denied")
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    customAlert("\u2713 Copied to clipboard: " + name)
                })
            }
        })
    })

    importPresetButton.addEventListener('click', () => {
        const [preset, presetName, version] = extractPresetMetadata(importPresetTextarea.value)

        if (!presetFormatCheck(preset)) {
            customAlert("Error: Invalid preset format")
        } else if (flagsCharCheck(presetName)) {
            customAlert("Error: Invalid preset name")
        } else {
            // >version control here<. check if valid version syntax, convert outdated versions

            importPresetTextarea.value = ""
            savePreset(preset, presetName)
            customAlert("\u2713 Added: " + presetName)
        }
    })
    
    // save controls
    exportSaveButton.addEventListener('click', () => {
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

        const saveStr = importExportSaveTextarea.value
        const [presetsStr, sliderFlags] = extractSaveMetadata(saveStr)

        if (!saveFormatCheck(presetsStr)){
            writeToClipboard(saveStr).then(
                () => {customAlert("Warning: Exported save is invalid")},
                () => {customAlert("Error: Clipboard-write permission denied")}
            )
        } else {
            writeToClipboard(saveStr).then(
                () => {customAlert("\u2713 Save copied to clipboard")},
                () => {customAlert("Error: Clipboard-write permission denied")}
            )
        }
    })
    
    importSaveButton.addEventListener('click', () => {
        const saveStr = importExportSaveTextarea.value
        const [presetsStr, sliderFlags] = extractSaveMetadata(saveStr)

        if (saveFormatCheck(presetsStr)){
            changeSave(presetsStr, sliderFlags)
            customAlert("\u2713 Save Applied")
        } else {
            customAlert("Error: Invalid save format")
        }
    })

    exportClearTextarea.addEventListener('click', () => {
        importExportSaveTextarea.value = ""
    })

}
initImportExport()