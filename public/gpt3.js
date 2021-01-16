const got = require('got');
const prompt = `Q: Should I eat salad or popcorn?\nA: (A) salad (B) popcorn\nQ: When should I go to sleep?\nA:(A) now (B) in two hours (C) at midnight\nQ:`;

(async () => {
  const url = 'https://api.openai.com/v1/engines/davinci/completions';
  const params = {
    "prompt": prompt,
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
  } catch (err) {
    console.log(err);
  }
})();