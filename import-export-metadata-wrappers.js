const presetVersion = 'v1'

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