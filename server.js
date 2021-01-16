var express = require('express');
    // gpt3Worker = require('./gpt3.js').Request; // see  template

var app = express();

app.use(express.static(__dirname + '/public')); // exposes index.html, per below

// app.get('/request', function(req, res){
//     // run your request.js script
//     // when index.html makes the ajax call to www.yoursite.com/request, this runs
//     // you can also require your request.js as a module (above) and call on that:
//     res.send(list.getList()); // try res.json() if getList() returns an object or array
// });



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
    res.send(sendQuestion(req));
});

app.listen(3000)