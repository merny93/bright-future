## In the Stars

Ask your burning questions to the stars and get answers from ML and radio waves.

## What is

Extract possible answers from you prompts with gpt-3 and then use live telescope data from LWA as a seed to decide which answer to return. Rendering done with three.js

## How to run

Check out a version without GPT-3 connected to it at inthestars.tech (without the ML it can only answer yes or no questions)

To run with ML you need beta access to GPT-3 API and then you can launch the server with (provided you have the dependancies):

```
npm init --yes
export OPENAI_SECRET_KEY='YOUR_API_KEY_HERE'
node server.js
```
