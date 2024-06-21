const {TelegramClient} = require('telegram');
const {StringSession} = require('telegram/sessions');
const Account = require('../models/Account');

const clientService = {
    async getClient(phoneNumber) {
        const account = await Account.findOne({phoneNumber});
        if (!account) {
            throw new Error('Account not found');
        }
        const session = new StringSession(account.session);

        return new TelegramClient(session, account.apiId, account.apiHash, {
            connectionRetries: 5
        });
    }
};

module.exports = clientService;