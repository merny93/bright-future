let input = document.getElementById('question');

function submitQuestion() {
    console.log("submitted")
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/future", true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        // Response
        var response = this.responseText;
        //serve the shit here!
        console.log(response)
    }
    };
    var data = {name:'yogesh',salary: 35000,email: 'yogesh@makitweb.com'};
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


