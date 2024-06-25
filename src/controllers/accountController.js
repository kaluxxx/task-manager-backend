const accountService = require('../services/accountService');
const accountMapper = require("../mapper/accountMapper");

const accountController = {
    async createAccount(req, res, next) {
        try {
            const { phoneNumber, apiId, apiHash } = req.body;
            const user = req.user;
            const account = await accountService
                .createAccount({ user, phoneNumber, apiId, apiHash })
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
            const user = req.user;
            const accounts = await accountService
                .getAccounts(user)
                .then(accounts => accountMapper.mapModelsToDtos(accounts));

            res.send(accounts);
        } catch (e) {
            next(e);
        }
    },
    async getAccountById(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user;
            const account = await accountService
                .getAccountById(user, id)
                .then(account => accountMapper.mapModelToDto(account));
            res.send(account);
        } catch (e) {
            next(e);
        }
    },
    async updateAccount(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user;
            const { phoneNumber, apiId, apiHash } = req.body;
            const account = await accountService
                .updateAccount(user, id, { phoneNumber, apiId, apiHash })
                .then(account => accountMapper.mapModelToDto(account));
            res.send(account);
        } catch (e) {
            next(e);
        }
    },
    async deleteAccount(req, res, next) {
        try {
            const { id } = req.params;
            const user = req.user;
            await accountService.deleteAccount(user, id);
            res.send('Account deleted');
        } catch (e) {
            next(e);
        }
    }
};

module.exports = accountController;
