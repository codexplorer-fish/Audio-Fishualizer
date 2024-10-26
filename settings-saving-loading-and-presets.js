const staticValueElements = [ // all static elements with a .value attribute that want their value to be saved
    animationStyleSlider, 
    colorStyleSlider, 
    analyserStyleSlider,
    analyserFftValueSlider,
    analyserDbMinSlider,
    analyserDbMaxSlider,
    analyserSmoothnessSlider
]


const defaultPresets = "animationStyleSlider,0;colorStyleSlider,0;analyserStyleSlider,0;analyserFftValueSlider,12;colorLightness,80;colorDimSettings,1;colorFade,0;colorRange,-10;colorShift,322;minHz,5;maxHz,1;compressFactor,3`animationStyleSlider,2;colorStyleSlider,0;analyserStyleSlider,0;analyserFftValueSlider,12;lineWidth,100;spinBaseSpeed,2;spinScaleSpeed,6;colorLightness,50;colorDimSettings,2;colorFade,0;colorRange,0;colorShift,89;minHz,5;maxHz,1;compressFactor,3`animationStyleSlider,1;colorStyleSlider,0;analyserStyleSlider,0;analyserFftValueSlider,12;colorLightness,50;colorDimSettings,0;colorFade,0;colorRange,5;colorShift,25;minHz,5;maxHz,1;compressFactor,3`animationStyleSlider,0;colorStyleSlider,1;analyserStyleSlider,0;analyserFftValueSlider,12;colorLightness,80;colorDimSettings,1;colorFade,0;colorRange,-25;colorBaseSpeed,4;colorScaleSpeed,6;minHz,5;maxHz,1;compressFactor,3`animationStyleSlider,2;colorStyleSlider,1;analyserStyleSlider,0;analyserFftValueSlider,12;lineWidth,100;spinBaseSpeed,2;spinScaleSpeed,6;colorLightness,50;colorDimSettings,0;colorFade,0;colorRange,-25;colorBaseSpeed,4;colorScaleSpeed,6;minHz,5;maxHz,1;compressFactor,-1"
const defaultPresetLabels = "0=purpur,1=slime,2=jazz,3=RGB,4=uncompressed"

function stringifySetting(valueElement) {
    return valueElement.id + "," + valueElement.value
}

function stringifyPreset(staticValueElements, dynamicSliders) {
    let preset = ""
    
    let allElements = [...staticValueElements] // spread operator so that allElements copies values, but does not become the identical array object
    for (const i in dynamicSliders) {
        allElements.push(dynamicSliders[i][0])
    }
    
    for (const i in allElements) {
        element = allElements[i]
        setting = stringifySetting(element)
        preset += setting + ";"
    }
    preset = preset.slice(0, -1) // trim trailing semicolon
    return preset
}

function stringifySave(presetsArr) {
    let save = ""
    for (const i in presetsArr) {
        const presetStr = presetsArr[i]
        save += presetStr + "`"
    }
    save = save.slice(0, -1) // trim trailing `
    return save
}

function applySetting(settingStr) {
    const [elementId, elementValue] = settingStr.split(",")
    const element = document.getElementById(elementId)
    if (!element) {
        throw new Error('Could not find element in DOM: ' + elementId)
    }
    element.value = elementValue
}

function applyPreset(presetStr) {
    const settings = presetStr.split(";")
    for (i in settings){
        applySetting(settings[i])
    }
}

function reconstructFlagsString(flagsArr){
    let newFlagsStr = null
    flagsArr.forEach((flag, index) => {
        flagValue = flag.split("=")[1]
        newFlag = index + "=" + flagValue
        if (newFlagsStr === null) {
            newFlagsStr = newFlag
        } else {
            newFlagsStr += "," + newFlag
        }
    })
    return newFlagsStr
}

/* DOESN'T WORK + NOT USED  
function applySave(presetsStr) {
    let presets = presetsStr.split("`")
    applyPreset(presets[0])
}
*/


function fetchPresetValue(presetStr, id){
    const settingsArr = presetStr.split(";")
    for (i in settingsArr){
        const settingStr = settingsArr[i]
        const [elementId, elementValue] = settingStr.split(",")
        if (elementId == id) {
            return elementValue
        }
    }
    throw new Error('Failed to find "' + id + '" style')
}

function handlePresetChange() {
    localStorage.setItem("presetIndex", presetSlider.value)
    if (presets !== "") {
        const presetsArr = presets.split("`")
        const presetStr = presetsArr[presetSlider.value]

        const animationStyle = fetchPresetValue(presetStr, "animationStyleSlider")
        readAnimationSliderRequests(getAnimationStyles()[animationStyle][2])

        const colorStyle = fetchPresetValue(presetStr, "colorStyleSlider")
        readColorSliderRequests(getColorStyles()[colorStyle][2])

        const analyserStyle = fetchPresetValue(presetStr, "analyserStyleSlider")
        readAnalyserSliderRequests(getAnalyserStyles()[analyserStyle][2])

        applyPreset(presetStr)
    } else {
        // use style 0
        readAnimationSliderRequests(getAnimationStyles()[animationStyleSlider.value][2])
        readColorSliderRequests(getColorStyles()[colorStyleSlider.value][2])
        readAnalyserSliderRequests(getAnalyserStyles()[analyserStyleSlider.value][2])
        
        // without preset, can't set other variables
    }
    updateDynamicText()
}
presetSlider.addEventListener('input', handlePresetChange)

function init(){
    presetSlider.max = presets.split("`").length - 1
    presetSlider.value = localStorage.getItem("presetIndex")

    handlePresetChange()
}

let presets = localStorage.getItem("presets")

if (presets === null || presets === ""){
    if (defaultPresets && defaultPresetLabels){
        localStorage.setItem("presets", defaultPresets)
        localStorage.setItem("presetLabels", defaultPresetLabels)
        presets = localStorage.getItem("presets")
        presetSlider.setAttribute("data-dynamicTextFlags", localStorage.getItem("presetLabels"))
    } else {
        presets = ""
        presetSlider.setAttribute("data-dynamicTextFlags", "0=None")
    }
    init()
} else {
    presetSlider.setAttribute("data-dynamicTextFlags", localStorage.getItem("presetLabels"))
    init()
}



presetSaver.addEventListener('click', () => {
    const dynamicSliders = dynamicAnimationSliders.concat(dynamicColorSliders).concat(dynamicAnalyserSliders)
    const pendingPresetStr = stringifyPreset(staticValueElements, dynamicSliders)

    // insert preset at index above slider value
    const addPresetAt = presetSlider.value + 1
    const presetsArr = presets.split("`")
    presetsArr.splice(addPresetAt, 0, pendingPresetStr)
    presets = stringifySave(presetsArr)

    // update on preset change
    localStorage.setItem("presets", presets)
    presetSlider.max = presets.split("`").length - 1 // -1 so at length 1, selects max 0
    presetSlider.value++

    // insert new dynamic text flag
    const currentFlags = presetSlider.getAttribute("data-dynamicTextFlags")
    const addFlagAt = presetSlider.value // already adjusted up by 1
    let updatedFlags
    if (currentFlags == "0=None" || currentFlags == "") {
        updatedFlags = "0=" + presetNameInput.value
    } else {
        const currentFlagsArr = currentFlags.split(",")
        currentFlagsArr.splice(addFlagAt, 0, addFlagAt + "=" + presetNameInput.value)
        updatedFlags = reconstructFlagsString(currentFlagsArr)
    }
    presetSlider.setAttribute("data-dynamicTextFlags", updatedFlags)
    localStorage.setItem("presetLabels", updatedFlags)

    // save name for alert before clearing
    newFlagName = presetNameInput.value
    presetNameInput.value = ""
    
    handlePresetChange()
    customAlert("\u2713 Added: " + newFlagName)
})

presetReplacer.addEventListener('click', () => {
    if (presets) {
        // updated preset
        const dynamicSliders = dynamicAnimationSliders.concat(dynamicColorSliders).concat(dynamicAnalyserSliders)
        const pendingPresetStr = stringifyPreset(staticValueElements, dynamicSliders)

        // replace at correct index with updated preset
        const replaceAt = presetSlider.value
        const presetsArr = presets.split("`")
        presetsArr[replaceAt] = pendingPresetStr
        presets = stringifySave(presetsArr)

        // for the alert
        const previousFlag = presetSlider.getAttribute("data-dynamicTextFlags").split(",")[replaceAt]
        let newFlag = null

        // save to local storage
        localStorage.setItem("presets", presets)

        // update dynamic text flags if user specified a new name
        if (presetNameInput.value != "") {
            const currentFlags = presetSlider.getAttribute("data-dynamicTextFlags")
            const flagsArr = currentFlags.split(",")
            
            newFlag = replaceAt + "=" + presetNameInput.value
            flagsArr[replaceAt] = replaceAt + "=" + presetNameInput.value

            newFlagsStr = reconstructFlagsString(flagsArr)

            // save new flags
            presetSlider.setAttribute("data-dynamicTextFlags", newFlagsStr)
            localStorage.setItem("presetLabels", newFlagsStr)

            presetNameInput.value = ""
        }

        handlePresetChange()

        if (newFlag === null) {
            customAlert("\u2713 Updated: " + String(previousFlag).split("=")[1])
        } else {
            customAlert("\u2713 Replaced: " + String(newFlag).split("=")[1])
        }
    }
})

presetDeleter.addEventListener('click', () => {
    const pendingPresetsStr = presets
    if (pendingPresetsStr) {
        const affectedSince = presetSlider.value // preset value reflects where to splice / decrement indexes from.

        const pendingPresetsArr = pendingPresetsStr.split("`")
        pendingPresetsArr.splice(affectedSince, 1)
        presets = stringifySave(pendingPresetsArr)

        // update on preset change
        localStorage.setItem("presets", presets)
        presetSlider.max = presets.split("`").length - 1 // -1 so at length 1, selects max 0

        // splice corresponding index in preset slider's label flags
        const currentFlags = presetSlider.getAttribute("data-dynamicTextFlags")
        const flagsArr = currentFlags.split(",")
        const deletedFlag = flagsArr.splice(affectedSince, 1)

        // move down the indexes of all above data-dynamicTextFlags
        flagsArr.forEach((flag, index) => {
            if (index >= affectedSince) {
                const flagArr = flag.split("=")
                const strIndex = flagArr[0]
                const newFlag = String(Number(strIndex) - 1) + "=" + flagArr[1]
                flagsArr[index] = newFlag
            }
        })
        
        newFlagsStr = reconstructFlagsString(flagsArr)

        // if no presets set a flag for 0="no presets"
        if (presets === "") {
            presetSlider.setAttribute("data-dynamicTextFlags", "0=None")
        } else {
            presetSlider.setAttribute("data-dynamicTextFlags", newFlagsStr)
        }

        localStorage.setItem("presetLabels", newFlagsStr)

        handlePresetChange()
        customAlert("\u2713 Deleted: " + String(deletedFlag).split("=")[1])
    }
})
