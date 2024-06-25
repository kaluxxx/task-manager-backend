const messageService = require('../services/messageService');
const {getClient} = require("../services/clientService");

exports.sendMessage = async (req, res) => {
    const {phoneNumber, chatId, message} = req.body;
    try {
        const client = await getClient(phoneNumber);
        await client.connect();
        const response = await messageService.sendMessage(client, chatId, message);
        res.send(response);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

