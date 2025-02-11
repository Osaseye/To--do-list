document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task");
    const categoryInput = document.getElementById("category");
    const addTaskBtn = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");
    const themeToggle = document.getElementById("theme-toggle");

    function saveTasksToLocalStorage() {
        const tasks = [];
        document.querySelectorAll("#task-list li").forEach(li => {
            tasks.push({
                text: li.querySelector(".task-text strong").innerText,
                category: li.querySelector(".task-text").innerText.split(" - ")[1]
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToList(task.text, task.category));
    }

    function addTaskToList(text, category) {
        if (!text) return;

        const li = document.createElement("li");
        li.innerHTML = `<span class="task-text"><strong>${text}</strong> - ${category}</span>
            <span class="task-actions">
                <button class="edit"><i class="fas fa-edit"></i></button>
                <button class="delete"><i class="fas fa-trash"></i></button>
                <button class="pin"><i class="fas fa-thumbtack"></i></button>
            </span>`;

        li.querySelector(".edit").addEventListener("click", () => {
            taskInput.value = text;
            categoryInput.value = category;
            taskList.removeChild(li);
            saveTasksToLocalStorage();
        });

        li.querySelector(".delete").addEventListener("click", () => {
            li.remove();
            saveTasksToLocalStorage();
        });

        li.querySelector(".pin").addEventListener("click", () => {
            taskList.prepend(li);
            saveTasksToLocalStorage();
        });

        taskList.appendChild(li);
        saveTasksToLocalStorage();
    }

    addTaskBtn.addEventListener("click", () => {
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTaskToList(taskText, categoryInput.value);
            taskInput.value = "";
        }
    });

    function saveThemeToLocalStorage(theme) {
        localStorage.setItem("theme", theme);
    }

    function loadThemeFromLocalStorage() {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark-mode") {
            document.body.classList.add("dark-mode");
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const newTheme = document.body.classList.contains("dark-mode") ? "dark-mode" : "";
        saveThemeToLocalStorage(newTheme);
        themeToggle.innerHTML = newTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });

    loadThemeFromLocalStorage();
    loadTasksFromLocalStorage();
    
    // Ensure Sortable works
    setTimeout(() => {
        new Sortable(taskList, { animation: 150 });
    }, 100);
});