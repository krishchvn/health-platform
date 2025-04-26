import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChatMessage {
	sender: string;
	message: string;
	timestamp: number;
}

interface ChatGroup {
	patientId: string;
	patientName: string;
	messages: ChatMessage[];
}

const DoctorPortal = () => {
	const { user } = useUser();
	const navigate = useNavigate();
	const doctorId = user?.unsafeMetadata.id;
	const [activeChats, setActiveChats] = useState<ChatGroup[]>([]);

	useEffect(() => {
		if (!doctorId) return;

		const fetchChats = async () => {
			try {
				const res: any = await axios.get(
					`https://oytr8jp234.execute-api.us-east-1.amazonaws.com/getMessages`,
					{
						params: { doctorId },
					}
				);
				setActiveChats(res.data.chats || []);
			} catch (err) {
				console.error('Failed to fetch chats:', err);
			}
		};

		fetchChats();
	}, [doctorId]);

	console.log(activeChats);
	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4 text-blue-700'>
				Welcome, Dr. {user?.unsafeMetadata.firstName as string}
			</h2>
			<div>
				<h3 className='text-xl mb-2 font-semibold'>Active Chats</h3>
				{activeChats.length === 0 ? (
					<p>Looks like nobody's ill today</p>
				) : (
					<ul className='space-y-2'>
						{activeChats.map(chat => {
							const lastMessage = chat.messages[chat.messages.length - 1];

							return (
								<li key={chat.patientId} className='border p-3 rounded'>
									<div>
										Patient: {chat.patientName}
										<p className='text-gray-500 text-sm mt-1'>
											Last: {lastMessage?.message || ''}
										</p>
									</div>
									<button
										className='mt-2 bg-blue-600 text-white px-4 py-1 rounded'
										onClick={() =>
											navigate(`/chat/${doctorId}__${chat.patientId}`)
										}
									>
										Open Chat
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
};

export default DoctorPortal;
