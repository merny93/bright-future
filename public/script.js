const targetVelocity = .005;
const factor = 50;
let velocity = {v : targetVelocity};
let speedTween;
let slowTween;
let timeout;
let answer = "";

speedTween  = new TWEEN.Tween(velocity).to({v : factor * targetVelocity}, 2000   ).easing(TWEEN.Easing.Quadratic.InOut);
slowTween   = new TWEEN.Tween(velocity).to({v : targetVelocity},  800).easing(TWEEN.Easing.Quadratic.InOut);
resetTween  = new TWEEN.Tween(velocity).to({v : targetVelocity},  300).easing(TWEEN.Easing.Quadratic.InOut);
rewindTween = new TWEEN.Tween(velocity).to({v : (-10*factor) * targetVelocity}, 200).easing(TWEEN.Easing.Quadratic.InOut);

function startSpeedup (){
    window.clearTimeout(timeout);
    resetTween.stop();
    slowTween.stop();
    rewindTween.stop();
    speedTween.start();
}

function endSpeedup (){
    window.clearTimeout(timeout);
    resetTween.stop();
    speedTween.stop();
    rewindTween.stop();
    slowTween.start();
}

function rewind(){
    window.clearTimeout(timeout);
    resetTween.stop();
    slowTween.stop();
    speedTween.stop();
    rewindTween.start();
    timeout = window.setTimeout(() => {
        slowTween.stop();
        speedTween.stop();
        rewindTween.stop();
        resetTween.start();
    }, 300)
}

const ErrorMsg = "Stars seem unavailable at the moment, please try again."

//BIG boi function that sends request to backend 
// gets choices back and chooses them based on the imgae hash
function submitQuestion() {
    //create the request
    //we are sending a post request with a return promise

     //get the input
    let input = document.getElementById('questionarea');
    let questionPrompt = input.value;
    if (questionPrompt.length == 0) {
        //no text entred so try again
        return
    }
    let data = { text: questionPrompt };
    //console.log(data)

    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/future", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.timeout = 4000;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("got the response")
            // Response
            let response = JSON.parse(this.responseText);
            if (response.length == 0){
                response = [ErrorMsg];
            }

            // console.log(response)
            toDataURL(
                'http://lwalab.phys.unm.edu/lwatv2/lwatv.png?nocache=1' + new Date().getTime(),
                function (dataUrl) {
                    let madeHash = dataUrl.hashCode();
                    // console.log('HASH:', madeHash)
                    displayResponse(questionPrompt, response, madeHash);
                    
                    //THIS IS WHERE THE OUTPUT IS
                    //curently logging to console
                });
        } else if (this.status == 429){
            displayResponse(questionPrompt, ["Did you think that calling your relatives overseas was expensive? Imagine how expensive long distance is to the stars. <a href='https://www.buymeacoffee.com/inthestars' target='_blank'>Buy us a coffee</a> to keep us afloat!"], 1);
        } else if (this.readyState == 4 && this.status >= 400){
            //bad response
            displayResponse(questionPrompt, [ErrorMsg], 1);
        }
    };

    xhttp.ontimeout = function(){
        displayResponse(questionPrompt, [ErrorMsg], 1);
    }
    //send it out
    xhttp.send(JSON.stringify(data));
    // input.value = "";
    //fade out the questions. rest is in the styling.js
    document.getElementById("querry").style.opacity = '0';
    //set fast to true 
    startSpeedup();

    // TODO 
    // whatever CSS class switching (fade out/in stuff) needs to happen

}

function displayResponse(questionPrompt, responseArray, hashVal){
    let starsChoice = Math.abs( hashVal% (responseArray.length));

    let finalResponse = responseArray[starsChoice];
    answer = finalResponse;
    //console.log('RESULT:', starsChoice);
    //console.log(responseArray);
    document.getElementById("answerholder").innerHTML = "<p class='questionholder'>"+questionPrompt+"</p><p>"+finalResponse+"</p>";
    //fade out its gonne handle the rest
    if (document.getElementById("loading").classList.contains('ready')){
        //the loading screen loaded in so we unload it
        document.getElementById("loading").style.opacity = '0';
        document.getElementById("loading").classList.remove('ready');
    } else {
        // we set the html already so the other function will handle
    }
}
  
//detect the enter submission
function onTestChange() {
    var key = window.event.keyCode;
    // If the user has pressed enter
    if (key === 13) {
        event.preventDefault();
        document.getElementById('questionarea').blur();
        document.getElementById("enter").click();
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
    //console.log("stars are unavailable");
    callback(makeid(10));
  }
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function scrollToFirst(){
    const firstPage = document.querySelector('#firstPage');
    firstPage.scrollIntoView({ block: "start", inline: "nearest", behavior : "smooth" });
}

function scrollToSecond(){
    const secondPage = document.querySelector('#secondPage');
    secondPage.scrollIntoView({ block: "start", inline: "nearest", behavior : "smooth" });
}

function scrollToThird(){
    const thirdPage = document.querySelector('#thirdPage');
    thirdPage.scrollIntoView({ block: "start", inline: "nearest", behavior : "smooth" });
}

///share to facebook button

function mediaShare(platformStr){
    //create the request
    //we are sending a post request with a return promise
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/share", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Response
            let response = JSON.parse(this.responseText);
            //console.log(response);
            window.open(response);    
        }
    };
    let data = {platform:platformStr, question: document.getElementById('questionarea').value, answer: answer};
    xhttp.send(JSON.stringify(data));
}