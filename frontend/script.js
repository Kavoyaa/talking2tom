let rage = 0;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Try Chrome or Edge if you want to speak to Tom. You can type to him for now.");
    document.querySelector('#micBtn').style.display = 'none'
} else {
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
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
            rage_value: rage_value // number between 0-10
        })
    });

    const data = await res.json();
    rage = data.rage_value;

    console.log(data.reply, rage);
    speak(data.reply);

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

document.querySelector('#btn').addEventListener('click', () => {
    let message = document.querySelector('#input').value
    talkToTom([message], rage)
})

let recognizing = false;

recognition.onstart = () => recognizing = true;
recognition.onend = () => recognizing = false;

document.querySelector('#micBtn').addEventListener('click', () => {
    if (!recognizing) {
        recognition.start();
        document.querySelector('video').src = 'listening.mp4'
    }
});
