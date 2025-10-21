// ./src/config.js

import dotenv from 'dotenv';
dotenv.config();

let _config = {
    openAI_apiKey: process.env.OPENAI_API_KEY,
    openAI_api: "https://api.openai.com/v1/responses",
    openAI_model: "gpt-4o-mini",

    
    ai_instruction: `You are a bot that provides cooking recipe.
    if user ask an unrelated stuff then dont response.
    output should be in html format,
    no markdown format, answer directly.`,
    //Prompt Engineering
    response_id: ""
}

async function sendOpenAIRequest(text) { 
    let requestBody = {
        model: _config.openAI_model, 
        input: text,
        instructions: _config.ai_instruction, 
        previous_response_id: _config.response_id, //paper forms to send someone (openai)
    }
    
    //first message
    if (_config.response_id.length == 0) { 
        requestBody = {
            model: _config.openAI_model,
            input: text,
            instructions: _config.ai_instruction,
        };
    }

    try {
    const response = await fetch(_config.openAI_api, { 
        method: "POST", //GET, POST, PUT, DELETE, PATCH 
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_config.openAI_apiKey}`,
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        //addBotMessage(HTTP error! Status: ${response.status}`); 
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

        const data = await response.json();
        console.log(data);
        let output = data.output[0].content[0].text; 
        _config.response_id = data.id;
        return output;
    } 

    catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}


