const {
    WebClient
} = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);
module.exports = {
    slack: async function (message, from, to) {
        // const res = await web.conversations.list()
        // res.channels.forEach(channel =>{
        //     console.log(channel.id,channel.name);
        // })
        const userId = to || process.env.SEND_TO || 'C01PX9SCTC0'//'CQXBA8BK9'
        if (process.env.SLACK_ALERTS === 'true')
            await web.chat.postMessage({
                channel: userId,
                username: from || 'blue-sky',
                text: `Env: ${process.env.ENV_MODE}\n${message}` || `Env: ${process.env.ENV_MODE}\n${new Date().toLocaleString('en-US')} Something went wrong.`,
            });
        else
            console.log('In dev mode slack alert blocked')
        console.log(new Date().toLocaleString('en-US'), 'Message Posted');
    }
}