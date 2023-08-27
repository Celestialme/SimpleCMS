import { server } from './build/index.js';
import fs from 'fs';
import serve from 'serve-static';
import path from 'path';

server.get('/api/getCollections', (req, res) => {
	let files = fs.readdirSync('./collections');
	files = files.filter((file) => file !== 'config.js');
	res.end(JSON.stringify(files));
});
server.use('/api/collections', serve('./collections'));
server.routes.reverse();
