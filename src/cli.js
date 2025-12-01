import * as taskManager from "./taskManager.js";
import { createInterface } from 'node:readline';

// create cli
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'tasks-cli ',
});

rl.prompt();

rl.on('line', (line) => {
    const input = line.trim();
    // Extract the command-line arguments passed by the user.
    const args = input.split(" "); // Slice off the first two default args (node and file path)
    const command = args[0]; // The command provided by the user (e.g., 'add', 'update')
    const params = args.slice(1); // Additional parameters (like task description, ID, etc.)

    // Switch to determine which command was provided.
    switch (command) {
        case "add": {
            const description = params.join(" "); // Join all remaining parameters as the task description
            taskManager.addTask(description); // Call the addTask method
            break;
        }

        case "update": {
            const taskId = parseInt(params[0]); // Extract task ID
            const updatedDescription = params.slice(1).join(" "); // Get the new description
            taskManager.updateTask(taskId, updatedDescription); // Call the updateTask method
            break;
        }

        case "delete": {
            taskManager.deleteTask(params.slice(1).join(" ")); // Delete task by ID
            break;
        }

        case "mark-in-progress": {
            const taskId = parseInt(params[0]);
            taskManager.markTaskProgress(taskId, 'in-progress'); // Mark task as 'in-progress'
            break;
        }

        case "mark-done": {
            const taskId = parseInt(params[0]);
            taskManager.markTaskProgress(taskId, 'done'); // Mark task as 'done'
            break;
        }

        case "list": {
            taskManager.listTasks(params[0]); // List tasks, possibly filtered by status (todo, done, in-progress)
            break;
        }

        default: {
            console.log("Unknown command"); // If an unknown command is provided, show an error.
        }
    }
    rl.prompt();
}).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
});


