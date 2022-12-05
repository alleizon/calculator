// DOM variables

const currentText = document.querySelector("#current-text");
const previousText = document.querySelector("#previous-text");
const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const plusMinus = document.querySelector("#plus-minus")
const clearBtn = document.querySelector("#clear")

let currentNumber = '';

// Event listeners for numbers

const numberBtnsArray = Array.from(numberBtns);

numberBtnsArray.forEach(item => {
   item.addEventListener('click', updateCurrentField); 
});




















function updateCurrentField(e) {
    const number = e.target.textContent;
    let containsDot = currentNumber.includes(".") ? true : false;

    if ((number === '.') && containsDot) return;
    if (!currentNumber && number === '.') {
        currentNumber = '0.';
        currentText.innerText = '0.';
        return;
    }

    let length;
    const re = /\s/g;
    if (containsDot) length = currentNumber.replace(re, '').length-1;
    else length = currentNumber.replace(re, '').length;

    if (length >= 12) return;

    currentNumber += number;
    const formattedNumber = formatNumber(currentNumber.replace(re, ''));
    console.log(currentNumber, currentNumber.replace(re, '').length);

    currentText.innerText = formattedNumber;
}

function formatNumber(numberString) {
    let dotIndex;

    if (numberString.includes('.')) dotIndex = numberString.indexOf('.');
    const afterDot = dotIndex ? numberString.slice(dotIndex) : '';
    const numberBeforeDot = numberString.slice(0,dotIndex);
    const numberArray = numberBeforeDot.split('');
    const length = numberBeforeDot.length;
    if (length > 3) {
        const numberOfSpaces = Math.floor(length/3);
        const firstSpaceIndex = length % 3 ? length % 3 : 3;
        let newIndex = firstSpaceIndex;
        let addedSpaces = 0;
        for (let i = 0; i<numberOfSpaces; i++) {
            if (i==0) {
                numberArray.splice(firstSpaceIndex,0,' ');
                addedSpaces++;
            }
            else {
                numberArray.splice(newIndex+addedSpaces,0,' '); 
                addedSpaces++
            }

            newIndex += 3;
        }
    }
    return numberArray.join('')+afterDot;
}