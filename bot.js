const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios')

class EchoBot extends ActivityHandler {
    constructor() {
        super()
        this.onMessage(async (context, next) => {
            if(context.activity.text.startsWith("!session ")){
                const content = context.activity.text.replace('!session ', '')
                var replyText = content;
                
                switch(replyText){
                    case "create":
                        const url = `http://${process.env.FQDN}/otrs/nph-genericinterface.pl/Webservice/api-v2/session`
                        const username = process.env.USER
                        const password = process.env.PASSWORD
                        
                        const params = {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                UserLogin: username,
                                Password: password
                            })
                        }

                        const response = await axios.post(url, params.body)
                        const data = response.data
                        
                        console.log(data)
                        replyText = content.split(' ').map(() => data['SessionID']).join(' ')
                        break;

                    default:
                        replyText = `I Don't understand, patron! Please try tell me again...`;
                        break;
                }
                     
                await context.sendActivity(MessageFactory.text(replyText, replyText));
            }
            
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Welcome! My name is Botinho. Tell me your command, Patron!';

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