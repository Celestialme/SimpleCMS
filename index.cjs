// Plesk Passanager
async function loadApp() {
	process.env.BODY_SIZE_LIMIT = '104857600';
	 import('./server.js');
}
loadApp();
