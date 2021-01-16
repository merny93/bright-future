//in order of what happens
//fade in the splash 

const openingWait = 1000; //wait one second before fade in
const splashLength = 3000; // length of splash message


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
            console.log("i triggered");
            //this means that the input was faded out
            querryArea.classList.add('hidden');
            //now fade in the waiting thing
            waitStars.classList.remove('hidden');
            waitStars.style.opacity = '1';
        }
    });
    waitStars.addEventListener('transitionend', function(){
        if (resultStars.classList.contains('done')){
            //fade right back out
            console.log("need to remove loading");
            waitStars.style.opacity = '0';
            resultStars.classList.remove('done');
            resultStars.classList.add("hidden");
        } else if (waitStars.style.opacity == '0'){
            //it has been faded out
            console.log("hid weight")
            waitStars.classList.add('hidden');
            //fade in the answer
            resultStars.classList.remove('hidden');
            resultStars.style.opacity = '1';
        }
    });
}, false);


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
