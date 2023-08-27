import { server } from './build/index.js';
import fs from 'fs';
import serve from 'serve-static';

// Define route handler for GET /api/getCollections
server.get('/api/getCollections', (req, res) => {
	// Read files in ./collections directory
	let files = fs.readdirSync('./collections');
	// Filter out config.js file
	files = files.filter((file) => file !== 'config.js');
	// Send response with JSON-encoded array of file names
	res.end(JSON.stringify(files));
});

// Serve static files from ./collections directory at /api/collections
server.use('/api/collections', serve('./collections'));
// Reverse server routes
server.routes.reverse();
