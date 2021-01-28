var express = require('express');
const bodyParser = require('body-parser');
const shareFacebook = require('share-facebook');
const { shareTwitterURL } = require('share-twitter');
const util = require('util');
var app = express();

const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const rateLimit = require("express-rate-limit");
 

// Sets development variable to seperate development behavior from production.
const DEVELOPMENT = process.env.DEV === "true"; 

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 2 * 60 * 60 * 1000, // 2 hours
  max: 20 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use("/future/",limiter);


app.use(express.static(__dirname + '/public')); // exposes index.html, per below
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const got = require('got');
const prompt_template = `Q: Should I eat salad or popcorn?\nA: (A) You should eat a salad (B) You should eat popcorn\nQ: When should I go to sleep?\nA:(A) You should go to sleep now (B) You should go to sleep in two hours (C) You should go to sleep at midnight\nQ:`;

function formatAnswers(zeAnswers) {
    zeAnswers.shift();
    for (let i = 0; i < zeAnswers.length; i++) {
        if (zeAnswers[i].charAt(0) == " ") {
            zeAnswers[i] = zeAnswers[i].substring(1)
        }
        if (zeAnswers[i].charAt(zeAnswers[i].length - 1) == " ") {
            zeAnswers[i] = zeAnswers[i].substring(0, zeAnswers[i].length - 1)
        }
    }
    return zeAnswers;
}

const responseOnCFInput = "The stars urge you to seek help: here are some <a href='https://ssmumentalhealth.carrd.co/' target='_blank'>McGill</a> and <a href='https://studentcoronavirusrelief.carrd.co/' target='_blank'>Montreal</a> specific resources.";

/**
 * Function that uses GPT3 content filter to check if content is safe or not.
 * @param {string} content Content to be checked for unsafeness.
 * @returns {Promise<boolean>} Promise of safeness value. True if the content is safe, false otherwise.
 */
async function isContentSafe(content){
    const url = 'https://api.openai.com/v1/engines/content-filter-alpha-c4/completions';
    const params = {
        "prompt": `<|endoftext|>${content}\n--\nLabel:`,
        "max_tokens": 1,
        "temperature": 0.0,
        "top_p": 0
    };
    const headers = {
        'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    };

    try {
        const response = await got.post(url, { json: params, headers: headers }).json();
        
        DEVELOPMENT && console.log(`Content filter output is: '''${response.choices[0].text}'''`);
        if (response.choices[0].text === "2") {
            return false;
        }
        return true;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

/**
 * Function that uses GPT3 to complete a prompt.
 * @param {string} prompt Prompt to be completed.
 * @returns {Promise<string>} Promise of the completion.
 */
async function completeAnswers(prompt){
    {
        const url = 'https://api.openai.com/v1/engines/ada/completions';
        const params = {
            "prompt": prompt,
            "max_tokens": 30,
            "temperature": 0.7
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`,
        };

        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            let output = response.choices[0].text;
            // Prints output only if in development;
            DEVELOPMENT && console.log(`Output is: '''${output}'''`);
            return output;
        } catch (err) {
            //   console.log(err);
            console.log(err);
            throw err;
        }
    }
}

async function sendQuestion(prompt, callback) {
    let full_prompt = prompt_template + prompt + "\nA:";
    

    // Check if input is safe
    if (await isContentSafe(full_prompt)) {
        // Complete the prompt
        let output = await completeAnswers(full_prompt);

        output = output.split("\n")[0];
            
        // Check if output is safe
        if (await isContentSafe(output)){
            
            let answers = output.split(/\([A-Z]\)/);

            // This code simultaniously checks all possible answers prompt combinations for safeness and only 
            // Allows output to go through if they are all safe.
            let result;
            try {
                // Promise.all makes the asynchronous calls parallel.
                results = await Promise.all(answers.map((answer) => 
                {
                    DEVELOPMENT && console.log(`Checking combination: ${prompt}\n${answer}`);
                    return isContentSafe(prompt + "\n" + answer)
                }));
            } catch (err) {
                throw (err)
            }
             
            for (const safe of results){
                if (!safe){
                    console.log("Found unsafe question-answer combination, aborting");
                    callback.send(JSON.stringify([responseOnCFInput]));
                    return;
                }
            }
            //   console.log(output);
            callback.send(JSON.stringify(formatAnswers(answers)));
        }
        else{
            // Print output only if in development for privacy
            console.log("Content filter returned 2 on output" + (DEVELOPMENT ? `: ${output}` : ""));
            callback.send(JSON.stringify([responseOnCFInput]));
        }

    }
    else{
        // Print input only if in development for privacy
        console.log("Content filter returned 2 on input"  + (DEVELOPMENT ? `: ${full_prompt}` : ""));
        callback.send(JSON.stringify([responseOnCFInput]));
    }
}

//generates the share to facebook and twitter
function makeShare(infoObject) {
    if (infoObject.platform === "facebook") {
        let res = shareFacebook({
            quote: `Q: ${infoObject.question}. A: ${infoObject.answer}. Check out this website that makes decisions for you!`,
            href: 'https://inthestars.tech',
            redirect_uri: 'https://inthestars.tech',
            app_id: '461357091916957'
        })
        // console.log(res)
        return res;
    } else if (infoObject.platform === "twitter") {
        let res = shareTwitterURL({
            text: `Q: ${infoObject.question}. A: ${infoObject.answer}. Check out this website that makes decisions for you!`,
            url: 'https://inthestars.tech',
        })
        // console.log(res)
        return res;
    }
}

//route for the prediction
app.post('/future', async (req, res) => {
    let cleanRequest = DOMPurify.sanitize(req.body.text);
    // console.log(req.body.text)
    // res.send(req.body)
    // setTimeout(() => {  res.send(JSON.stringify( ["Yes, you totally should", "Nah, that does not sound like a good idea"]));}, 1000);
    // res.send(JSON.stringify(["hellop", "no"]));
    // setTimeout(() => sendQuestion(cleanRequest, res), 30000);
    sendQuestion(cleanRequest.substring(0, 150), res);
});

//route for share to twitter/facebook
app.post('/share', async (req, res) => {
    res.send(JSON.stringify(makeShare(req.body)));
});








app.listen(process.env.PORT); //this is for heroku
// app.listen(3000); //for local running