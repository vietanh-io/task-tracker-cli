import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "./tasks.json");

let tasks = [];

const loadTask = async () => {
    try {
        if (fs.existsSync(FILE_PATH)) {
            const data = fs.readFileSync(FILE_PATH, 'utf-8');
            if (data.trim().length > 0) {
                // parse json to save to tasks[]
                tasks = JSON.parse(data);
            } else {
                tasks = [];
            }
        }
    } catch (error) {
        console.error("Lỗi khi tải tasks:", error);
    }
}

const saveTask = async () => {
    try {
        // overwrite existing file
        fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
    } catch (error) {
        console.error("Error when saving a new task: ", error);
    }
}

loadTask();

export const addTask = async (description) => {
    try {
        await loadTask(); // Reload to ensure id not collapsed

        const newTask = {
            id: tasks.length + 1,
            description,
            status: "todo",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        tasks.push(newTask);
        await saveTask();
        console.log(`Task added successfully (ID: ${newTask.id})`);
    } catch (error) {
        console.log("Error when adding a new task: ", error);
    }
}

export const updateTask = async (id, description) => {
    try {
        await loadTask();
        const existTask = tasks.find((t) => t.id === id);

        if (existTask) {
            existTask.description = description;
            existTask.updatedAt = new Date().toISOString();

            await saveTask();
            console.log(`Task updated successfully (ID: ${newTask.id})`);
        } else {
            console.log(`Cannot find id ${id}`);
        }

    } catch (error) {
        console.log("Error when updating a new task: ", error);
    }
}

export const deleteTask = async (id) => {
    try {
        await loadTask();
        const existTask = tasks.find((t) => t.id === id);

        if (existTask) {
            tasks = tasks.filter((t) => t.id !== id); // remove task with id
            await saveTask();
            console.log(`Task deleted successfully (ID: ${existTask.id})`);
        } else {
            console.log(`Cannot find id ${id}`);
        }
    } catch (error) {
        console.log("Error when deleting task: ", error)
    }
}

export const markTaskProgress = async (id, status) => {
    try {
        await loadTask();
        const existTask = tasks.find((t) => t.id === id);

        if (existTask) {
            existTask.status = status;
            existTask.updatedAt = new Date().toISOString();

            await saveTask();
            console.log(`Task ${id} has changed status to ${status}`);
        } else {
            console.log(`Cannot find id ${id}`);
        }
    } catch (error) {
        console.log("Error when changing status of a task: ", error);
    }
}


export const listTasks = async (status) => {
    try {
        await loadTask();
        let filteredTasks = tasks;

        if (status) {
            filteredTasks = tasks.filter((t) => t.status === status);
        }

        if (filteredTasks.length === 0) {
            console.log(`Cannot find any task with status: ${status || "all"}`);
            return;
        }

        filteredTasks.forEach((task) => {
            console.log(
                `[${task.id}] ${task.description} - ${task.status} (created: ${task.createdAt}) (updated: ${task.updatedAt})`
            );
        });

    } catch (error) {
        console.log("Error when listing tasks", error);
    }
}