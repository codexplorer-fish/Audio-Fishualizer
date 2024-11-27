

function setText(_slider, _textNode){
    const flagsJson = _slider.getAttribute("data-dynamicTextFlags")
    if (flagsJson !== null) {
        const flagsObj = JSON.parse(flagsJson)
        const extraText = flagsObj[_slider.value]
        if (extraText !== undefined) {
            _textNode.textContent = _slider.getAttribute("data-dynamicTextLabel") + ": " + extraText
            return
        }
    }
    // fallback if matching flag cannot be found for slider
    _textNode.textContent = _slider.getAttribute("data-dynamicTextLabel") + ": " + _slider.value
}

function updateDynamicText(){
    const dynamicTextContainersArray = Array.from(document.getElementsByClassName('dynamicTextContainer'))
    dynamicTextContainersArray.forEach(dtc => {
        // search children to find slider and text, and call setText on them.
        const nodes = dtc.children
        const arrayNodes = Array.from(nodes)
        
        let dynamicTextNode = undefined
        for (const i in arrayNodes){
            if (arrayNodes[i].className.includes("dynamicText")){
                dynamicTextNode = arrayNodes[i]
                break
            }
        }
        let sliderNode = undefined
        for (const i in arrayNodes){
            if (arrayNodes[i].className.includes("slider")){
                sliderNode = arrayNodes[i]
                break
            }
        }

        if (dynamicTextNode === undefined) {
            throw new Error("could not find dynamic text node within container: " + nodes)
        } else if (sliderNode === undefined) {
            throw new Error("could not find slider node within container: " + nodes)
        }

        setText(sliderNode, dynamicTextNode)
    });
}
updateDynamicText()
