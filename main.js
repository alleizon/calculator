// DOM variables

const currentText = document.querySelector("#current-text");
const previousText = document.querySelector("#previous-text");
const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const plusMinus = document.querySelector("#plus-minus")
const clearBtn = document.querySelector("#clear")

const numberBtnsArray = Array.from(numberBtns);
const operatorBtnsArray = Array.from(operatorBtns); 

// Event listeners

numberBtnsArray.forEach(item => {
    item.addEventListener('click', updateCurrentField); 
});

operatorBtnsArray.forEach(item => {
    item.addEventListener('click', operate);
});










// Variables

let currentNumber = '';
let storedNumber;

const operators = {
    add: ['+', add],
    subtract: ['-', subtract],
    multiply: ['×', multiply],
    divide: ['÷', divide],
    equal: ['=', equal],
}

let currentOperator;

// Functions

function updateCurrentField(e) {
    if (currentOperator == 'equal') {
        currentNumber = '';
        currentOperator = undefined;
    };

    const number = e.target.textContent;
    let containsDot = currentNumber.includes(".") ? true : false;

    if (number === '0' && !currentNumber) return;

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
        const numberOfSpaces = (length % 3) == 0 ? Math.floor(length/3) - 1 : Math.floor(length/3);
        const firstSpaceIndex = length % 3 ? length % 3 : 3;
        let newIndex = firstSpaceIndex;
        let addedSpaces = 0;
        for (let i = 0; i<numberOfSpaces; i++) {
            if (i==0) {
                numberArray.splice(firstSpaceIndex, 0, ' ');
                addedSpaces++;
            }
            else {
                numberArray.splice(newIndex+addedSpaces, 0, ' '); 
                addedSpaces++
            }

            newIndex += 3;
        }
    }
    return numberArray.join('')+afterDot;
}

function operate(event) {
    console.log(Boolean(currentNumber));
    let operator = event.target.id;
    let operatorSymbol = operators[operator][0];
    
    if (!currentNumber && operator != 'equal' && storedNumber) {
        currentOperator = operator;
        previousText.innerText = storedNumber + ' ' + operators[operator][0];
        return;
    }

    if (operator == 'equal') {
        if (!currentOperator) return;
        if (!storedNumber && currentOperator == 'equal') return;
        if (storedNumber) {
            let result = operators[currentOperator][1](+storedNumber, +currentNumber);
            currentText.innerText = formatNumber(String(result));
            currentNumber = String(result);
            storedNumber = null;
            previousText.innerText = '';
            currentOperator = 'equal';
            return;
        }
    }

    let result = storedNumber ? operators[currentOperator][1](+storedNumber, +currentNumber) : undefined;
    
    currentText.innerText = '0';
    previousText.innerText = (result || result === 0 ? formatNumber(String(result)) : formatNumber(currentNumber)) + ' ' + operatorSymbol;
    
    storedNumber = storedNumber ? result : currentNumber;
    currentOperator = operator;
    currentNumber = '';
}

function add(x,y){
    return x+y;
}
function subtract(x,y){
    return x-y;
}
function multiply(x,y){
    return x*y;
}
function divide(x,y){
    return x/y;
}