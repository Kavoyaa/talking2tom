const countdown = document.getElementById('#countdown');
const textbox = document.getElementById('#textbox');
const typing_material = document.getElementById('#typing-material');
const win_status = document.getElementById('#status');
const container = document.getElementById('#container');

let ending_time = Math.floor(new Date().getTime()/1000)+ 30;

function update_countdown() {
    let time_left = ending_time - Math.floor(new Date().getTime()/1000);
    if (time_left >= 0) {
        if (time_left >= 10) {
            countdown.innerText = "00:" + (time_left);
        } else {
            countdown.innerText = "00:0" + (time_left);
        }
    
    } else {
        countdown.innerText = 0;
        clearInterval(update_countdown);
        win_status.innerText = "You lose."
        container.innerHTML = "<h1 style='color: red;'>You lose.</h1>";
    }
    
}

setInterval(update_countdown, 1000);

textbox.addEventListener('input', () => {
    if (textbox.value === typing_material.innerText) {
        win_status.innerText = "You win.";
        clearInterval(update_countdown);
        // textbox.value = "";
        container.innerHTML = "<h1 style='color: green;'>you win</h1>";
    }
});
