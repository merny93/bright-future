var express = require('express');
const bodyParser = require('body-parser');
    // gpt3Worker = require('./gpt3.js').Request; // see  template

var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const got = require('got');
const prompt_template = `Q: Should I eat salad or popcorn?\nA: (A) salad (B) popcorn\nQ: When should I go to sleep?\nA:(A) now (B) in two hours (C) at midnight\nQ:`;

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
        const url = 'https://api.openai.com/v1/engines/davinci/completions';
        const params = {
            "prompt": full_prompt,
            "max_tokens": 10,
            "temperature": 0.3
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
            callback.send(formatAnswers(answers));
        } catch (err) {
            //   console.log(err);
            callback.send(output)
        }
    })();
}


app.post('/future', async(req,res) =>{
    // console.log(req.body.text)
    // res.send(req.body)
    sendQuestion(req.body.text, res);
});

app.listen(3000)