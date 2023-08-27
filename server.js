async function start() {
	import('./build/index.js')
		.then(({ server }) => {
			server.post('/api/close', (req, res) => {
				process.exit(0);
			});
			server.get('/api/close', (req, res) => {
				process.exit(0);
			});
			server.routes.reverse();
			process.on('exit', () => {
				console.log('exiting');
			});
		})
		.catch((e) => {
			setTimeout(() => {
				start();
			}, 10);
		});
}

start();
