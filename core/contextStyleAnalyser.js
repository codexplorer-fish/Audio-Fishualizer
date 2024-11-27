function getContextStyleAnalyser(){
    return {
        function: (analyser, customVals) => {
            const numValues = Number(customVals.analyserFftValueSlider) // trauma from javascript's implicit type casting
            const minDb = Number(customVals.analyserDbMinSlider)
            const dbRange = Number(customVals.analyserDbRangeSlider)
            const smoothness = Number(customVals.analyserSmoothnessSlider)

            analyser.smoothingTimeConstant = Math.pow(smoothness / 100, 1 / 2)
            
            analyser.minDecibels = minDb
            analyser.maxDecibels = minDb + dbRange

            let refreshDataArray = false
            if (analyser.fftSize != Math.pow(2, numValues)) {
                analyser.fftSize = Math.pow(2, numValues)
                refreshDataArray = true
            }

            return refreshDataArray
        },
        sliderRequests: [
            {id: "analyserFftValueSlider", name: "Resolution", min: 5, max: 15, default: 12},
            {id: "analyserDbMinSlider", name: "Min Db", min: -130, max: 0, default: -100},
            {id: "analyserDbRangeSlider", name: "Db Range", min: 2, max: 100, default: 70},
            {id: "analyserSmoothnessSlider", name: "Smoothness", min: 0, max: 100, default: 64},
        ]
    }
}