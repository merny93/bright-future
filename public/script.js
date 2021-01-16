importScripts('hash.js');


let input = document.getElementById('questionarea');



function submitQuestion() {
    console.log("submitted")
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/future", true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Response
        let response = JSON.parse(this.responseText);
        // console.log(response)
        toDataURL(
            'http://lwalab.phys.unm.edu/lwatv2/lwatv.png?nocache=1610765785012',
            function(dataUrl) {
                let starsChoice = dataUrl.hashCode()%(response.length)
                console.log('RESULT:', response[starsChoice])
            });
        //serve the shit here!
    }
    };
    let data = {text:'When shoud Raffi go to sleep?'};
    xhttp.send(JSON.stringify(data));

    document.getElementById("questionarea").value = "";
}


function onTestChange() {
    var key = window.event.keyCode;
    // If the user has pressed enter
    if (key === 13) {
        event.preventDefault();
        document.getElementById("button").click();
    }
}


