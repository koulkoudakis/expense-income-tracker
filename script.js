const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const dummyTransactions = [
    { id: 1, text: 'Groceries', amount: -20 },
    { id: 2, text: 'Wages', amount: 300 },
    { id: 3, text: 'Gym membership', amount: -10 },
    { id: 4, text: 'Camera', amount: 150 }
]

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : dummyTransactions;

// Add transaction
function addTrans(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a transaction name and amount');

    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        console.log(transaction);
        transactions.push(transaction);

        addTransDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 1000);
}

// Add transaction to DOM list
function addTransDOM (transaction) {
  // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

  // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount
    )}</span> <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;

    item.setAttribute("onclick", `removeTransaction(${transaction.id})`);
    
    list.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    
    console.log(amounts);
    console.log(total);
    console.log(income, expense);
    
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;

}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTrans)
list.addEventListener('click', removeTransaction())
