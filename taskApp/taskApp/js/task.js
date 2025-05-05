document.addEventListener('DOMContentLoaded', () => {
    const subtaskContainer = document.getElementById('subtaskContainer');
    const addSubtaskBtn = document.getElementById('addSubtask');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const taskForm = document.getElementById('taskForm');

    // Subtask management
    addSubtaskBtn.addEventListener('click', createSubtaskField);
    
    function createSubtaskField(value = '') {
        const wrapper = document.createElement('div');
        wrapper.className = 'subtask-item';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter subtask';
        input.value = value;
        
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => wrapper.remove();
        
        wrapper.append(input, removeBtn);
        subtaskContainer.appendChild(wrapper);
    }

    // Drag & drop handlers
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleFileDrop);

    function handleDragOver(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    }

    function handleFileDrop(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        handleFiles(files);
    }

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if(file.size > 1024 * 1024 * 5) {
                alert('File size exceeds 5MB limit');
                return;
            }
            // TODO: Add file upload logic
            console.log('File added:', file.name);
        });
    }

    // Form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            dueDate: document.getElementById('dueDate').value,
            priority: document.getElementById('priority').value,
            subtasks: Array.from(subtaskContainer.querySelectorAll('input')).map(i => i.value),
            attachments: [] // Placeholder for file references
        };

        // Save to localStorage
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.push(taskData);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        alert('Task saved successfully!');
        window.location.href = 'dashboard.html';
    });

    // Initialize with one subtask field
    createSubtaskField();
});