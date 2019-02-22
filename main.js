/* eslint-disable prefer-destructuring */
/* eslint-env browser */

const clearBtn = document.querySelector('#clearBtn');
const checkBtn = document.querySelector('#checkBtn');
const uncheckBtn = document.querySelector('#uncheckBtn');

const addItems = document.querySelector('.add-items');
const itemsList = document.querySelector('.todos');
const items = JSON.parse(localStorage.getItem('items')) || [];

function addItem(e) {
  e.preventDefault();
  const text = this.querySelector('[name=item]').value;
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
        <label for="item${index}"></label>      
      </div>
    </div>
    <div class="column">
      <div class="column-two">
        <span>${todo.text}</span>
      </div>
    </div>
    <span class="delete-btn">&#x2715;<span>
  </li >
`;
    })
    .join('');
}

function toggleDone(e) {
  if (!e.target.matches('input')) return;
  const el = e.target;
  const index = el.dataset.index;
  items[index].done = !items[index].done;
  localStorage.setItem('items', JSON.stringify(items));
  populateList(items, itemsList);
}

function clearAll() {
  localStorage.clear();
  while (itemsList.firstChild) {
    itemsList.removeChild(itemsList.firstChild);
  }
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

clearBtn.addEventListener('click', clearAll);
checkBtn.addEventListener('click', checkAll);
uncheckBtn.addEventListener('click', uncheckAll);

addItems.addEventListener('submit', addItem);
itemsList.addEventListener('click', toggleDone);
populateList(items, itemsList);
