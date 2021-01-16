
//BIG boi function that sends request to backend 
// gets choices back and chooses them based on the imgae hash
function submitQuestion() {
    //create the request
    //we are sending a post request with a return promise
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/future", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Response
            let response = JSON.parse(this.responseText);
            // console.log(response)
            toDataURL(
                'http://lwalab.phys.unm.edu/lwatv2/lwatv.png?nocache=1610765785012',
                function (dataUrl) {
                    let starsChoice = dataUrl.hashCode() % (response.length);
                    let finalResponse = response[starsChoice]
                    console.log('RESULT:', finalResponse);
                    document.getElementById("answer").innerHTML = finalResponse;
                    //THIS IS WHERE THE OUTPUT IS
                    //curently logging to console
                });
        }
    };
    //get the input
    let input = document.getElementById('questionarea');
    let questionPrompt = input.value;
    if (questionPrompt.length == 0) {
        //no text entred so try again
        return
    }
    let data = { text: questionPrompt };
    console.log(data)

    //send it out
    xhttp.send(JSON.stringify(data));
    console.log("submitted");
    input.value = "";

    // TODO 
    // whatever CSS class switching (fade out/in stuff) needs to happen
}
  
//detect the enter submission
function onTestChange() {
    var key = window.event.keyCode;
    // If the user has pressed enter
    if (key === 13) {
        event.preventDefault();
        document.getElementById("button").click();
    }
}

// hash function 
String.prototype.hashCode = function () {
    let hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (let i = 0; i < this.length; i++) {
        let char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

//load in the sky data and move it to a canvas
//read it in as a string of bytes and output
function toDataURL(src, callback, outputFormat) {
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext('2d');
    let dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    console.log("stars are unavailable");
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

