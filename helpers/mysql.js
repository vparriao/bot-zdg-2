const mysql = require('mysql2/promise');

const createConnection = async () => {
	return await mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'zdg'
	});
}

const getReply = async (keyword) => {
	const connection = await createConnection();
	const [rows] = await connection.execute('SELECT resposta FROM botzdg WHERE pergunta = ?', [keyword]);
	if (rows.length > 0) return rows[0].resposta;
	return false;
}

module.exports = {
	createConnection,
	getReply
}