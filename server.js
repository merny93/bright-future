var express = require('express');
const bodyParser = require('body-parser');
const shareFacebook = require('share-facebook');
var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const got = require('got');
const prompt_template = `Q: Should I eat salad or popcorn?\nA: (A) You should eat a salad (B) You should eat popcorn\nQ: When should I go to sleep?\nA:(A) You should go to sleep now (B) You should go to sleep in two hours (C) You should go to sleep at midnight\nQ:`;

function formatAnswers(zeAnswers) {
    zeAnswers.shift();
    for (let i=0; i<zeAnswers.length; i++) {
        if (zeAnswers[i].charAt(0) == " ") {
            zeAnswers[i] = zeAnswers[i].substring(1)
        }
        if (zeAnswers[i].charAt(zeAnswers[i].length-1) == " ") {
            zeAnswers[i] = zeAnswers[i].substring(0,zeAnswers[i].length-1)
        }
    }
    return zeAnswers;
}


function sendQuestion(prompt, callback) {
    let full_prompt = prompt_template + prompt + "\nA:";
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
            console.log(output)
            output = output.split("\n")[0]
            let answers = output.split(/\([A-Z]\)/);

            //   console.log(output);
            callback.send(JSON.stringify(formatAnswers(answers)));
        } catch (err) {
            //   console.log(err);
            callback.send(output)
        }
    })();
}

function makeShare(infoObject){
    if (infoObject.platform == "facebook"){
        let res = shareFacebook({
            quote: `
            Q: ${infoObject.question} 
            A: ${infoObject.answer}
            
            Check out this webiste that makes decisions for you!
            `,
            href: 'https://inthestars.tech',
            redirect_uri: 'https://inthestars.tech',
            app_id: '461357091916957'
        })
        // console.log(res)
        return res
    } else if (infoObject.platform == "twitter"){
        let res = shareFacebook({
            text: `
            Q: ${infoObject.question} 
            A: ${infoObject.answer}
            
            Check out this webiste that makes decisions for you!
            `,
            url: 'https://inthestars.tech'
        })
        // console.log(res)
        return res
    }
}

//route for the prediction
app.post('/future', async(req,res) =>{
    // console.log(req.body.text)
    // res.send(req.body)
    setTimeout(() => {  res.send(JSON.stringify( ["Yes Daddy, I will do it", "No! I have been a naughty boi"]));}, 1000);
    // res.send(JSON.stringify(["hellop", "no"]));
    // sendQuestion(req.body.text, res);
});

app.post('/share', async(req,res) =>{
    
    res.send(JSON.stringify(makeShare(req.body)));
});

app.listen(3000)