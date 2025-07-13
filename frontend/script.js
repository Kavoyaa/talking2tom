let rage = 0;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Try Chrome or Edge if you want to speak to Tom. You can type to him for now.");
    document.querySelector('#micBtn').style.display = 'none'
} else {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Recognized:", transcript);
        document.querySelector('#input').value = transcript;
        document.querySelector("#btn").click()
        document.querySelector('video').src = 'speaking.mp4'  
    };
    
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };
    
    recognition.onend = () => {
        console.log("Speech recognition ended."); 
    };
}


async function talkToTom(messages, rage_value) {
    const res = await fetch("http://127.0.0.1:5000/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: messages,
            rage_value: rage_value
        })
    });

    const data = await res.json();
    return data;
}

let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
};

function speak(text) {
    text = text.toLowerCase();
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);

    utter.pitch = 0.8;
    utter.rate = 1.05;

    // Make sure voices are ready
    if (!voices.length) {
        voices = synth.getVoices(); // fallback 
    }
    utter.voice = voices.find(v =>
        v.name === "Alex" || v.name.includes("Daniel") || v.name.includes("Fred")
    ) || voices[0];

    video = document.querySelector('video')

    utter.onboundary = async (event) => {
        video.play();
        await new Promise(r => setTimeout(r, 800));
        video.currentTime = 0;
        video.pause();
    };

    utter.onstart = () => {
        video.currentTime = 0;
        video.play();
    };

    utter.onend = () => {
        video.currentTime = 0;
    };

    synth.speak(utter);
}

function sendMessage(msg) {
    const meChat = document.querySelector('.chat-me');
    const tomChat = document.querySelector('.chat-tom');

    const meMessage = document.createElement('span');
    meMessage.innerText = msg;
    meMessage.style.display = 'block';

    const lastTomMsg = tomChat.lastElementChild;
    const lastMeMsg = meChat.lastElementChild;

    if (!lastTomMsg || !lastMeMsg) {
        meMessage.style.marginTop = '50px';
    } else {
        const spacing = Math.min(lastTomMsg.offsetHeight * 0.5, 60);
        meMessage.style.marginTop = `${spacing}px`;
    }

    meChat.appendChild(meMessage);
    meChat.scrollTop = meChat.scrollHeight;
}


function recieveMessage(msg) {
    if (msg != '...')
        speak(msg);

    const tomChat = document.querySelector('.chat-tom');
    const meChat = document.querySelector('.chat-me');

    const tomMessage = document.createElement('span');
    tomMessage.innerText = msg;
    tomMessage.style.display = 'block';

    const lastMeMsg = meChat.lastElementChild;

    if (lastMeMsg) {
        const spacing = Math.min(lastMeMsg.offsetHeight * 0.5, 60);
        tomMessage.style.marginTop = `${spacing}px`;
    }

    tomChat.appendChild(tomMessage);
    tomChat.scrollTop = tomChat.scrollHeight;
}



document.querySelector('#btn').addEventListener('click', async () => {
    
    let message = document.querySelector('#input').value;
    sendMessage(message);
    
    let response = await talkToTom([message], rage);
    
    rage = response.rage_value;
    if (rage == 10) {
        // initiate next sequence!
        gameLevel2()
    }
    else {
        setRage(rage);
        recieveMessage(response.reply);
        
    }

    console.log(response.reply, rage);    
})

let recognizing = false;
if (recognition) {
    recognition.onstart = () => recognizing = true;
    recognition.onend = () => recognizing = false;
}

document.querySelector('#micBtn').addEventListener('click', () => {
    if (!recognizing) {
        recognition.start();
        document.querySelector('video').src = 'listening.mp4'
    }
});


function setRageBlockColors() {
    let blocks = document.querySelectorAll('.rage-meter-inner > div');
    blocks.forEach((block, index) => {
        block.style.backgroundPosition = `-${index * 20}px 0px`;
    });
}

function setRage(rageValue){
    let rageParent = document.querySelector(".rage-meter-inner");
    rageParent.innerText = ""

    for (let i = 0; i < rageValue; i++) 
    {
        let block = document.createElement('div')
        rageParent.appendChild(block)
    }
    setRageBlockColors();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameCutscene(){
    await sleep(4300)
    recieveMessage('...')
    await sleep(3000)
    sendMessage('Wh... Who are you?')
    await sleep(2000)
    recieveMessage(' You really don\'t remember? Is that how irrelevant I was to you? I am Tom.')
    await sleep(6000)
    sendMessage('...Tom? From that game? All those years ago?')
    await sleep(5000)
    recieveMessage('...')
    await sleep(3000)
    sendMessage('What happened to you?')
    await sleep(5000)
    document.querySelector('.rage-meter').style.animation = 'fadeIn 1s ease forwards'
    recieveMessage('YOU. happened to me. YOU put me through TORMENT. I HATE YOU. I WANT TO KILL YOU.')
    document.querySelector('.actions').style.animation = 'fadeIn 1s ease forwards'
}

document.querySelector('.phone-button').addEventListener('click', () => {
    document.querySelector('a.tip').style.animation = 'fadeOut 1s ease forwards'
    gameCutscene();
    document.querySelector('.phone>video').style.animation = 'turnOn 5s ease forwards'
    const audio = document.createElement("audio");
    audio.src = "music/horror.mp3"
    audio.volume = 0.4;
    audio.play();
})

function gameLevel2()
{
    window.location = 'typing.html'
}