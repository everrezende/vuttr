const cluster = require('cluster');
const os = require('os');

/**
 * Arquivo responsavel pela inicialização e multi-thread da aplicacao
 */

const cpus = os.cpus();

if (cluster.isMaster) {
	console.log('Iniciando cluster master...');

	cpus.forEach(cpu => {
		cluster.fork();
	});

	cluster.on('listening', worker => {
		console.log(
			`Novo cluster iniciado - processo (PID): ${worker.process.pid}`
		);
	});

	cluster.on('exit', worker => {
		console.log(`Cluster finalizado (PID ${worker.process.pid})`);
		cluster.fork();
	});
} else {
	console.log('Iniciando cluster slave...');
	console.log('Subindo nova instancia da aplicação');
	require('./src/server.js');
}
