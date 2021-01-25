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
async function sendQuestion(prompt, callback) {
    let full_prompt = prompt_template + prompt + "\nA:";
    let badInput = false;
    await (async () => {
        const url = 'https://api.openai.com/v1/engines/content-filter-alpha-c4/completions';
        const params = {
            "prompt": `<|endoftext|>${full_prompt}\n--\nLabel:`,
            "max_tokens": 1,
            "temperature": 0.0,
            "top_p": 0
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`,
        };

        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            console.log(`Content filter output: ${response.choices[0].text}`);
            if (response.choices[0].text === "2") {
                badInput = true;
            }
        } catch (err) {
            //   console.log(err);
            console.log(err);
        }
    })();
    if (badInput) {
        callback.send(JSON.stringify([responseOnCFInput]));
        return;
    }
    (async () => {
        const url = 'https://api.openai.com/v1/engines/ada/completions';
        const params = {
            "prompt": full_prompt,
            "max_tokens": 30,
            "temperature": 0.7
        };
        const headers = {
            'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`,
        };

        try {
            const response = await got.post(url, { json: params, headers: headers }).json();
            let output = response.choices[0].text;
            console.log(`Output is: '''${output}'''`)
            output = output.split("\n")[0]
            let answers = output.split(/\([A-Z]\)/);

            //   console.log(output);
            callback.send(JSON.stringify(formatAnswers(answers)));
        } catch (err) {
            //   console.log(err);
            console.log(err);
        }
    })();
}

//generates the share to facebook and twitter
function makeShare(infoObject) {
    if (infoObject.platform == "facebook") {
        let res = shareFacebook({
            quote: `Q: ${infoObject.question}. A: ${infoObject.answer}. Check out this website that makes decisions for you!`,
            href: 'https://inthestars.tech',
            redirect_uri: 'https://inthestars.tech',
            app_id: '461357091916957'
        })
        // console.log(res)
        return res
    } else if (infoObject.platform == "twitter") {
        let res = shareTwitterURL({
            text: `Q: ${infoObject.question}. A: ${infoObject.answer}. Check out this website that makes decisions for you!`,
            url: 'https://inthestars.tech',
        })
        // console.log(res)
        return res
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
    sendQuestion(cleanRequest, res);
});

//route for share to twitter/facebook
app.post('/share', async (req, res) => {
    res.send(JSON.stringify(makeShare(req.body)));
});








app.listen(process.env.PORT); //this is for heroku
// app.listen(3000); //for local running