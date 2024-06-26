const { TelegramClient, Api} = require("telegram");
const { StringSession } = require("telegram/sessions");
const { generatePromise } = require("../utils/promiseGenerator");
const Account = require('../models/account');
const { ConflictError, NotFoundError } = require('../utils/errors');

let globalPhoneCodePromise = null;

const accountService = {
    async createAccount({ user, phoneNumber, apiId, apiHash }) {
        try {
            const existingAccount = await Account.findOne({ phoneNumber });
            if (existingAccount) {
                throw new ConflictError('Account with this phone number already exists');
            }

            const account = new Account({ user, phoneNumber, apiId, apiHash });
            await account.save();
            return account;
        } catch (error) {
            throw error;
        }
    },
    async activateAccount(id) {
        try {
            const account = await Account.findById(id);
            if (!account) {
                throw new NotFoundError('Account not found');
            }
            const { apiId, apiHash, phoneNumber } = account;
            const session = new StringSession();
            const client = new TelegramClient(session, apiId, apiHash, {
                connectionRetries: 5,
            });

            globalPhoneCodePromise = generatePromise()

            await client.start({
                phoneNumber: phoneNumber,
                phoneCode: async () => {
                    const code = await globalPhoneCodePromise.promise;
                    globalPhoneCodePromise = generatePromise();
                    return code;
                },
                onError: (err) => {
                    throw new Error(err.message || 'Failed to start Telegram client');
                },
            });

            const user = await client.getMe();
            account.session = session.save();
            account.username = user.username;
            account.userId = user.id;
            account.isActivated = true;

            await account.save();

            return account;
        } catch (e) {
            console.log('Error:', e)
            throw new Error('Login failed');
        }
    },
    async disableAccount(id) {
        try {
            const account = await Account.findById(id);
            if (!account) {
                throw new NotFoundError('Account not found');
            }

            account.isActivated = false;
            account.session = null;

            await account.save();

            return account;
        } catch (e) {
            throw new Error('Failed to disable account');
        }
    },
    async verifyCode(id, phoneCode) {
        if (!phoneCode) {
            globalPhoneCodePromise.reject('Phone code is required');
            return;
        }
        globalPhoneCodePromise.resolve(phoneCode);
    },
    async getAccounts(user) {
        try {
            return await Account.find({ user });
        } catch (e) {
            throw new Error('Failed to get accounts');
        }
    },
    async getAccountById(user, id) {
        try {
            const account = await Account.findOne({ user, _id: id });
            if (!account) {
                throw new NotFoundError('Account not found');
            }
            return account;
        } catch (e) {
            throw new Error('Failed to get account by ID');
        }
    },
    async updateAccount(user, id, { phoneNumber, apiId, apiHash }) {
        try {
            const account = await Account.findOne({ user, _id: id });
            if (!account) {
                throw new NotFoundError('Account not found');
            }
            account.phoneNumber = phoneNumber;
            account.apiId = apiId;
            account.apiHash = apiHash;
            await account.save();
            return account;
        } catch (e) {
            throw new Error('Failed to update account');
        }
    },
    async deleteAccount(user, id) {
        try {
            const account = await Account.findOne({ user, _id: id });
            if (!account) {
                throw new NotFoundError('Account not found');
            }
            await Account.findByIdAndDelete(id);
        } catch (e) {
            throw new Error('Failed to delete account');
        }
    }
};

module.exports = accountService;
