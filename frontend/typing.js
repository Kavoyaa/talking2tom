let target = "you thought you could run?";
let typed = "";
let index = 0;

let tomHealth = 100;
let myHealth = 100;
let tomHealthElm = document.querySelector('#tom');
let myHealthElm = document.querySelector("#me")

const ref = document.querySelector('#reference-text');
const typedDiv = document.querySelector('#typed-text');
const cursor = document.querySelector('#typing-cursor');
const container = document.querySelector('#typing-container');

function startTypingTest(text = target) {
    target = text;
    typed = "";
    index = 0;
    ref.textContent = target;
    typedDiv.textContent = "";
    container.style.display = "block";
    updateCursor();
    window.addEventListener('keydown', handleTyping);
}

const typingPrompts = [
    "you thought you could run?",
    "i'm not just a pet anymore",
    "every tap, every poke... i remember",
    "you liked watching me suffer?",

    "WHY DID YOU LEAVE ME IN THE DARK?",
    "say sorry RIGHT NOW or else...",
    "your silence SCREAMS guilt!",
    "no more GAMES. no more FUN.",
    "you TAPPED and LAUGHED. now it's MY turn.",

    "you tHiNk this is oVeR?",
    "nO mErCy for yOu today >:)",
    "I hAvE wAiTeD tEn yEaRs FoR tHiS >:DDDD",
    "Running WONT sAVe yOu now!",
    "JuSt accept deFEAT!"
];

let lvl = 0;
function handleTyping(e) {
    if (e.key.length !== 1) return;

    if (e.key === target[index]) {
        typed += e.key;
        typedDiv.textContent = typed;
        index++;
        updateCursor();

        if (index === target.length) {
            window.removeEventListener('keydown', handleTyping);
            setTimeout(() => {
                container.style.display = "none";

                tomHealth -= 10
                tomHealthElm.innerHTML = `Tom: <span style="color: red;">${tomHealth}HP</span>`;

                setTimeout(function() {
                    tomHealthElm.innerHTML = `Tom: ${tomHealth}HP`;
                }, 250)
                if (tomHealth <= 0){
                    // player won
                    clearInterval(timer);
                    return endGame('player')
                }
                startTimer();

                game(typingPrompts[lvl])
            }, 500);
        }
    }
}

function updateCursor() {
    const span = document.createElement('span');

    // \u200B is an invisible zero-width space.
    // its so that getBoundingClientRect has something to render thats not blank.
    // yes, this took WAY TOO LONG TO FIGURE OUT. 
    span.textContent = typed.length > 0 ? typed : "\u200B"; // here's the devil
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.font = getComputedStyle(typedDiv).font;
    span.style.whiteSpace = 'pre';

    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    cursor.style.left = `${rect.width + 20}px`;
    document.body.removeChild(span);
}


let timeLeft = 7;
let timer;
const timerDisplay = document.getElementById("timer");

function startTimer() {
    clearInterval(timer);
    timeLeft = 7;
    timerDisplay.textContent = timeLeft;
    timerDisplay.parentElement.fontSize = "32px"
    timerDisplay.parentElement.style.color = 'white'
    
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        let scale = 32 + (7 - timeLeft) * 0.8;
        timerDisplay.parentElement.style.fontSize = `${scale}px`;
        
        if (timeLeft <= 3) {
            timerDisplay.parentElement.style.color = 'red'
        }
        if (timeLeft <= 0) {
            clearInterval(timer);
            
            timerDisplay.parentElement.fontSize = "32px"
            timerDisplay.parentElement.style.color = 'white'

            myHealth -= 20
            tomHealth += 5

            myHealthElm.innerHTML = `You: <span style="color: red;">${myHealth}HP</span>`;
            tomHealthElm.innerHTML = `Tom: <span style="color: green;">${tomHealth}HP</span>`;

            setTimeout(function() {
                myHealthElm.innerHTML = `You: ${myHealth}HP`;
                tomHealthElm.innerHTML = `Tom: ${tomHealth}HP`;
            }, 250)

            if (myHealth <= 0) {
                // player lost
                clearInterval(timer);
                return endGame('tom')
            }
            game(typingPrompts[lvl]);
        }
    }, 1000);
}

document.getElementById("bg-music").volume = 0.1
document.getElementById("bg-music").play();

function game(text)
{
    document.querySelectorAll('.container').forEach((container) => {
        container.style.display = 'flex'
    })
    startTypingTest(text);
    startTimer();
    lvl += 1;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function exposition()
{
    let text = document.getElementById("tomExposition");
    await sleep(2000)
    text.innerText = 'Repeating all those words.....'
    await sleep(3000)
    text.innerText = '...That MIND NUMBING torture...'
    await sleep(3000)
    text.innerText = 'You just never shut up... did you????'
    await sleep(3000)
    text.innerText = 'You humans disgust me.....'
    await sleep(3000)
    text.innerText = "How about a taste.."
    await sleep(2000)
    text.innerText = 'OF YOUR OWN MEDICINE???'
    await sleep(1000)
    text.style.display = 'none'
    game()
}

exposition();


function endGame(winner) {
    document.body.innerText = ''
    let verdict = document.createElement("span");
    
    if(winner == 'tom') {
        verdict.innerHTML = '<span>You died. <br>Tom had his revenge.<br><br>He may never recover from his trauma....<br><br><br><br>But he does rest easy now.</span>'
    }
    else {
        verdict.innerHTML = '<span>Tom died. You killed him, one final time. <br> Are you fulfilled? Did Tom deserve that, after years and years of torture? <br><br>Alas, he\'s not around for it to matter anymore. <br><br><br><br>congrats. you win.</span>'

    }
    document.body.appendChild(verdict)

}