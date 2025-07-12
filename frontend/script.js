let rage = 0;

async function talkToTom(messages, rage_value) {
    const res = await fetch("http://127.0.0.1:5000/gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            messages: messages, // array of strings ["Hey Tom", "Calm down bro"]
            rage_value: rage_value // number between 0-10
        })
    });

    const data = await res.json();
    rage = data.rage_value;

    console.log(data.reply, rage);
    speak(data.reply);

    return data;
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);

    utter.pitch = 0.5;
    utter.rate = 0.75;

    const voices = synth.getVoices();
    utter.voice = voices.find(v => v.name.includes("Google") || v.name.includes("Daniel")) || voices[0];

    video = document.querySelector('video')

    utter.onboundary = async (event) => {
        video.play();
        await new Promise(r => setTimeout(r, 800));
        video.currentTime = 0;
        video.pause();
    };

    utter.onstart = () => {
        console.log("🟢 Speaking started");
        video.currentTime = 0;
        video.play();
    };

    utter.onend = () => {
        console.log("✅ Speaking ended");
        video.currentTime = 0;
    };

    synth.speak(utter);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech recognition is not supported in this browser. Try Chrome or Edge.");
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Recognized:", transcript);
        document.querySelector('#input').value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
        console.log("Speech recognition ended.");
    };

    // Start listening on some user action:
    document.querySelector("#micBtn").addEventListener("click", () => {
        recognition.start();
    });
}


document.querySelector('#btn').addEventListener('click', () => {
    let message = document.querySelector('#input').value
    talkToTom([message], rage)
})