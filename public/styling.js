//in order of what happens
//fade in the splash 

const openingWait = 500; //wait one second before fade in
const splashLength = 1500; // length of splash message


//fades
//its in the on load cause or else the html doesnt load in time
window.addEventListener('load', function () {
    //get the things to fade and shite
    let splash = document.getElementById("welcome");
    let querryArea = document.getElementById("querry");
    let waitStars = document.getElementById('loading');
    let resultStars = document.getElementById('answer')
    //unhide the thing but make sure we cant actually see it
    splash.classList.remove('hidden');
    splash.style.opacity = '0';

    //now fade it in after 2 second
    setTimeout(function(){
        splash.style.opacity = '1';
    }, openingWait);

    //nowfor when its done loading in
    splash.addEventListener('transitionend', function () {
        //check if its fade in or fade out
        if (splash.style.opacity == '0'){
            //its time to fade in the text input thing
            splash.classList.add('hidden');
            querryArea.classList.remove('hidden');
            querryArea.style.opacity = '1';
        } else {
            //wait and then fade out
            setTimeout(function() {
                splash.style.opacity = '0'
            }, splashLength);
        }
    });
    //for when a question was sent to the server!
    querryArea.addEventListener('transitionend', function (){
        if (querryArea.style.opacity == '0'){
            //this means that the input was faded out
            querryArea.classList.add('hidden');
            //now fade in the waiting thing
            waitStars.classList.remove('hidden');
            waitStars.style.opacity = '1';
        }
    });
    waitStars.addEventListener('transitionend', function(){
        if (waitStars.style.opacity == "1"){
            if (document.getElementById("answerholder").innerHTML != ""){
                //answer already there when it loads
                //fade out
                waitStars.style.opacity = '0';
            } else {
                //let the other function know that it has to unload it
                waitStars.classList.add('ready');
            }
        } else {
            //it was faded out so load in the answer
            waitStars.classList.add('hidden');
            resultStars.classList.remove('hidden');
            resultStars.style.opacity = '1';
            endSpeedup();
        }
        
    });
    resultStars.addEventListener('transitionend', function() {
        // console.log("hi")
        if (resultStars.style.opacity == "1"){
            //faded in
        } else {
            //fadded out
            resultStars.classList.add('hidden');
            document.getElementById("answerholder").innerHTML = "";
            querryArea.classList.remove('hidden');
            querryArea.style.opacity = '1';
            document.getElementById("questionarea").focus();
        }
    });
}, false);


function resetQuestion(){
    //fadeout answer box
    rewind();
    document.getElementById("answer").style.opacity = "0";
    document.getElementById("questionarea").value = "";
}


// focus on the text area when page is entered
window.addEventListener('load', function () {
    document.getElementById("questionarea").focus();
}, false);

// resize textarea 
var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on' + event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}

window.onload = function () {
    let text = document.getElementById('questionarea');
    function resize() {
        text.style.height = 'auto';
        text.style.height = text.scrollHeight + 'px';
    }
    /* 0-timeout to get the already changed text */
    function delayedResize() {
        window.setTimeout(resize, 0);
    }
    observe(text, 'change', resize);
    observe(text, 'cut', delayedResize);
    observe(text, 'paste', delayedResize);
    observe(text, 'drop', delayedResize);
    observe(text, 'keydown', delayedResize);

    text.focus();
    text.select();
    resize();
}

//refresh the image

window.addEventListener('load', refreshMap);
function refreshMap(){

    let imgSrc = document.getElementById("mapimage").src
    const scrollable = document.querySelector('#scrollable');
    let y = scrollable.scrollTop;
    if (y <= window.innerHeight / 2){
        // On page 1
    } else if (y <= 3 * window.innerHeight / 2) {
        // On page 2
        document.getElementById("mapimage").src = imgSrc + new Date().getTime();
    } else {
        // On page 3
    }
    setTimeout(refreshMap, 2000);
}

