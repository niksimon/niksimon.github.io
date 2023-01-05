for(let i = 1; i <= 6; i++) {
    for(let j = 1; j <= 5; j++) {
        const el = document.createElement("div");
        el.setAttribute("class", "word-letter");
        el.setAttribute("data-value", "");
        el.setAttribute("id", `letter${i}${j}`);
        document.getElementById("word-grid").appendChild(el);
    }
}

let words = null;
let chosen = "";
fetch("words.json")
  .then(response => response.json())
  .then(json => {
    const rnd = Math.floor(Math.random() * json.length);
    chosen = json[rnd];
    words = new Set(json);
});

let current = 1;
let row = 1;
let fullWord = false;
let firstLetter = true;
let correctLettersInOrder = new Set();

document.getElementById("letter11").classList.add("word-letter-current");

function keyDownHandler(e) {
    if(e.key === "Backspace") {
        deleteHandler();
        return;
    }
    else if(e.key === "Enter") {
        enterHandler();
    }
    
    inputLetter(e.key);
}

function btnKeyHandler(e) {
    inputLetter(e.target.getAttribute("data-key"));
    // if(!fullWord) {
    //     firstLetter = false;
    //     const key = e.target.getAttribute("data-key");
    //     document.getElementById(`letter${row}${current}`).innerHTML = key;
    //     document.getElementById(`letter${row}${current}`).classList.remove("word-letter-current");
    //     if(current % 5 !== 0) {
    //         current++;
    //         document.getElementById(`letter${row}${current}`).classList.add("word-letter-current");
    //     }
    //     else {
    //         fullWord = true;
    //     }
    // }
}

function inputLetter(letter) {
    if(!fullWord && /^[a-z]$/.test(letter)) {
        firstLetter = false;
        //const key = e.target.getAttribute("data-key");
        document.getElementById(`letter${row}${current}`).innerHTML = letter;
        document.getElementById(`letter${row}${current}`).classList.remove("word-letter-current");
        if(current % 5 !== 0) {
            current++;
            document.getElementById(`letter${row}${current}`).classList.add("word-letter-current");
        }
        else {
            fullWord = true;
        }
    }
}

function deleteHandler() {
    if(!firstLetter) {
        if(fullWord) {
            document.getElementById(`letter${row}${current}`).innerHTML = "";
            document.getElementById(`letter${row}${current}`).classList.add("word-letter-current");
            fullWord = false;
        }
        else {
            document.getElementById(`letter${row}${current - 1}`).innerHTML = "";
            document.getElementById(`letter${row}${current}`).classList.remove("word-letter-current");
            document.getElementById(`letter${row}${current - 1}`).classList.add("word-letter-current");
            current--;
        }
        if(current === 1) {
            firstLetter = true;
        }
    }
}

function enterHandler() {
    if(fullWord) {
        let word = "";
        for(let i = 1; i <= 5; i++) {
            word += document.getElementById(`letter${row}${i}`).innerHTML;
        }
        // check if word is valid
        if(!words.has(word)) {
            //console.log(word);
            document.getElementById("modal-invalid-word").style.visibility = "visible";
            document.getElementById("modal-invalid-word").style.opacity = 1;
            setTimeout(() => {
                document.getElementById("modal-invalid-word").style.opacity = 0;
                setTimeout(() => {
                    document.getElementById("modal-invalid-word").style.visibility = "hidden";
                }, 500);
            }, 1000);
        }
        else {
            let correct = false;
            if(word === chosen) {
                correct = true;
            }
            let chosenLettersCount = {};
            chosen.split("").forEach(c => chosenLettersCount[c] = chosenLettersCount[c] ? chosenLettersCount[c] + 1 : 1);
            let correctLetters = [];
            // get correctly positioned letters first
            for(let i = 0; i < 5; i++) {
                if(chosen[i] === word[i]) {
                    correctLetters.push(i);
                    correctLettersInOrder.add(word[i]);
                    document.getElementById(`key-${word[i]}`).classList.remove("keyboard-button-wrong-order");
                    document.getElementById(`key-${word[i]}`).classList.add("keyboard-button-correct");
                    document.getElementById(`letter${row}${i + 1}`).classList.add("word-letter-correct");
                    chosenLettersCount[word[i]]--;
                }
            }
            // then others with wrong positions and those not included
            for(let i = 0; i < 5; i++) {
                if(correctLetters.includes(i)) {
                    continue;
                }
                if(chosenLettersCount[word[i]]) {
                    if(!correctLettersInOrder.has(word[i])) {
                        document.getElementById(`key-${word[i]}`).classList.add("keyboard-button-wrong-order");
                    }
                    document.getElementById(`letter${row}${i + 1}`).classList.add("word-letter-wrong-order");
                    chosenLettersCount[word[i]]--;
                }
                else {
                    document.getElementById(`key-${word[i]}`).classList.add("keyboard-button-not-in-word");
                    document.getElementById(`letter${row}${i + 1}`).classList.add("word-letter-not-in-word");
                }
            }

            // found correct word or at last row
            if(correct || row === 6) {
                document.querySelectorAll(".keyboard-button").forEach(btn => {
                    btn.removeEventListener("click", btnKeyHandler);
                });
                document.getElementById("keyboard-button-enter").removeEventListener("click", enterHandler);
                document.getElementById("keyboard-button-delete").removeEventListener("click", deleteHandler);
                document.removeEventListener("keydown", keyDownHandler);
                // win
                if(correct) {
                    document.getElementById("modal-text").innerHTML = "YOU WIN!";
                    confetti();
                }
                // lose
                else {
                    document.getElementById("modal-text").innerHTML = `<p style='font-size:2.5rem'>WRONG!</p><p style='font-size:1.5rem'>Correct word is <span>${chosen}</span></p>`;
                }
                document.getElementById("modal-finished").style.display = "flex";
                setTimeout(() => {document.getElementById("modal-finished").style.opacity = 1;}, 50);
                return;
            }

            row++;
            current = 1;
            firstLetter = true;
            fullWord = false;
            document.getElementById(`letter${row}1`).classList.add("word-letter-current");
        }
    }
}

function resizeHandler() {
    document.getElementById("word-grid").style.maxWidth = `${Math.min(400, 400 - (750 - window.innerHeight))}px`;
}

function confetti() {
    const modal = document.getElementById("modal-finished");
    const confContainer = document.createElement("div");
    confContainer.setAttribute("id", "confetti");
    confContainer.setAttribute("class", "confetti");
    modal.appendChild(confContainer);
    for(let i = 0; i < 50; i++) {
        const conf = document.createElement("div");
        conf.setAttribute("class", "confetti-item");
        const backgroundColors = ['#26ccff','#a25afd','#ff5e7e','#88ff5a','#fcff42','#ffa62d','#ff36ff'];
        conf.style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
        conf.style.animationName = `drop${Math.floor(Math.random() * 3) + 1}`;
        conf.style.animationDuration = `${Math.floor(Math.random() * 2500) + 1500}ms`;
        conf.style.left = `${Math.floor(Math.random() * window.innerWidth)}px`;
        conf.style.top = `-${Math.floor(Math.random() * window.innerHeight) + 20}px`;
        confContainer.appendChild(conf);
    }
}

document.querySelectorAll(".keyboard-button").forEach(btn => {
    btn.addEventListener("click", btnKeyHandler);
});
document.getElementById("keyboard-button-delete").addEventListener("click", deleteHandler);
document.getElementById("keyboard-button-enter").addEventListener("click", enterHandler);

document.addEventListener('keydown', keyDownHandler);

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal-finished").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("modal-finished").style.display = "none";
    }, 500);
});


window.addEventListener("resize", resizeHandler);

resizeHandler();