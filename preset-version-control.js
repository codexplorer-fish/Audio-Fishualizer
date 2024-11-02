// recursive function that loops up through the preset versions
function versionControl(presetArg, version) {
    let preset = presetArg
    if (version == 'v1') {
        preset = preset.replaceAll('colorDimSettings', 'colorDim')
    } else if (version == 'v2') {
        return preset
    } else {
        throw new Error('invalid preset version: ' + version)
        return null
    }

    const nextVersion = 'v' + (Number(version.slice(1)) + 1)
    return versionControl(preset, nextVersion)
}