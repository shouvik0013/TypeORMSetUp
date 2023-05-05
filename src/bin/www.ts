#!/usr/bin/env node
import app from '../app';
import http from 'http';
import { appDataSource } from '../../db/data-source';

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

appDataSource
	.initialize()
	.then(() => {
		console.log('Data-Source initialized');
        
		server.listen(port);
		server.on('listening', onListening);
		server.on('error', onError);
	})
	.catch((err) => {
		console.log(err);
	});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
	let port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}

	let bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	let addr = server.address();
	let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	//console.log(`🚀 @ http://localhost:${PORT}`)
	console.log('Listening on 🚀 ' + bind);
}
