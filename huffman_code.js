// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/1-hello-world

$w.onReady(function () {
    expandAndCollapse();
    $w('#button1').onClick(buttonClick);
    $w('#frequencyCountRepeater').data = []
    $w('#sortRepeater').data = []
    $w('#mergeAndSortRepeater').data = []
    $w('#table1').rows = []       
})



function expandAndCollapse() {
    $w("#huffmanInput").onInput((event) => {
        let myString = event.target.value;
        //console.log(myString);
        if (myString) { 
            $w("#button1").enable();
        }
        else {
            $w("#button1").disable();
        }
    });
}


function buttonClick() {
        $w('#step1').expand()
        $w('#step2').expand()
        
        const huffmanInput = String($w("#huffmanInput").value);
        
        var result =  frequency(huffmanInput);
        constructRepeater(result);
        
        var secondStep = sortfreq(result);
        //console.log(secondStep);
        const tree = buildtree(secondStep);  
        //console.log(tree)   
                
        var tableData = [];
        var sumOfSize = 0;
        for (let k of Object.keys(result)){
            sumOfSize += (code[k].length * result[k])
            tableData.push(
                {
                    character: k,
                    frequency:String(result[k]),
                    codes: code[k],
                    size: `${result[k]} * ${code[k].length} = ${code[k].length * result[k]}`
                })
        }
        $w("#table1").rows = tableData;

        const numOfCharacters = Object.keys(result).length;
        const sumOfCharacters = numOfCharacters * 1;
        const sumOfFrequencies = $w('#huffmanInput').value.length;
        const encodedLength = sumOfCharacters + sumOfFrequencies + sumOfSize
        $w('#numOfCharacters').text = String(numOfCharacters);
        $w('#sumOfCharacters').text = String(sumOfCharacters) + " bits";
        $w('#sumOfFrequencies').text = String(sumOfFrequencies) + " bits";
        $w('#sumOfSize').text = String(sumOfSize) + " bits";
        $w('#encodedLength').text = `${sumOfCharacters} + ${sumOfFrequencies} + ${sumOfSize} = ${encodedLength} bits`;
        $w('#noEncodingLength').text = `${sumOfFrequencies} x 1 = ${sumOfFrequencies * 1} bits`
        
        $w('#group15').expand()
        
        buildCodeLength(sumOfSize,sumOfFrequencies);
    }



function constructRepeater(res){
    var myData = []
    var idCounter = 0;
    for (let k of Object.keys(res)) {
            myData.push({_id:String(idCounter++),letter:k,fre:res[k]})
    }
    //console.log(myData);
    
    $w('#frequencyCountRepeater').onItemReady(($item, itemData, itemIndex) => {
        $item('#letter').text = itemData.letter;
        $item('#firstRepeaterFrequency').text = String(itemData.fre);
        $item('#text20').text = String(itemData.fre);         
    });
    
    $w('#frequencyCountRepeater').data = myData;
    
    let sortData = [...myData];
    sortData.sort((firstItem, secondItem) => firstItem.fre - secondItem.fre);
    
    $w('#sortRepeater').onItemReady(($item, itemData) => {
        $item('#sortLetter').text = itemData.letter;
        $item('#sortRepeaterFrequency').text = String(itemData.fre);
        $item('#text21').text = String(itemData.fre);
    })
    $w('#sortRepeater').data = sortData;
    
    
}

function frequency(str) {
    var freqs = {};
    for (var i=0; i<str.length;i++) {
        var character = str.charAt(i);
        if (freqs[character]) {
           freqs[character]++;
        } else {
           freqs[character] = 1;
        }
    }
    return freqs;
}


function sortfreq(freq){
    var letters = [];
    for (var ch in freq){
        letters.push([freq[ch],ch]);
    }
    return letters.sort((a,b) => a[0] - b[0]);
}



function buildtree(sortedStep){
    //console.log("Letters",sortedStep);
    var mergeSortId = 1;
    var stepNumber = 3;
    var mergeSortData = []
    
    $w('#mergeAndSortRepeater').onItemReady(($item, itemData) => {
        $item('#stepNumber').text = String(itemData.stepNumber)
        $item('#stepDescription').text = itemData.stepDescription
        //$item('#repeater1').data = itemData.nestedData;
    })
    
    while(sortedStep.length>1){
        //console.log(sortedStep)
        var leasttwo = [sortedStep[0][1],sortedStep[1][1]];
        var therest = sortedStep.slice(2,sortedStep.length);
          
        var xyz = [];
        if (therest.length >= 1) {
            therest.forEach(element => {xyz.push(element[0])}); //CHANGE
        }
          
        var combfreq = sortedStep[0][0] + sortedStep[1][0];
        var combfreqArray = [sortedStep[0][0] + sortedStep[1][0]];
        var finalArray = (xyz.concat(combfreqArray)).sort(function(a, b){return a-b})
        
        //console.log(finalArray)
        mergeSortData.push(
            {_id:String(mergeSortId++),
        stepNumber:String(stepNumber++),
        stepDescription:'Adding the minimum two frequencies i.e '
                        + String(sortedStep[0][0]) 
                        + ' and ' 
                        + String(sortedStep[1][0]) 
                        + '. New order becomes '
                        + finalArray,
        //nestedData:nestedData
        }
        )

        sortedStep = therest;
        
        var two = [combfreq,leasttwo];
        
        sortedStep.push(two);
        sortedStep.sort((a,b) => a[0] - b[0]);
        console.log(sortedStep)
    }
    $w('#mergeAndSortRepeater').data = mergeSortData;
    return sortedStep[0][1];
}

function buildCodeLength(s,f) {
    $w('#text52').text = `${s} / ${f}`;
    $w('#text54').text = String((s/f).toFixed(2)) + " bits";
    $w('#group16').expand();
}
