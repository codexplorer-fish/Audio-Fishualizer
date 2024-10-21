


function setText(_slider, _textNode){
    const flagsStr = _slider.getAttribute("data-dynamicTextFlags")
    if (flagsStr !== null) {
        const flags = flagsStr.split(",")
        for (i in flags) {
            const flag = flags[i]
            const [value, extraText] = flag.split("=")
            if (_slider.value == value) {
                _textNode.textContent = _slider.getAttribute("data-dynamicTextLabel") + ": " + extraText
                return // match found, finished setting text
            }
        }
    }
    _textNode.textContent = _slider.getAttribute("data-dynamicTextLabel") + ": " + _slider.value
}


// curry the setText function for the event listeners so that I can pass arguments into the function
const curriedSetText = function(_slider, _textNode){
    return function curriedFunction(e){
        setText(_slider, _textNode)
    }
}


const dynamicTextContainersArray = Array.from(dynamicTextContainers)
dynamicTextContainersArray.forEach(dtc => {
    // search children to find dynamic text and slider elements
    const nodes = dtc.children
    const arrayNodes = Array.from(nodes)
    
    let dynamicTextNode
    for (const i in arrayNodes){
        if (arrayNodes[i].className.includes("dynamicText")){
            dynamicTextNode = arrayNodes[i]
            break
        }
    }
    let sliderNode
    for (const i in arrayNodes){
        if (arrayNodes[i].className.includes("slider")){
            sliderNode = arrayNodes[i]
            break
        }
    }

    // then, set up listener to update dynamic text with slider
    setText(sliderNode, dynamicTextNode)
    sliderNode.addEventListener('input', curriedSetText(sliderNode, dynamicTextNode))
});

function setupDynamicSliderText(slidersArr){
    for (const i in slidersArr) {
        const slider = slidersArr[i][0]
        const text = slidersArr[i][1]

        setText(slider, text)
        slider.addEventListener('input', curriedSetText(slider, text))
    }
}

function deleteDynamicSliderTextListeners(slidersArr){
    for (const i in slidersArr) {
        const slider = slidersArr[i][0]

        slider.removeEventListener('input', curriedSetText)
    }
}


function updateDynamicText(){
    // essentially <dynamic text containers loop (dynamicTextContainersArray.forEach)> and setupDynamicSliderText, just without the event listener. used to manually update slider text
    dynamicTextContainersArray.forEach(dtc => {
        const nodes = dtc.children
        const arrayNodes = Array.from(nodes)
        
        let dynamicTextNode
        for (const i in arrayNodes){
            if (arrayNodes[i].className.includes("dynamicText")){
                dynamicTextNode = arrayNodes[i]
                break
            }
        }
        let sliderNode
        for (const i in arrayNodes){
            if (arrayNodes[i].className.includes("slider")){
                sliderNode = arrayNodes[i]
                break
            }
        }

        setText(sliderNode, dynamicTextNode)
    });

    function setTextForSliderTextArr(sliderTextArr){
        for (const i in sliderTextArr) {
            const slider = sliderTextArr[i][0]
            const text = sliderTextArr[i][1]
    
            setText(slider, text)
        }
    }
    setTextForSliderTextArr(dynamicAnimationSliders)
    setTextForSliderTextArr(dynamicColorSliders)
    setTextForSliderTextArr(dynamicAnalyserSliders)
}

function initStyleSliderFlags(styleSlider, styles){
    let flags = ""
    const analyserStyles = styles
    analyserStyles.forEach((style, index) => {
        flags += index + "=" + style[0] + ","
    })
    flags = flags.slice(0, -1) // remove trailing semicolon
    styleSlider.setAttribute("data-dynamicTextFlags", flags)
}

initStyleSliderFlags(animationStyleSlider, getAnimationStyles())
initStyleSliderFlags(colorStyleSlider, getColorStyles())
initStyleSliderFlags(analyserStyleSlider, getAnalyserStyles())
