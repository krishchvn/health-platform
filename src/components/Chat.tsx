import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

interface ChatProps {
	doctorId: string;
	patientId: string;
	senderRole: 'Doctor' | 'Patient';
}

interface ChatMessage {
	sender: string;
	message: string;
	timestamp: number;
}

const socket = io('http://localhost:4000'); // Replace with your deployed URL

export default function Chat({
	doctorId,
	patientId,
	senderRole,
	patientName,
	doctorName,
}: ChatProps) {
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	console.log(doctorId, patientId, 'ids', patientName, doctorName);
	const chatId = `${doctorId}__${patientId}`;

	// Fetch existing messages from DynamoDB on load
	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const res = await axios.get(
					'https://oytr8jp234.execute-api.us-east-1.amazonaws.com/getAllMessages',
					{
						params: { chatId },
					}
				);
				setMessages(res.data.messages || []);
			} catch (err) {
				console.error('❌ Error fetching chat history:', err);
			}
		};

		fetchMessages();
	}, [chatId]);

	// console.log(messages, 'mesages');
	useEffect(() => {
		socket.emit('join_room', { doctorId, patientId });

		socket.on('receive_message', (data: ChatMessage) => {
			setMessages(prev => [...prev, data]);
		});

		return () => {
			socket.off('receive_message');
		};
	}, [doctorId, patientId]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = async () => {
		if (!message.trim()) return;
		console.log(doctorName, patientName, 'dp');
		const msgPayload = {
			doctorId,
			patientId,
			sender: senderRole,
			message,
			timestamp: Date.now(),
			patientName,
			doctorName,
		};

		// Emit through socket
		socket.emit('send_message', msgPayload);

		// Save to DynamoDB via Lambda
		try {
			await axios.post(
				'https://oytr8jp234.execute-api.us-east-1.amazonaws.com/postMessages',
				msgPayload
			);
		} catch (err) {
			console.error('❌ Failed to save message to DynamoDB:', err);
		}

		setMessages(prev => [...prev, msgPayload]);
		setMessage('');
	};

	const handleImageUpload = async (file: File) => {
		const timestamp = Date.now();
		const fileName = `${timestamp}_${doctorId}_${doctorName}_${patientId}_${patientName}_${senderRole}`;
		const s3Url = `https://platform-chat-images.s3.amazonaws.com/${fileName}`;

		try {
			await axios.put(s3Url, file, {
				headers: { 'Content-Type': file.type },
			});

			console.log('✅ Uploaded image to:', s3Url);

			// Optional: show placeholder while EventBridge processes it
			setMessages(prev => [
				...prev,
				{
					sender: senderRole,
					message: '[Image uploaded]',
					imageUrl: s3Url,
					timestamp,
				},
			]);
		} catch (err) {
			console.error('❌ Image upload failed:', err);
		}
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) handleImageUpload(file);
	};

	return (
		<div className='p-4 max-w-xl mx-auto space-y-4'>
			<div className='h-[calc(100vh-8rem)] w-full overflow-y-auto border rounded p-4 bg-white shadow-lg'>
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`mb-2 text-sm ${
							msg.sender === senderRole
								? 'text-right text-blue-600'
								: 'text-left text-gray-700'
						}`}
					>
						{msg.message?.includes('s3.amazonaws.com') ||
						msg.message?.startsWith('http') ? (
							<img
								src={msg.message}
								alt='chat-img'
								className='w-40 rounded shadow'
							/>
						) : (
							<span>{msg.message}</span>
						)}
					</div>
				))}
				<div ref={scrollRef} />
			</div>

			<div className='flex space-x-2'>
				<input
					className='border flex-1 px-2 py-1 rounded'
					value={message}
					onChange={e => setMessage(e.target.value)}
					placeholder='Type a message...'
				/>
				<button
					className='bg-green-600 text-white px-2 py-1 rounded'
					onClick={() => fileInputRef.current?.click()}
				>
					Send Image
				</button>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/*'
					onChange={handleFileChange}
					className='hidden'
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
