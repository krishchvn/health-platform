import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const DoctorPortal = () => {
	const { user } = useUser();
	const doctorId = user?.id;
	const [activeChats, setActiveChats] = useState([]);

	useEffect(() => {
		// TODO: connect to socket and fetch chats for this doctor
	}, []);

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4 text-blue-700'>
				Welcome, Dr. {user?.firstName}
			</h2>
			<div>
				<h3 className='text-xl mb-2 font-semibold'>Active Chats</h3>
				{activeChats.length === 0 ? (
					<p> Looks like nobody's ill today </p>
				) : (
					<ul className='space-y-2'>
						{activeChats.map(chat => (
							<li key={chat.patientId} className='border p-3 rounded'>
								Patient: {chat.patientName}
								<button
									className='ml-4 bg-blue-600 text-white px-4 py-1 rounded'
									onClick={() => {
										/* Navigate to Chat Room */
									}}
								>
									Open Chat
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default DoctorPortal;
