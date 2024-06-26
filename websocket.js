const WebSocket = require('ws');
const accountService = require('./src/services/accountService');
const accountMapper = require("./src/mapper/accountMapper");

const configureWebSocket = () => {
    const ws = new WebSocket.Server({ host: '0.0.0.0', port: 8080 });

    ws.on('connection', (ws) => {
        console.log('WebSocket connection established');

        ws.on('message', async (message) => {
            const { type, accountId, phoneCode } = JSON.parse(message);

            if (type === 'activateAccount') {
                try {
                    ws.send(JSON.stringify({ type: 'codeSend' }));

                    const account = await accountService
                        .activateAccount(accountId)
                        .then((account) => accountMapper.mapModelToDto(account));

                    console.log('Account activated:', account)
                    ws.send(JSON.stringify({ type: 'accountActivated', account }));
                } catch (e) {
                    ws.send(JSON.stringify({ type: 'error', message: e.message }));
                }
            } else if (type === 'verifyCode') {
                try {
                    await accountService
                        .verifyCode(accountId, phoneCode)
                        .then((account) => accountMapper.mapModelToDto(account));

                    ws.send(JSON.stringify({ type: 'accountVerified', account }));
                } catch (e) {
                    ws.send(JSON.stringify({ type: 'error', message: e.message }));
                }
            }
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    return ws;
};

module.exports = configureWebSocket;
