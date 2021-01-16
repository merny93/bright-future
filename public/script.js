importScripts('hash.js');


let input = document.getElementById('question');



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
    // TODO WHATEVER NEEDS TO HAPPEN WHEN CLICKED 
}

// // Execute a function when the user releases a key on the keyboard
// input.addEventListener("keyup", function (event) {
//     // Number 13 is the "Enter" key on the keyboard
//     if (event.keyCode === 13) {
//         // Cancel the default action, if needed
//         event.preventDefault();
//         // Trigger the button element with a click
//         document.getElementById("button").click();
//     }
// }); 


