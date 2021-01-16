//in order of what happens
//fade in the splash 

//fades
//its in the on load cause or else the html doesnt load in time
window.addEventListener('load', function () {
    //get the things to fade and shite
    let splash = document.getElementById("welcome");
    let querryArea = document.getElementById("querry");
    console.log(splash)
    //unhide the thing but make sure we cant actually see it
    splash.classList.remove('hidden');
    splash.style.opacity = '0';

    //now fade it in after 2 second
    setTimeout(function(){
        splash.style.opacity = '1';
        console.log(splash)
    }, 2000);

    //nowfor when its done loading in
    splash.addEventListener('transitionend', function () {
        console.log("wopty");
        //check if its fade in or fade out
        if (splash.style.opacity == '0'){
            //its time to fade in the text input thing
            splash.classList.add('hidden');
            querryArea.classList.remove('hidden');
            querryArea.style.opacity = '1';
        } else {
            //fade me out in 5 seconds
            setTimeout(function() {
                splash.style.opacity = '0'
            }, 5000);
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
