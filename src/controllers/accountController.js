const accountService = require('../services/accountService');
const accountMapper = require("../mapper/accountMapper");

const accountController = {
    async createAccount(req, res, next) {
        try {
            const { phoneNumber, apiId, apiHash } = req.body;
            const account = await accountService
                .createAccount({ phoneNumber, apiId, apiHash })
                .then(account => accountMapper.mapModelToDto(account));
            res.status(201).json(account);
        } catch (e) {
            next(e); // Passer l'erreur au middleware de gestion des erreurs
        }
    },
    async disableAccount(req, res, next) {
        try {
            const { id } = req.params;

            const account = await accountService
                .disableAccount(id)
                .then(account => accountMapper.mapModelToDto(account));

            res.send(account);
        } catch (e) {
            next(e);
        }
    },
    async getAccounts(req, res, next) {
        try {
            const accounts = await accountService
                .getAccounts()
                .then(accounts => accountMapper.mapModelsToDtos(accounts));

            res.send(accounts);
        } catch (e) {
            next(e);
        }
    },
    async getAccountById(req, res, next) {
        try {
            const { id } = req.params;
            const account = await accountService
                .getAccountById(id)
                .then(account => accountMapper.mapModelToDto(account));
            res.send(account);
        } catch (e) {
            next(e);
        }
    },
    async updateAccount(req, res, next) {
        try {
            const { id } = req.params;
            const { phoneNumber, apiId, apiHash } = req.body;
            const account = await accountService
                .updateAccount(id, { phoneNumber, apiId, apiHash })
                .then(account => accountMapper.mapModelToDto(account));
            res.send(account);
        } catch (e) {
            next(e);
        }
    },
    async deleteAccount(req, res, next) {
        try {
            const { id } = req.params;
            await accountService.deleteAccount(id);
            res.send('Account deleted');
        } catch (e) {
            next(e);
        }
    }
};

module.exports = accountController;
