const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios')

class EchoBot extends ActivityHandler {
    constructor() {
        super()

        this.onMessage(async (context, next) => {
            if(context.activity.text.startsWith("!session ")){
                const content = context.activity.text.replace('!session ', '')
                var replyText = content;

                const url = "http://127.0.0.1/otrs/nph-genericinterface.pl/Webservice/api-v2/session"

                const params = {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        UserLogin: "root@localhost",
                        Password: "102030"
                      })
                }

                const response = await axios.post(url, params.body)
                const data = response.data
                
                console.log(data)
                replyText = content.split(' ').map(() => data['SessionID']).join(' ')

                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
            else{
                const replyText = `Echo: ${ context.activity.text }`;
                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
            
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
