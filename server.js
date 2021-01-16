var express = require('express');
const bodyParser = require('body-parser');
    // gpt3Worker = require('./gpt3.js').Request; // see  template

var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const got = require('got');
const prompt_template = `Q: Should I eat salad or popcorn?\nA: (A) salad (B) popcorn\nQ: When should I go to sleep?\nA:(A) now (B) in two hours (C) at midnight\nQ:`;


sendQuestion = function(prompt){
  let full_prompt = prompt_template + prompt + "\nA:" 
  (async () => {
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
      "prompt": full_prompt,
      "max_tokens": 10,
      "temperature": 0.7
    };
    const headers = {
      'Authorization': `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    };

    try {
      const response = await got.post(url, { json: params, headers: headers }).json();
      output = `${prompt}${response.choices[0].text}`;
      console.log(output);
      return output
    } catch (err) {
      console.log(err);
      return (err)
    }
  })();
}


app.post('/future', function(req,res){
    console.log(req.body)
    res.send(req.body)
    res.send(sendQuestion(req.body.text));
});

app.listen(3000)