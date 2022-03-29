const { Client, LocalAuth } = require('whatsapp-web.js');

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
    if (msg.body === 'oi'){
        msg.reply('olá 1');
    }
    else if (msg.body.startsWith('Como') && msg.body !== null){
        msg.reply('olá 2');
    }
    else if (msg.body.includes('alô') && msg.body !== null){
        msg.reply('olá 3');
    }
    else if (msg.body !== null){
        msg.reply('*BOT-ZDG*: Operadores JS\n1- ====\n2- startsWith\n3- includes');
    }
});

client.on('change_state', state => {
    console.log('BOT-ZDG Status de conexão: ', state );
});

client.on('disconnected', (reason) => {
    console.log('BOT-ZDG Cliente desconectado', reason);
});
