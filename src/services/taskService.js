const Task = require('../models/Task');
const cron = require('node-cron');
const uuid = require('uuid');
const clientService = require('./clientService');
const messageService = require('./messageService');
const taskMapper = require("../mapper/taskMapper");
const File = require("../models/file");

const taskService = {
    async createTask({name, accounts, channels, message, resendInterval}) {
        try {
            const taskToCreate = taskMapper.mapDtoToModel({
                name,
                accounts,
                channels,
                message,
                resendInterval,
            });

            const task = new Task(taskToCreate);
            await task.save();

            return task;
        } catch (error) {
            throw error;
        }
    },
    async addImage(id, fileName, buffer) {
        try {
            const image = new File({
                name: fileName,
                data: buffer
            });
            await image.save();

            const task = await taskService.getTaskById(id)
            task.image = image._id;
            await task.save();

            return task;
        } catch (error) {
            throw error;
        }
    },
    async updateImage(id, fileName, buffer) {
        try {
            const image = new File({
                name: fileName,
                data: buffer
            });
            await image.save();

            const task = await taskService.getTaskById(id)

            if (task.isRunning) {
                await taskService.stopTask(id);
            }

            if (task.image) {
                await File.findByIdAndDelete(task.image);
            }

            task.image = image._id;
            await task.save();

            if (task.isRunning) {
                await taskService.startTask(id);
            }
            return await taskService.getTaskById(id);
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
    async getTaskById(id) {
        try {
            return await Task.findById(id).populate('accounts').populate('image');
        } catch (error) {
            throw error;
        }
    },
    async deleteTask(id) {
        try {
            await Task.findOneAndDelete(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    async updateTask(id, taskToUpdate) {
        try {
            if (taskToUpdate.isRunning) {
                await taskService.stopTask(id);
            }

            const task = await Task
                .findByIdAndUpdate(id, taskToUpdate)
                .populate('accounts')
                .populate('image');

            if (taskToUpdate.isRunning) {
                await taskService.startTask(id);
            }

            return task;
        } catch (error) {
            throw error;
        }
    },
    async startTask(id) {
        try {
            const task = await Task.findById(id)
                .populate('accounts')
                .populate('image')

            if (!task) {
                throw new Error('Task not found');
            }


            cron.schedule(`*/${task.resendInterval} * * * * *`, async () => {
                console.log('Cron job executed at:', new Date());

                try {
                    task.jobId = uuid.v4();

                    for (const account of task.accounts) {
                        const client = await clientService.getClient(account.phoneNumber);
                        for (const channel of task.channels) {
                            await messageService.sendMessage(client, channel.id, task.message, task.image);
                        }
                    }
                    await task.save();
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
    async stopTask(id) {
        try {
            const task = await Task.findById(id);
            if (task.jobId) {
                // Supprimer la tâche planifiée
                cron.getTasks({jobId: task.jobId}).forEach(task => {
                    task.stop();
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
                await this.startTask(task.id);
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = taskService;
