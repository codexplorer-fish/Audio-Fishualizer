function getContextStyleCanvas(){
    return {
        function: (canvas, customVals) => {
            const blur = Math.pow(customVals.canvasContextBlur, 2)
            const contrast =  Math.pow(customVals.canvasContextContrast, 2)*32 + 100

            canvas.style.filter = "blur(" + blur + "px) contrast(" + contrast + "%)"

            if (customVals.canvasContextContrast == 0){
                canvas.style.background = "unset"
            } else {
                canvas.style.background = "black"
            }
        },
        sliderRequests: [
            {id:"canvasContextBlur",name:"Blur",min:0,max:10,default:0},
            {id:"canvasContextContrast",name:"Deep Fry",min:0,max:10,default:0},
        ]
    }
}