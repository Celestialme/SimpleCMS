// Plesk Passanager
async function loadApp() {
    process.env.BODY_SIZE_LIMIT = '104857600';
    const { app } = await import('./build/index.js');
}
loadApp();
