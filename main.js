/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-env browser */

const deleteBtn = document.getElementById('deleteBtn');
const checkBtn = document.getElementById('checkBtn');
const currentDate = document.getElementById('current-date');
const uncheckBtn = document.getElementById('uncheckBtn');

const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.todos');

let items = JSON.parse(localStorage.getItem('items')) || [];

function displayCurrentDate() {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const userDate = `${new Date().toLocaleDateString('en-us', options)}`;
  currentDate.textContent = `${userDate}`;
}

function addItem(e) {
  e.preventDefault();
  const inputText = this.querySelector('[name=item]').value;
  // Change occurences of " to &quot; to prevent problems deleting item
  const text = inputText.replace(/"/g, '&quot;');
  const item = {
    text,
    done: false
  };

  items.push(item);
  populateList(items, itemsList);

  this.reset();
}

function populateList(todos = [], todosList) {
  todosList.innerHTML = todos
    .map((todo, index) => {
      return `
  <li data-index=${index}>   
    <div class="column-one custom-checkbox">
      <input type="checkbox" id="item${index}" ${todo.done ? 'checked' : ''} />
      <label for="item${index}" ></label>   
    </div>
  
  
    <div class="column-two">
        <label for="item${index}">
        <span class=${todo.done ? 'linethrough' : ''}>${todo.text}</span>
        </label>
    </div>
  
    <span data-text="${todo.text}" class="delete-btn">&#x2715;</span>
  </li>
          `;
    })
    .join('');

  localStorage.setItem('items', JSON.stringify(items));
}

function toggleDone(e) {
  // Get the closest li element, as this will have the item index data
  const closestLi = e.closest('li');

  const index = closestLi.dataset.index;

  items[index].done = !items[index].done;

  populateList(items, itemsList);
}

function deleteItem(e) {
  const todoValue = e.target.dataset.text;

  // Replace occurences of " back to &quot; so we can get matches on items array
  const todoValueEdited = todoValue.replace(/"/g, '&quot;');

  const index = items.map(i => i.text).indexOf(todoValueEdited);
  if (index > -1) {
    items.splice(index, 1);
  }

  populateList(items, itemsList);
}

function deleteAll() {
  localStorage.clear();
  while (itemsList.firstChild) {
    itemsList.removeChild(itemsList.firstChild);
  }
  items = [];
}

function checkAll() {
  items.forEach(item => {
    item.done = true;
  });
  populateList(items, itemsList);
}

function uncheckAll() {
  items.forEach(item => {
    item.done = false;
  });
  populateList(items, itemsList);
}

deleteBtn.addEventListener('click', deleteAll);
checkBtn.addEventListener('click', checkAll);
document.addEventListener('DOMContentLoaded', displayCurrentDate);
uncheckBtn.addEventListener('click', uncheckAll);

addItems.addEventListener('submit', addItem);
itemsList.addEventListener('click', e => {
  if (e.target.matches('.delete-btn')) deleteItem(e);
  // if user didn't click the delete icon, toggle the todo as done/not done
  else toggleDone(e.target);
});

populateList(items, itemsList);
