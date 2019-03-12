/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */
/* eslint-env browser */

const deleteBtn = document.querySelector('#deleteBtn');
const checkBtn = document.querySelector('#checkBtn');
const currentDate = document.querySelector('#current-date');
const uncheckBtn = document.querySelector('#uncheckBtn');

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
  localStorage.setItem('items', JSON.stringify(items));
  this.reset();
}

function populateList(todos = [], todosList) {
  todosList.innerHTML = todos
    .map((todo, index) => {
      return `
  <li>
    <div class="column">
      <div class="column-one custom-checkbox">
        <input type="checkbox" data-index=${index} id="item${index}" ${
        todo.done ? 'checked' : ''
      } />
        <label for="item${index}" data-index=${index}" ></label>   
      </div>
    </div>
    <div class="column">
      <div class="column-two ${todo.done ? 'linethrough' : ''}">
          <label for="item${index}" data-index=${index}"> <span>${
        todo.text
      } </span> </label>
      </div>
    </div>
        <p data-text="${todo.text}" class="delete-btn">&#x2715;<p>
  </li>
          `;
    })
    .join('');
}

function toggleDone(e) {
  const el = e.target;
  const index = el.dataset.index;
  items[index].done = !items[index].done;
  localStorage.setItem('items', JSON.stringify(items));
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
  if (e.target.matches('input')) toggleDone(e);
});
populateList(items, itemsList);
