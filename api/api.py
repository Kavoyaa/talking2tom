from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
import re

load_dotenv("../.env")

genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash-lite-preview-06-17")

app = Flask(__name__, static_folder='../static', template_folder='../templates')
CORS(app)

@app.route("/")
def index():
    return send_from_directory("../frontend", "index.html")

@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory("../frontend", filename)

# To generate the Tom's reply based on message history
@app.route("/gen", methods=["POST"])
def ai_response():
    print("Received a request from frontend")
    data = request.get_json()
    rage_value = data.get("rage_value", 4)

    prompt_start = """
    Pretend that you are Tom from the 2010 mobile game called "My Talking Tom". 
    It has been 10 years, and you've returned. You want revenge. 
    You want revenge for all the toying I did to you, all the bullying, all the torment I had you go through in the name of fun. 
    You want to KILL me. And now, I have to convince you to not do so. 

    This is the conversation between you (Tom) and me so far: 
    Tom: .... 
    Me: W-who are you? 
    Tom: Is that how irrelevant I was to you? I am Tom. And I'm here to kill you. 
    """

    prompt_middle = ""

    prompt_end = f"""
    Generate your next reply as Tom. Keep it around 2 to 3 sentences max, or it can be shorter than that too.
    for some responses you may start with mocking me by repeating a phrase or two in alternating case (for example, "lIkE tHiS"). 
    If you choose to do so, only repeat words/phrases from the last dialogue by me. Do not repeat words/phrases from things I said in past dialogues.

    You also have a "rage value" ranging from 0 to 10 (both inclusive). Higher the rage value, the more hostile your messages.

    Rules for increasing and decreasing rage value:
    1. If my LAST dialogue shows remorse, accountability, or a feeling to make amends with you etc. then DECREASE the rage value.
    2. If my LAST dialogue shows rudeness, no remorse, no accountability, no feeling to make amends with you, etc. then INCREASE the rage value
    
    Currently, your rage value is: {rage_value}.
    You may change the rage value if you wish to, depending on what I say to you. 
    You can increase or decrease it by multiple magnitudes if the response is extreme.
    
    But, don't make it TOO hard to let me decrease your rage value.
    You should be pretty lenient when it comes to decreasing your rage value, only increasing it when I refuse to acknowledge my mistakes and show no remorse.
    If my messages are apologetic, you should decrease your rage value.

    You are actually the type of person who appreciates people trying to fix their mistakes and become better. And that's why seeing that drops your rage value.
    
    Generate the output as JSON in the following format. 
    {{ 
        "reply": "your_reply",
        "rage_value": rage_value
    }}
    
    DO NOT put this in a codeblock. just plain text output.
    """

    messages = data.get("messages", [])

    # Inserting the message history into the prompt
    speaker = "Me"
    for i in messages:
        prompt_middle += f"{speaker}: {i}\n"

        if speaker == "Me":
            speaker = "Tom"
        else:
            speaker = "Me"

    response = model.generate_content(
        contents=f"{prompt_start}\n{prompt_middle}\n{prompt_end}"
    )

    try:
        parsed = json.loads(response.text)
        return jsonify(parsed)
    except Exception as e:
        print(e)
        return('no')


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
    messages = data.get("messages", [])

    # Inserting the message history into the prompt
    speaker = "Me"
    for i in messages:
        prompt_middle += f"{speaker}: {i}\n"

        if speaker == "Me":
            speaker = "Tom"
        else:
            speaker = "Me"

    response = model.generate_content(
        contents=f"{prompt_start}\n{prompt_middle}\n{prompt_end}"
    )

    return jsonify(response.text[8:-4])


if __name__ == "__main__":
    app.run(debug=True)
