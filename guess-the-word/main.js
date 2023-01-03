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
    console.log(chosen);
});

let current = 1;
let row = 1;
let fullWord = false;
let firstLetter = true;

document.getElementById("letter11").classList.add("word-letter-current");

document.querySelectorAll(".keyboard-button").forEach(btn => {
    btn.addEventListener("click", btnKeyHandler);
});
document.getElementById("keyboard-button-delete").addEventListener("click", deleteHandler);
document.getElementById("keyboard-button-enter").addEventListener("click", enterHandler);

function btnKeyHandler(e) {
    if(!fullWord) {
        firstLetter = false;
        const key = e.target.getAttribute("data-key");
        document.getElementById(`letter${row}${current}`).innerHTML = key;
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

function deleteHandler(e) {
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

function enterHandler(e) {
    if(fullWord) {
        let word = "";
        for(let i = 1; i <= 5; i++) {
            word += document.getElementById(`letter${row}${i}`).innerHTML;
        }
        if(!words.has(word)) {
            console.log(word);
            document.getElementById("modal-invalid-word").style.opacity = 1;
            setTimeout(() => {
                document.getElementById("modal-invalid-word").style.opacity = 0;
            }, 1000);
        }
        else {
            let correct = false;
            if(word === chosen) {
                correct = true;
            }

            let chosenLettersCount = {};
            chosen.split("").forEach(c => chosenLettersCount[c] = chosenLettersCount[c] ? chosenLettersCount[c] + 1 : 1);
            console.log(chosenLettersCount);
            for(let i = 0; i < 5; i++) {
                if(chosen[i] === word[i]) {
                    document.getElementById(`letter${row}${i + 1}`).style.backgroundColor = "#46b53c";
                    document.getElementById(`letter${row}${i + 1}`).style.borderColor = "#46b53c";
                    chosenLettersCount[word[i]]--;
                }
                else if(chosenLettersCount[word[i]]) {
                    document.getElementById(`letter${row}${i + 1}`).style.backgroundColor = "#b59f3b";
                    document.getElementById(`letter${row}${i + 1}`).style.borderColor = "#b59f3b";
                    chosenLettersCount[word[i]]--;
                }
                else {
                    document.getElementById(`letter${row}${i + 1}`).style.backgroundColor = "#333";
                    document.getElementById(`letter${row}${i + 1}`).style.borderColor = "#333";
                }
            }

            if(correct || row === 6) {
                document.querySelectorAll(".keyboard-button").forEach(btn => {
                    btn.removeEventListener("click", btnKeyHandler);
                });
                document.getElementById("keyboard-button-enter").removeEventListener("click", enterHandler);
                document.getElementById("keyboard-button-delete").removeEventListener("click", deleteHandler);
                if(correct) {
                    document.getElementById("modal-finished").innerHTML = "CORRECT!";
                }
                else {
                    document.getElementById("modal-finished").innerHTML = `<p>WRONG!</p><p>Correct word is <span>${chosen}</span></p>`;
                }
                document.getElementById("modal-finished").style.opacity = 1;
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