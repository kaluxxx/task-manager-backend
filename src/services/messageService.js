const {Api} = require("telegram");
const {join} = require("node:path");
const {
    writeFileSync,
    createReadStream,
    unlinkSync,
    existsSync,
    statSync
} = require("node:fs");
const {CustomFile} = require("telegram/client/uploads");

const messageService = {
    sendMessage: async (client, id, message, image) => {
        try {
            await client.connect();

            if (image) {
                const media = await messageService.uploadFile(client, image);
                const sendMediaRequest = new Api.messages.SendMedia({
                    peer: id,
                    media: media,
                    message: message,
                    random_id: Math.floor(Math.random() * 1e9)
                });

                return await client.invoke(sendMediaRequest);
            }

            const sendMessageRequest = new Api.messages.SendMessage({
                peer: id,
                message: message,
                random_id: Math.floor(Math.random() * 1e9)
            });

            return await client.invoke(sendMessageRequest);
        } catch (e) {
            console.error('Error sending message:', e);
            throw e;
        }
    },
    uploadFile: async (client, image) => {
        const imageBuffer = Buffer.from(image.data.buffer);
        const tempImagePath = join(__dirname, image.name);

        writeFileSync(tempImagePath, imageBuffer);

        if (!existsSync(tempImagePath)) {
            console.error(`Failed to create file at ${tempImagePath}`);
            throw new Error(`Failed to create file at ${tempImagePath}`);
        }

        const toUpload = new CustomFile('image.jpg', statSync(tempImagePath).size, tempImagePath);
        const file = await client.uploadFile({
            file: toUpload,
            working: 1,
        });

        const media = await new Api.InputMediaUploadedPhoto({
            file: file,
        });

        unlinkSync(tempImagePath);
        return media;
    }
}

module.exports = messageService;