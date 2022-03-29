const { Client, LocalAuth } = require('whatsapp-web.js');
const db = require('./helpers/mysql.js');

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
    const keyword = msg.body.toLowerCase();
    const replyMessage = await db.getReply(keyword);
    if (replyMessage !== false){
        msg.reply(replyMessage);
      }
});

client.on('change_state', state => {
    console.log('BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('BOT-ZDG Cliente desconectado', reason);
});
