
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
    console.log(data);
    return data;
}

document.querySelector('#btn').addEventListener('click', () => {
    let message = document.querySelector('#input').textContent

    talkToTom([message], 5)
})