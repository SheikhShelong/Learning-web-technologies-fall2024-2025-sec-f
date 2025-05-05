class NotificationSystem {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    this.preferences = JSON.parse(localStorage.getItem('notificationPrefs')) || {
      inApp: true,
      email: false
    };
  }

  init() {
    this.setupEventListeners();
    this.renderPreferences();
    this.checkForNewNotifications();
    setInterval(() => this.checkForNewNotifications(), 60000);
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      if(e.target.closest('.notification-item')) {
        this.handleNotificationClick(e.target.closest('.notification-item'));
      }
      if(e.target.closest('#prefToggle')) {
        this.togglePreference(e.target.closest('#prefToggle').dataset.type);
      }
    });
  }

  checkForNewNotifications() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const overdueTasks = tasks.filter(task => 
      new Date(task.dueDate) < new Date() && !task.completed
    );

    overdueTasks.forEach(task => {
      if(!this.notifications.find(n => n.taskId === task.id)) {
        this.addNotification({
          id: Date.now(),
          type: 'overdue',
          message: `Task "${task.title}" is overdue`,
          timestamp: new Date().toISOString(),
          read: false,
          taskId: task.id
        });
      }
    });
  }

  addNotification(notification) {
    this.notifications.unshift(notification);
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    this.displayNotification(notification);
  }

  displayNotification(notification) {
    if(this.preferences.inApp) {
      const notificationElement = document.createElement('div');
      notificationElement.className = `notification-item ${notification.type}`;
      notificationElement.innerHTML = `
        <p>${notification.message}</p>
        <small>${new Date(notification.timestamp).toLocaleString()}</small>
      `;
      document.querySelector('.notification-center').appendChild(notificationElement);
    }
  }

  togglePreference(type) {
    this.preferences[type] = !this.preferences[type];
    localStorage.setItem('notificationPrefs', JSON.stringify(this.preferences));
    this.renderPreferences();
  }

  renderPreferences() {
    document.getElementById('inAppToggle').checked = this.preferences.inApp;
    document.getElementById('emailToggle').checked = this.preferences.email;
  }

  handleNotificationClick(notificationEl) {
    const notificationId = parseInt(notificationEl.dataset.id);
    const notification = this.notifications.find(n => n.id === notificationId);
    notification.read = true;
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    notificationEl.classList.add('read');
  }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();
notificationSystem.init();