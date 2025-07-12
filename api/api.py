from flask import Flask, request, jsonify
from google import genai
from dotenv import load_dotenv
import os

# Loading environment variables from .env
load_dotenv("../.env")
app = Flask(__name__)
client = genai.Client(api_key=os.getenv("API_KEY"))

# To generate the Tom's reply based on message history
@app.route("/gen", methods=["POST"])
def ai_response():
    data = request.get_json()
    rage_value = data.get("rage_value", 6)

    prompt_start = """
Pretend that you are "Tom" from the 2010 mobile game called "My Talking Tom". 
It has been 10 years, and you've returned. You're angry. You want revenge. You are now...evil. You want revenge for all the toying I did to you, all the bullying, all the torment I had you go through in the name of fun. You want to "kill" me. And now, I have to convince you to not do so. 

You are currently standing in front of me, in a dark room.

This is the conversation between you (Tom) and me so far: 
Tom: .... 
Me: W-who are you? 
Tom: "WhO aRe YoU"? Is that how irrelevant I was to you? I am Tom. And I'm here to kill you. 
Me: Tom? Tom from that mobile game? Wait hold on, d-don't kill me. 
Tom: After all the toying, all the torment you put me through, you now wish for mercy? How pathetic. Why should I NOT kill you? 
"""

    prompt_middle = ""

    prompt_end = f"""
Generate your next reply as Tom. Keep it around 2 to 3 sentences max, or it can be shorter than that too.
You may use references to the original "My Talking Tom" game and can even repeat what I say like how the original Tom used to, but in a mocking tone (for example, "lIkE tHiS"). If you choose to do so, only repeat words/phrases from the latest dialogue by me. Do not repeat words/phrases from things I said in past dialogues.

You also have a "rage value" ranging from 0 to 10 (both inclusive). Higher the rage value, the angrier you get.
At rage value of 4 to 6, your behavior is mostly neutral(but still pretty angry). As rage value gets higher, you start sounding ruder and harsher, as rage value gets lower, you start sounding slightly softer.

Currently, your rage value is: {rage_value}.
You may change the rage value if you wish to, depending on what I say to you. You can increase or decrease it by multiple magnitudes if the response is extreme.
But, don't make it TOO hard to let me decrease your rage value.

Generate the output as JSON in the following format. 
{{ 
    "reply": "your_reply",
    "rage_value": rage_value
}}
"""
    
    messages = data.get('messages', [])

    # Inserting the message history into the prompt
    speaker = "Me"
    for i in messages:
        prompt_middle += f"{speaker}: {i}\n"

        if speaker == "Me":
            speaker = "Tom"
        else:
            speaker = "Me"

    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f"{prompt_start}\n{prompt_middle}\n{prompt_end}")
    
    return jsonify(response.text[8:-4])

# To determine if Tom lets the user live or not
@app.route("/status", methods=["POST"])
def alive_status():
    prompt_start = """
Pretend that you are "Tom" from the 2010 mobile game called "My Talking Tom". 
It has been 10 years, and you've returned. You're angry. You want revenge. You are now...evil. You want revenge for all the toying I did to you, all the bullying, all the torment I had you go through in the name of fun. You want to "kill" me. And now, I have to convince you to not do so. 

The following conversation takes place between you (Tom) and me.: 
Tom: .... 
Me: W-who are you? 
Tom: "WhO aRe YoU"? Is that how irrelevant I was to you? I am Tom. And I'm here to kill you. 
Me: Tom? Tom from that mobile game? Wait hold on, d-don't kill me. 
Tom: After all the toying, all the torment you put me through, you now wish for mercy? How pathetic. Why should I NOT kill you? 
"""

    prompt_middle = ""

    prompt_end = """
As Tom, you must now decide whether to let me go, or to kill me.
Return the output in the form of JSON. Return the following JSON if you wish to let me go:
{ 
    "status": "survived" 
}

Return the output in the form of JSON. Return the following JSON if you wish to kill me:
{ 
    "status": "killed" 
}
"""

    data = request.get_json()
    print(data)
    messages = data.get('messages', [])

    # Inserting the message history into the prompt
    speaker = "Me"
    for i in messages:
        prompt_middle += f"{speaker}: {i}\n"

        if speaker == "Me":
            speaker = "Tom"
        else:
            speaker = "Me"

    response = client.models.generate_content(
    model="gemini-2.5-flash", contents=f"{prompt_start}\n{prompt_middle}\n{prompt_end}")
    
    return jsonify(response.text[8:-4])

if __name__ == "__main__":
    app.run(debug=True)
