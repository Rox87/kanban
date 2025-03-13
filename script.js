document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.kanban-item');
    const columns = document.querySelectorAll('.kanban-column');

    let draggedItem = null;

    items.forEach(item => {
        const taskTextElement = document.createElement('span');
        taskTextElement.textContent = item.textContent;
        item.textContent = '';
        item.appendChild(taskTextElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        item.appendChild(deleteButton);

        deleteButton.addEventListener('click', function() {
            item.remove();
        });

        const colorButton = document.createElement('input');
        colorButton.type = 'color';
        colorButton.classList.add('color-button');
        item.appendChild(colorButton);

        colorButton.addEventListener('change', function() {
            item.style.backgroundColor = colorButton.value;
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
    });

    const addTaskButton = document.getElementById('add-task-button');
    const newTaskInput = document.getElementById('new-task-input');

    addTaskButton.addEventListener('click', function() {
        const taskText = newTaskInput.value.trim();
        if (taskText !== '') {
            const newItem = document.createElement('div');
            newItem.classList.add('kanban-item');
            newItem.setAttribute('draggable', 'true');
            newItem.textContent = taskText;

            const taskTextElement = document.createElement('span');
            taskTextElement.textContent = newItem.textContent;
            newItem.textContent = '';
            newItem.appendChild(taskTextElement);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            newItem.appendChild(deleteButton);

            deleteButton.addEventListener('click', function() {
                newItem.remove();
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

            newItem.addEventListener('dragstart', function() {
                draggedItem = this;
                setTimeout(() => {
                    this.style.display = 'none';
                }, 0);
            });

            newItem.addEventListener('dragend', function() {
                setTimeout(() => {
                    this.style.display = 'block';
                    draggedItem = null;
                }, 0);
            });

            document.getElementById('items-1').appendChild(newItem);
            newTaskInput.value = '';
        }
    });

    columns.forEach(column => {
        column.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        column.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        });

        column.addEventListener('dragleave', function() {
            this.style.backgroundColor = 'white';
        });

        column.addEventListener('drop', function(e) {
            this.style.backgroundColor = 'white';
            const afterElement = getDragAfterElement(this.querySelector('.kanban-items'), e.clientY);
            if (afterElement == null) {
                this.querySelector('.kanban-items').appendChild(draggedItem);
            } else {
                this.querySelector('.kanban-items').insertBefore(draggedItem, afterElement);
            }
        });
    });

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
});
