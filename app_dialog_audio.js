const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const {WebhookClient} = require('dialogflow-fulfillment');
const dialogflow = require('@google-cloud/dialogflow');
const util = require("util");
const fs = require('fs');
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
async function detectIntentwithTTSResponse(projectId,
    sessionId,
    query,
    languageCode) {
      const sessionPath = sessionClient.projectAgentSessionPath(
        projectId,
        sessionId
      );
      // The audio query request
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode,
        },
      },
      outputAudioConfig: {
        audioEncoding: 'OUTPUT_AUDIO_ENCODING_OGG_OPUS',
      },
    };
    const responses = await sessionClient.detectIntent(request);
    const audioFile = responses[0].outputAudio;
    const outputFile = './' + sessionId + '.ogg';
    util.promisify(fs.writeFile)(outputFile, audioFile, 'base64');
    console.log(`Audio content written to file: ${outputFile}`);
    return responses[0];
} 
async function executeQueriesAudio(projectId, sessionId, queries, languageCode) {
    let intentResponse;
    for (const query of queries) {
        try {
            console.log(`Pergunta: ${query}`);
            intentResponse = await detectIntentwithTTSResponse(
                projectId,
                sessionId,
                query,
                languageCode
            );
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
    puppeteer: { headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" }
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
    function delay(t, v) {
        return new Promise(function(resolve) { 
            setTimeout(resolve.bind(null, v), t)
        });
     }
    let textoRespostaAudio = await executeQueriesAudio('zdg-9un9', msg.from, [msg.body], 'pt-br');
    const chat = await msg.getChat();
    msg.reply("*BOT ZDG:*\n" + textoRespostaAudio.replace(/\\n/g, '\n'));
    delay(3000).then(function() {
        console.log("Gravando áudio.");
        chat.sendStateRecording();
    });
    delay(6000).then(function() {
        console.log("Baixando a resposta.");
        const mediaResposta = MessageMedia.fromFilePath('./' + msg.from + '.ogg');
        client.sendMessage(msg.from, mediaResposta, {sendAudioAsVoice: true});
    });
});

client.on('change_state', state => {
    console.log('BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('BOT-ZDG Cliente desconectado', reason);
});
