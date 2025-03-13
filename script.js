document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.kanban-item');
    const columns = document.querySelectorAll('.kanban-column');
    const kanban = document.querySelector('.kanban');

    let draggedItem = null;
    let columnCount = 3;

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kanban-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function addDragListeners(item) {
        item.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => {
                this.style.display = 'none';
            }, 0);
        });

        item.addEventListener('dragend', function() {
            setTimeout(() => {
                this.style.display = 'block';
                draggedItem = null;
            }, 0);
        });
    }

    const addTaskButton = document.getElementById('add-task-button');
    const newTaskInput = document.getElementById('new-task-input');

    addTaskButton.addEventListener('click', function() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const newItem = document.createElement('div');
            newItem.classList.add('kanban-item');
            newItem.setAttribute('draggable', 'true');

            const taskTextElement = document.createElement('span');
            taskTextElement.textContent = taskText;
            newItem.appendChild(taskTextElement);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            newItem.appendChild(deleteButton);

            deleteButton.addEventListener('click', function() {
                newItem.remove();
            });

            const colorButton = document.createElement('input');
            colorButton.type = 'color';
            colorButton.classList.add('color-button');
            newItem.appendChild(colorButton);

            colorButton.addEventListener('change', function() {
                newItem.style.backgroundColor = colorButton.value;
            });

            taskTextElement.addEventListener('click', function() {
                const currentText = taskTextElement.textContent;
                const inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = currentText;

                taskTextElement.textContent = '';
                taskTextElement.appendChild(inputElement);
                inputElement.focus();

                taskTextElement.addEventListener('blur', function() {
                    taskTextElement.textContent = inputElement.value;
                });
            });

            addDragListeners(newItem);

            document.getElementById('items-1').appendChild(newItem);
            newTaskInput.value = '';
        }
    });

    const saveButton = document.getElementById('save-button');

    saveButton.addEventListener('click', function() {
        const kanbanData = [];
        columns.forEach(column => {
            const columnId = column.id;
            const items = Array.from(column.querySelectorAll('.kanban-item')).map(item => {
                const taskTextElement = item.querySelector('span');
                const taskText = taskTextElement.textContent;
                const taskColor = item.style.backgroundColor;
                return {
                    text: taskText,
                    color: taskColor
                };
            });
            kanbanData.push({
                columnId: columnId,
                items: items
            });
        });
        localStorage.setItem('kanbanData', JSON.stringify(kanbanData));
    });

    function loadKanbanData() {
        const kanbanData = localStorage.getItem('kanbanData');
        if (kanbanData) {
            const parsedData = JSON.parse(kanbanData);
            parsedData.forEach(columnData => {
                const column = document.getElementById(columnData.columnId);
                const itemsContainer = column.querySelector('.kanban-items');
                columnData.items.forEach(itemData => {
                    const newItem = document.createElement('div');
                    newItem.classList.add('kanban-item');
                    newItem.setAttribute('draggable', 'true');

                    const taskTextElement = document.createElement('span');
                    taskTextElement.textContent = itemData.text;
                    newItem.appendChild(taskTextElement);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.classList.add('delete-button');
                    newItem.appendChild(deleteButton);

                    deleteButton.addEventListener('click', function() {
                        newItem.remove();
                    });

                    const colorButton = document.createElement('input');
                    colorButton.type = 'color';
                    colorButton.classList.add('color-button');
                    newItem.appendChild(colorButton);
                    newItem.style.backgroundColor = itemData.color;

                    colorButton.addEventListener('change', function() {
                        newItem.style.backgroundColor = colorButton.value;
                    });

                    taskTextElement.addEventListener('click', function() {
                        const currentText = taskTextElement.textContent;
                        const inputElement = document.createElement('input');
                        inputElement.type = 'text';
                        inputElement.value = currentText;

                        taskTextElement.textContent = '';
                        taskTextElement.appendChild(inputElement);
                        inputElement.focus();

                        inputElement.addEventListener('blur', function() {
                            taskTextElement.textContent = inputElement.value;
                        });
                    });

                    addDragListeners(newItem);
                    itemsContainer.appendChild(newItem);
                });
            });
        }
    }

    loadKanbanData();

    items.forEach(item => {
        addDragListeners(item);
    });
});
