function dataPipeline_getAnalyserStyles() {
    let analyserStyles = new Object
    analyserStyles['name'] = "Analyser"
    analyserStyles['referenceOrder'] = [
        'data_analyse_compressing'
    ]
    analyserStyles['data_analyse_compressing'] = {
        name: 'Compressing', 
        function: (dataArray, sampleRate, customVals) => { // transform fft byte frequency data so that high frequencies are compressed.
            const minHz = Math.pow(2, customVals.minHz)
            const maxHz = customVals.maxHz * 5000
            const rawFactor = customVals.compressFactor
            let adjustedFactor
            if (rawFactor == -1) { // set factor to 0 if slider is at -1
                adjustedFactor = 0
            } else { // adjust raw factor data by a power for exponential results
                adjustedFactor = Math.pow(2, rawFactor) / 10
            }
            
            let newArray = []

            // start at the index equivilant to minHz
            let dataIndex = Math.round(dataArray.length * (minHz/(sampleRate/2))) // something something sampling rate needs to be halfed to properly correlate with hertz values

            arrayloop:
            while (dataIndex < dataArray.length) {
                // calculate number of indexes to compress into one index
                let compressNum = Math.pow(1 + (adjustedFactor/10), newArray.length)

                compressNum = Math.ceil(compressNum) // compressNum should never be 0 or less, or an infinite loop can happen

                // get x number of indexes, find highest, and append
                let hiValue = 0
                while (compressNum > 0) {
                    if (dataArray[dataIndex] > hiValue) {
                        hiValue = dataArray[dataIndex]
                    }
                    dataIndex++
                    compressNum--

                    if (dataIndex >= dataArray.length){ // escape if all array indexes are exhausted while still in loop
                        break arrayloop
                    }
                    if (dataIndex/dataArray.length >= maxHz/(sampleRate/2)){ // escape if array index reaches equivilant max hz
                        break arrayloop
                    }
                }
                
                newArray.push(hiValue)
            }

            // add the rest of the dataArray Indexes, compressed into a single data point
            let hiValue = 0
            while (dataIndex < dataArray.length) { // escape when all array indexes are exhausted
                if (dataArray[dataIndex] > hiValue) {
                    hiValue = dataArray[dataIndex]
                }
                dataIndex++
            }
            newArray.push(hiValue)

            return Uint8Array.from(newArray)
        },
        sliderRequests: [
            {id: "minHz", name: "Min Hz", min: 0, max: 8, default: 5, labels: {1: 2, 2: 4, 3: 8, 4: 16, 5: 32, 6: 64, 7: 128, 8: 256}},
            {id: "maxHz", name: "Max Hz", min: 1, max: 4, default: 1, labels: {1: "5k", 2: "10k", 3: "15k", 4: "20k"}},
            {id: "compressFactor", name: "Low Hz Focus", min: -1, max: 10, default: 3},
        ]
    }

    return analyserStyles
}