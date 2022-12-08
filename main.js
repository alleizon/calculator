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

window.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.key in keys) operate(event);
    else if (event.key.match(/^[0-9.]$/)) updateCurrentField(event);
});

clearBtn.addEventListener('click', clear);

plusMinus.addEventListener('click', () => {
    addedMinus = !addedMinus;
    if (addedMinus) {
        currentText.innerText = '-' + currentText.innerText; 
    } else currentText.innerText = currentText.innerText.replace(/[-]/g, '');
})

// Variables

let currentNumber = '';
let storedNumber;
let addedMinus = false;

const operators = {
    add: ['+', add],
    subtract: ['-', subtract],
    multiply: ['×', multiply],
    divide: ['÷', divide],
    equal: ['=', equal],
}

const keys = {
    '+': 'add',
    '-': 'subtract',
    '*': 'multiply',
    '/': 'divide',
    '=': 'equal',
}

let currentOperator;

// Functions

function updateCurrentField(e) {
    if (currentOperator == 'equal') {
        currentNumber = '';
        currentOperator = undefined;
    };
    
    const number = e.type == 'click' ? e.target.textContent : e.key;
    let containsDot = currentNumber.includes(".") ? true : false;

    if (number === '0' && !currentNumber) return;

    if ((number === '.') && containsDot) return;
    if (!currentNumber && number === '.') {
        currentNumber = '0.';
        currentText.innerText = '0.';
        return;
    }

    let currentNumberLength;
    const re = /[-\s]/g;
    if (containsDot) currentNumberLength = currentNumber.replace(re, '').length-1;
    else currentNumberLength = currentNumber.replace(re, '').length;
    if (currentNumberLength >= 12) return;

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
    return addedMinus ? '-' + numberArray.join('') + afterDot : numberArray.join('') + afterDot;
}

function operate(event) {
    let operator;
    if (event.type == 'click') {
        operator = event.target.id;
    } else {
        const key = event.key;
        operator = keys[key]
    }
    let operatorSymbol = operators[operator][0];
    
    if (!currentNumber && operator != 'equal' && storedNumber) {
        styleOperatorBtn(event);
        currentOperator = operator;
        previousText.innerText = storedNumber + ' ' + operators[operator][0];
        return;
    }

    if (operator == 'equal') {
        if (!currentOperator) return;
        if (!storedNumber && currentOperator == 'equal') return;
        if (storedNumber) {
            let currentNumberArg = addedMinus ? +currentNumber * -1 : +currentNumber;
            let result = operators[currentOperator][1](+storedNumber, currentNumberArg);
            const resultLength = String(result).replace(/[.-]/g, '').length;
            if (resultLength > 12) {
                clear();
                currentText.innerText = 'Number is too big';
                return;
            }
            if (addedMinus) addedMinus = false;
            currentText.innerText = result ? formatNumber(String(result)) : 'yikes';
            currentNumber = String(result);
            storedNumber = null;
            previousText.innerText = '';
            currentOperator = 'equal';
            styleOperatorBtn(event);
            return;
        }
    }

    let currentNumberArg = addedMinus ? +currentNumber * -1 : +currentNumber;
    let result = storedNumber ? operators[currentOperator][1](+storedNumber, currentNumberArg) : undefined;
    if (addedMinus && storedNumber) addedMinus = !addedMinus;
    
    if (result) {
        const resultLength = String(result).replace(/[.-]/g, '').length;
        if (resultLength > 12) {
            clear();
            currentText.innerText = 'Number is too big';
            return;
        }
    }
    if (result || currentNumber) {     
        previousText.innerText = (result || result === 0 ? formatNumber(String(result)) : formatNumber(currentNumber)) + ' ' + operatorSymbol;
    };

    currentText.innerText = '0';
    storedNumber = storedNumber ? result : currentNumber;
    if (addedMinus) {
        storedNumber = '-' + storedNumber;
        addedMinus = !addedMinus;
    }
    if (storedNumber) styleOperatorBtn(event);
    currentOperator = operator;
    currentNumber = '';
}

function add(x,y){
    const sum = x+y;
    if (Number.isInteger(sum)) return sum;
    let digitsBeforeDot = calcDigitsBeforeDot(sum);
    const newSumArray = sum.toFixed(12 - digitsBeforeDot).split('');
    let arrLength = newSumArray.length;
    while (newSumArray[arrLength-1] == '0') {
        newSumArray.pop();
        arrLength--;
    }
    return newSumArray.join('');
}
function subtract(x,y){
    const sum = x-y;
    if (Number.isInteger(sum)) return sum;
    let digitsBeforeDot = calcDigitsBeforeDot(sum);
    const newSumArray = sum.toFixed(12 - digitsBeforeDot).split('');
    let arrLength = newSumArray.length;
    while (newSumArray[arrLength-1] == '0') {
        newSumArray.pop();
        arrLength--;
    }
    return newSumArray.join('');
}
function multiply(x,y){
    const sum = x*y;
    if (Number.isInteger(sum)) return sum;
    let digitsBeforeDot = calcDigitsBeforeDot(sum);
    const newSumArray = sum.toFixed(12 - digitsBeforeDot).split('');
    let arrLength = newSumArray.length;
    while (newSumArray[arrLength-1] == '0') {
        newSumArray.pop();
        arrLength--;
    }
    return newSumArray.join('');
}
function divide(x,y){
    if (y === 0) return;
    const sum = x/y;
    if (Number.isInteger(sum)) return sum;
    let digitsBeforeDot = calcDigitsBeforeDot(sum);
    const newSumArray = sum.toFixed(12 - digitsBeforeDot).split('');
    let arrLength = newSumArray.length;
    while (newSumArray[arrLength-1] == '0') {
        newSumArray.pop();
        arrLength--;
    }
    return newSumArray.join('');
}

function clear() {
    currentNumber = '';
    storedNumber = undefined;
    currentOperator = undefined;
    previousText.innerText = '';
    currentText.innerText = '0';
    addedMinus = false;
    styleOperatorBtn();
}

function styleOperatorBtn(e) {
    if (e.type == 'click') {
        if (!e || e.target.id == 'equal') {
            operatorBtnsArray.forEach(item => item.classList.remove('operator-activated'));
        } else {
            const previousBtn = currentOperator ? document.querySelector(`#${currentOperator}`) : e.target;
            previousBtn.classList.remove('operator-activated');
            
            e.target.classList.add('operator-activated');    
        }
    } else {
        if (!e || e.key == '=') {
            operatorBtnsArray.forEach(item => item.classList.remove('operator-activated'));
        }
        else {
            const previousBtn = currentOperator ? document.querySelector(`#${currentOperator}`) : document.querySelector(`#${keys[e.key]}`);
            previousBtn.classList.remove('operator-activated');
            
            const target = document.querySelector(`#${keys[e.key]}`);
            target.classList.add('operator-activated');
        }
    }
}

function calcDigitsBeforeDot(sum) {
    const digitsArray = sum.toString(10).split('.');
    return digitsArray[0].length;
}