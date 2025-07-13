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

                // typed correctly
                tomHealth -= 10
                tomHealthElm.innerText = `Tom: ${tomHealth}HP`;
                startTimer();

                game('no you cannot')
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
            myHealth -= 10
            myHealthElm.innerText = `You: ${myHealth}HP`;
            game();
        }
    }, 1000);
}

document.getElementById("bg-music").volume = 0.1
document.getElementById("bg-music").play();

function game(text)
{
    startTypingTest(text);
    startTimer();
    
}

game()