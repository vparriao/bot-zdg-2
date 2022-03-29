const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const sessionClient = new dialogflow.SessionsClient({keyFilename: 'zdg-9un9-0aba54d6e44c.json'});

app.post('/webhook', function(request,response){
    const agent = new WebhookClient ({ request, response });
  
        let intentMap = new Map();
        intentMap.set('nomedaintencao', nomedafuncao)
        agent.handleRequest(intentMap);
}); 
function nomedafuncao (agent) {
}  
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
async function detectIntent(
    projectId,
    sessionId,
    query,
    contexts,
    languageCode
  ) {
    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );
  
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
    };
  
    if (contexts && contexts.length > 0) {
      request.queryParams = {
        contexts: contexts,
      };
    }
  
    const responses = await sessionClient.detectIntent(request);
    return responses[0];
}
async function executeQueries(projectId, sessionId, queries, languageCode) {
    let context;
    let intentResponse;
    for (const query of queries) {
        try {
            console.log(`Pergunta: ${query}`);
            intentResponse = await detectIntent(
                projectId,
                sessionId,
                query,
                context,
                languageCode
            );
            //console.log('Enviando Resposta');
            if (isBlank(intentResponse.queryResult.fulfillmentText)){
                console.log('Sem resposta definida no DialogFlow');
                return null;   
            }
            else {
                console.log('Resposta definida no DialogFlow');
                //console.log(intentResponse.queryResult.fulfillmentText);
                return `${intentResponse.queryResult.fulfillmentText}`
            }
        } catch (error) {
            console.log(error);
        }
    }
}

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});

client.initialize();

client.on('qr', (qr) => {
    console.log('BOT-ZDG QRCode recebido', qr);
});

client.on('authenticated', () => {
    console.log('BOT-ZDG Autenticado');
});

client.on('auth_failure', msg => {
    console.error('BOT-ZDG Falha na autenticação', msg);
});

client.on('ready', () => {
    console.log('BOT-ZDG Dispositivo pronto');
});

client.on('message', async msg => {
    console.log('Mensagem recebida', msg);
    let textoResposta = await executeQueries('zdg-9un9', msg.from, [msg.body], 'pt-br');
    msg.reply("*BOT ZDG:*\n" + textoResposta.replace(/\\n/g, '\n'));
});

client.on('change_state', state => {
    console.log('BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('BOT-ZDG Cliente desconectado', reason);
});
