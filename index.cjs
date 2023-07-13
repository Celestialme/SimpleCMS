// Plesk Passanager
async function loadApp() {
	const { app } = await import('./build/index.js');
}
loadApp();
