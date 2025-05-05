document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const viewButtons = document.querySelectorAll('.btn-view');
    const currentDateInput = document.getElementById('currentDate');
    let currentView = 'month';
    let currentDate = new Date();

    // Initialize calendar
    currentDateInput.valueAsDate = currentDate;
    renderCalendar();

    // View switching
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            renderCalendar();
        });
    });

    // Date navigation
    document.getElementById('prevDate').addEventListener('click', () => {
        currentDate = adjustDate(currentDate, -1);
        updateCalendar();
    });

    document.getElementById('nextDate').addEventListener('click', () => {
        currentDate = adjustDate(currentDate, 1);
        updateCalendar();
    });

    currentDateInput.addEventListener('change', () => {
        currentDate = new Date(currentDateInput.value);
        renderCalendar();
    });

    function adjustDate(date, direction) {
        const newDate = new Date(date);
        switch(currentView) {
            case 'day':
                newDate.setDate(date.getDate() + direction);
                break;
            case 'week':
                newDate.setDate(date.getDate() + (7 * direction));
                break;
            case 'month':
                newDate.setMonth(date.getMonth() + direction);
                break;
        }
        return newDate;
    }

    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        
        switch(currentView) {
            case 'day':
                renderDayView(tasks);
                break;
            case 'week':
                renderWeekView(tasks);
                break;
            case 'month':
                renderMonthView(tasks);
                break;
        }
    }

    function renderMonthView(tasks) {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Calendar header
        const headerRow = document.createElement('div');
        headerRow.className = 'calendar-header-row';
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-header';
            dayCell.textContent = day;
            headerRow.appendChild(dayCell);
        });
        calendarGrid.appendChild(headerRow);

        // Date cells
        let date = new Date(start);
        date.setDate(1 - date.getDay());
        
        for(let i = 0; i < 42; i++) { // 6 weeks
            const weekRow = document.createElement('div');
            weekRow.className = 'calendar-week';
            
            for(let j = 0; j < 7; j++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'calendar-day';
                dayCell.textContent = date.getDate();
                
                if(date.getMonth() !== currentDate.getMonth()) {
                    dayCell.classList.add('other-month');
                }
                
                // Add tasks
                const dayTasks = tasks.filter(task => {
                    const taskDate = new Date(task.dueDate);
                    return taskDate.toDateString() === date.toDateString();
                });
                
                dayTasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'calendar-task';
                    taskElement.textContent = task.title;
                    taskElement.draggable = true;
                    dayCell.appendChild(taskElement);
                });
                
                weekRow.appendChild(dayCell);
                date.setDate(date.getDate() + 1);
            }
            calendarGrid.appendChild(weekRow);
        }
    }

    function updateCalendar() {
        currentDateInput.valueAsDate = currentDate;
        renderCalendar();
    }
});