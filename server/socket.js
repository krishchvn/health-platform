import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*', // Allow all for dev
		methods: ['GET', 'POST'],
	},
});

io.on('connection', socket => {
	console.log('🔌 New client connected:', socket.id);

	socket.on('join_room', ({ doctorId, patientId }) => {
		console.log(`Here: ${doctorId}: ${patientId}`);
		const roomId = `${doctorId}__${patientId}`;
		socket.join(roomId);
		console.log(`🛏️ Joined room: ${roomId}`);
	});

	socket.on('send_message', ({ doctorId, patientId, sender, message }) => {
		const roomId = `${doctorId}__${patientId}`;
		console.log(`📩 ${sender} sent message in ${roomId}: ${message}`);

		// Broadcast message to other participant
		io.to(roomId).emit('receive_message', {
			sender,
			message,
			timestamp: Date.now(),
		});
	});

	socket.on('disconnect', () => {
		console.log('❌ Client disconnected:', socket.id);
	});
});

const PORT = 4000;
server.listen(PORT, () => {
	console.log(`🚀 Socket.io server running on http://localhost:${PORT}`);
});
