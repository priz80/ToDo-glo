// ==========================
// ToDo App
// ==========================

const STORAGE_KEY = 'todos';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo');
const completedList = document.getElementById('completed');

// Структура одного дела: { id, text, completed }

// Получить массив дел из localStorage
function getTodos() {
	const json = localStorage.getItem(STORAGE_KEY);
	// внимание: из localStorage мы всегда получаем json строку,
	// её необходимо конвертировать обратно в javascript через JSON.parse
	return json ? JSON.parse(json) : [];
}

// Сохранить массив дел в localStorage
function saveTodos(todos) {
	// внимание: чтобы сохранить массив в localStorage,
	// необходимо конвертировать его в json формат через JSON.stringify
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Создать DOM-элемент <li> для одного дела
function createTodoElement(todo) {
	const li = document.createElement('li');
	li.className = 'todo-item';
	li.dataset.id = todo.id;

	const span = document.createElement('span');
	span.className = 'text-todo';
	span.textContent = todo.text;

	const buttons = document.createElement('div');
	buttons.className = 'todo-buttons';

	const removeBtn = document.createElement('button');
	removeBtn.className = 'todo-remove';

	const completeBtn = document.createElement('button');
	completeBtn.className = 'todo-complete';

	buttons.appendChild(removeBtn);
	buttons.appendChild(completeBtn);

	li.appendChild(span);
	li.appendChild(buttons);

	return li;
}

// Отрисовать все дела на странице на основе массива
function renderTodos() {
	const todos = getTodos();

	todoList.innerHTML = '';
	completedList.innerHTML = '';

	todos.forEach((todo) => {
		const li = createTodoElement(todo);
		if (todo.completed) {
			completedList.appendChild(li);
		} else {
			todoList.appendChild(li);
		}
	});
}

// Добавить новое дело
function addTodo(text) {
	const trimmedText = text.trim();

	// пустые дела добавляться не должны
	if (trimmedText === '') {
		return;
	}

	const todos = getTodos();

	todos.push({
		id: Date.now(),
		text: trimmedText,
		completed: false
	});

	saveTodos(todos);
	renderTodos();
}

// Удалить дело по id
function removeTodo(id) {
	const todos = getTodos().filter((todo) => todo.id !== id);
	saveTodos(todos);
	renderTodos();
}

// Переключить статус выполнения дела по id
function toggleComplete(id) {
	const todos = getTodos().map((todo) => {
		if (todo.id === id) {
			return { ...todo, completed: !todo.completed };
		}
		return todo;
	});
	saveTodos(todos);
	renderTodos();
}

// Обработка отправки формы (добавление дела)
form.addEventListener('submit', (event) => {
	event.preventDefault();
	addTodo(input.value);
	input.value = ''; // очищаем поле ввода после добавления
	input.focus();
});

// Делегирование кликов по кнопкам "удалить" и "выполнено"
document.querySelector('.todo-container').addEventListener('click', (event) => {
	const li = event.target.closest('.todo-item');
	if (!li) return;

	const id = Number(li.dataset.id);

	if (event.target.classList.contains('todo-remove')) {
		removeTodo(id);
	}

	if (event.target.classList.contains('todo-complete')) {
		toggleComplete(id);
	}
});

// Автоматическая загрузка дел при открытии страницы
document.addEventListener('DOMContentLoaded', renderTodos);
