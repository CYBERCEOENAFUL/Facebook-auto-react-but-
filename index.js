const fs = require('fs');
const login = require('facebook-chat-api');

const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const emojiData = JSON.parse(fs.readFileSync('./emojis.json', 'utf8'));
const appState = JSON.parse(fs.readFileSync('./appstate.json', 'utf8'));

login({appState: appState}, (err, api) => {
    if(err) return console.error("Login failed!");

    console.log(`[ ONLINE ] ${config.botName} starts working.`);
    console.log(`[ CREDIT ] Created by: ${config.developer}`);

    api.listenMqtt((err, message) => {
        if(err || !message.body) return;

        const msgText = message.body.toLowerCase();

        // ১. অটো রিপ্লাই (ইনবক্স মেসেজে আপনার নাম বলবে)
        api.sendMessage(`${config.autoReply}\n\n[ Developed by ENAFUL ]`, message.threadID);

        // ২. অটো রিঅ্যাক্ট (সব ইমোজি থেকে র‍্যান্ডমলি বেছে নিবে)
        let selectedList = emojiData.default;
        for (let key in emojiData) {
            if (emojiData[key].keywords && emojiData[key].keywords.some(word => msgText.includes(word))) {
                selectedList = emojiData[key].emojis;
                break;
            }
        }

        const finalEmoji = selectedList[Math.floor(Math.random() * selectedList.length)];
        api.setMessageReaction(finalEmoji, message.messageID, (err) => {}, true);
    });
});
