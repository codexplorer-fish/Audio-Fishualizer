const staticValueElements = [ // all static elements with a .value attribute that want their value to be saved
    animationStyleSlider, 
    colorStyleSlider, 
    analyserStyleSlider,
    analyserFftValueSlider,
    analyserDbMinSlider,
    analyserDbMaxSlider,
    analyserSmoothnessSlider
]

const presetVersion = 'v1'

function getPossiblePresets () {
    let possiblePresets = [] // [id, id, ...]

    staticValueElements.forEach((slider) => {
        possiblePresets.push(slider.id)
    })

    const dynamicStyles = getAnimationStyles().concat(getColorStyles()).concat(getAnalyserStyles())
    dynamicStyles.forEach((style) => {
        const flagsStr = style[2]
        if (flagsStr) {
            const flagsArr = flagsStr.split(';')
            flagsArr.forEach((flag) => {
                const flagId = flag.split('.').at(0)
                possiblePresets.push(flagId)
            })
        }
    })

    return possiblePresets
}



function savesCharCheck(str){
    if (str.includes(';') || str.includes('=') || str.includes(',') || str.includes('`')){
        return true
    } else {
        return false
    }
}

function flagsCharCheck(str){ // presetSlider's dynamicTextFlags
    if (str.includes(';') || str.includes('.')){
        return true
    } else {
        return false
    }
}

function presetFormatCheck(presetStr, possiblePresets = getPossiblePresets()){
    const presetArr = presetStr.split(';')

    // ensure presetArr includes these elements:
    const scavenger = [animationStyleSlider.id, colorStyleSlider.id, analyserStyleSlider.id]

    for (let i = 0; i < presetArr.length; i++){
        const [id, value] = presetArr[i].split(',')
        if (!possiblePresets.includes(id) || isNaN(value)){
            return false
        }
        for (let i = 0; i < scavenger.length; i++){
            if (id == scavenger[i]){
                scavenger.splice(i, 1)
            }
        }
    }
    if (scavenger.length == 0){
        return true
    } else {
        return false
    }
}

function saveFormatCheck(saveStr){
    const possiblePresets = getPossiblePresets() // pre calculate to save resources. actual effect untested, but it's a pretty nested loop

    const presetsArr = saveStr.split('`')

    for (let i = 0; i < presetsArr.length; i++){
        if (!presetFormatCheck(presetsArr[i], possiblePresets)) {
            return false
        }
    }
    return true
}

function addPresetMetadata(presetStr, index){
    const sliderFlags = presetSlider.getAttribute('data-dynamicTextFlags')
    const flagsArr = sliderFlags.split(',')
    const flag = flagsArr[index]
    const name = flag.split('=')[1]

    presetStr += ';' + name + ';' + presetVersion
    return presetStr
}

function addSaveMetadata(saveStr){
    const presetsArr = saveStr.split('`')
    let newSaveStr = ""
    presetsArr.forEach((preset, index) => {
        if (newSaveStr === "") {
            newSaveStr = addPresetMetadata(preset, index)
        } else {
            newSaveStr += "`" + addPresetMetadata(preset, index)
        }
    })
    return newSaveStr
}

function extractPresetMetadata(presetStr){
    const presetArr = presetStr.split(';')
    const [presetName, version] = presetArr.splice(-2, 2)
    let newPresetStr = ""
    presetArr.forEach(setting => {
        if (newPresetStr === "") {
            newPresetStr = setting
        } else {
            newPresetStr += ";" + setting
        }
    });

    newPresetStr = versionControl(newPresetStr, version)

    return [newPresetStr, presetName, version]
} 

function extractSaveMetadata(saveStr){
    const presetsArr = saveStr.split("`")

    let extractedPresetsArr = []
    presetsArr.forEach((rawPresets) => {
        extractedPresetsArr.push(extractPresetMetadata(rawPresets))
    })

    let presetsStr = ""
    let sliderFlags = ""
    extractedPresetsArr.forEach(([preset, name, version], index) => {
        if (presetsStr === "") {
            presetsStr = preset
            sliderFlags = "0=" + name
        } else {
            presetsStr += '`' + preset
            sliderFlags += ',' + index + '=' + name
        }
    })

    return [presetsStr, sliderFlags]
}