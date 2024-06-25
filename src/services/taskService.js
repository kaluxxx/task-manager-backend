const Task = require('../models/Task');
const cron = require('node-cron');
const uuid = require('uuid');
const clientService = require('./clientService');
const messageService = require('./messageService');
const taskMapper = require("../mapper/taskMapper");
const File = require("../models/file");

const taskService = {
    async createTask({name, accounts, channels, message, resendInterval, user}) {
        try {
            const taskToCreate = taskMapper.mapDtoToModel({
                name,
                accounts,
                channels,
                message,
                resendInterval,
                user,
            });


            const task = new Task(taskToCreate);
            await task.save();

            return task;
        } catch (error) {
            throw error;
        }
    },
    async addImage(user, id, fileName, buffer) {
        try {
            const image = new File({
                name: fileName,
                data: buffer
            });
            await image.save();

            const task = await taskService.getTaskById(user, id);
            console.log("task :", task)
            task.image = image._id;
            await task.save();

            return task;
        } catch (error) {
            throw error;
        }
    },
    async updateImage(user, id, fileName, buffer) {
        try {
            const image = new File({
                name: fileName,
                data: buffer
            });
            await image.save();

            const task = await taskService.getTaskById(user, id);

            if (task.isRunning) {
                await taskService.stopTask(user, id);
            }

            if (task.image) {
                await File.findByIdAndDelete(task.image);
            }

            task.image = image._id;
            await task.save();

            if (task.isRunning) {
                await taskService.startTask(user, id);
            }
            return await taskService.getTaskById(user, id);
        } catch (error) {
            throw error;
        }
    },
    async getTasks() {
        try {
            return await Task.find().populate('accounts').populate('image');
        } catch (error) {
            throw error;
        }
    },
    async getTasksByUser(user) {
        try {
            return await Task.find({user}).populate('accounts').populate('image');
        } catch (error) {
            throw error;
        }
    },
    async getTaskById(user, id) {
        try {
            return await Task.findById({_id: id, user})
                .populate('accounts')
                .populate('image');
        } catch (error) {
            throw error;
        }
    },
    async deleteTask(user, id) {
        try {
            await Task.findOneAndDelete({user, _id: id});
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async updateTask(user, id, taskToUpdate) {
        try {
            if (taskToUpdate.isRunning) {
                await taskService.stopTask(user, id);
            }

            const task = await Task
                .findByIdAndUpdate({_id: id, user}, taskToUpdate)
                .populate('accounts')
                .populate('image');

            if (taskToUpdate.isRunning) {
                await taskService.startTask(user, id);
            }

            return task;
        } catch (error) {
            throw error;
        }
    },
    async startTask(user, id) {
        try {
            const task = await Task.findById({_id: id, user})
                .populate('accounts')
                .populate('image');

            if (!task) {
                throw new Error('Task not found');
            }

            cron.schedule(`*/${task.resendInterval} * * * * *`, async () => {
                console.log('Cron job executed at:', new Date());
                try {
                    task.jobId = uuid.v4();
                    await task.save();
                    for (const account of task.accounts) {
                        const client = await clientService.getClient(account.phoneNumber);
                        for (const channel of task.channels) {
                            await messageService.sendMessage(client, channel.id, task.message, task.image);
                        }
                    }
                } catch (error) {
                    console.error(`Error during task execution: ${error.message}`);
                }
            });

            task.isRunning = true;
            await task.save();
            return task;
        } catch (error) {
            throw error;
        }
    },
    async stopTask(user, id) {
        try {
            const task = await Task.findById({_id: id, user});
            console.log("task :", task)
            if (task.jobId) {
                // Supprimer la tâche planifiée
                cron.getTasks({jobId: task.jobId}).forEach(task => {
                    task.stop();
                    console.log(`Task ${task.jobId} stopped`)
                });
                task.jobId = null;
                task.isRunning = false;
                await task.save();
            }
            return task;
        } catch (error) {
            throw error;
        }
    },
    async restartTasks() {
        try {
            const tasksToRestart = await Task.find({isRunning: true});
            for (const task of tasksToRestart) {
                await this.startTask(task.user, task.id);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = taskService;
