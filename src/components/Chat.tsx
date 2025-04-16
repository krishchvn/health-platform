import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000'); // Replace with deployed URL later

export default function Chat({ doctorId, patientId, senderRole }) {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		console.log(doctorId, patientId, 'chat.tsx');
		socket.emit('join_room', { doctorId, patientId });

		socket.on('receive_message', data => {
			setMessages(prev => [...prev, data]);
		});

		return () => {
			socket.off('receive_message');
		};
	}, [doctorId, patientId]);

	const sendMessage = async () => {
		console.log(doctorId, patientId, senderRole, message, Date.now());
		if (!message) return;
		const msgPayload = {
			doctorId,
			patientId,
			sender: senderRole,
			message,
			timestamp: Date.now(),
		};

		socket.emit('send_message', msgPayload);
		try {
			await axios.post(
				'https://oytr8jp234.execute-api.us-east-1.amazonaws.com/postMessages',
				{
					doctorId,
					patientId,
					sender: senderRole,
					message,
					timestamp: Date.now(),
				}
			);
			console.log('inside await fetch');
		} catch (err) {
			console.error('Failed to save message to DynamoDB:', err);
		}
		setMessages(prev => [...prev, { sender: senderRole, message }]);
		setMessage('');
	};

	return (
		<div className='p-4 max-w-xl mx-auto space-y-4'>
			<div className='h-64 overflow-y-auto border rounded p-2 bg-white shadow'>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`mb-2 text-sm ${
							msg.sender === senderRole
								? 'text-right text-blue-600'
								: 'text-left text-gray-700'
						}`}
					>
						<span>{msg.message}</span>
					</div>
				))}
			</div>

			<div className='flex space-x-2'>
				<input
					className='border flex-1 px-2 py-1 rounded'
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder='Type a message...'
				/>
				<button
					onClick={sendMessage}
					className='bg-blue-600 text-white px-4 py-1 rounded'
				>
					Send
				</button>
			</div>
		</div>
	);
}
