import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function PatientPortal() {
	interface ChatMessage {
		sender: string;
		message: string;
		timestamp: number;
	}

	interface ChatGroup {
		doctorId: string;
		doctorName: string;
		messages: ChatMessage[];
	}
	interface Doctor {
		id: string;
		name: string;
		specialization: string;
	}

	const [doctors, setDoctors] = useState<Doctor[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();
	console.log(user);
	const patientId = user?.unsafeMetadata.id;
	console.log(patientId, 'patient ');
	const navigate = useNavigate();
	const [activeChats, setActiveChats] = useState<ChatGroup[]>([]);

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const res: any = await axios.get(
					'https://r4d2qg2jxl.execute-api.us-east-1.amazonaws.com/doctors-list'
				);
				setDoctors(res.data.doctors);
				// console.log(res, 'res here');
				setLoading(false);
			} catch (err) {
				console.error('Error fetching users:', err);
			}
		};

		fetchDoctors();
	}, []);

	useEffect(() => {
		if (!patientId) return;

		const fetchChats = async () => {
			try {
				const res: any = await axios.get(
					`https://oytr8jp234.execute-api.us-east-1.amazonaws.com/getPatientMessages`,
					{
						params: { patientId },
					}
				);
				setActiveChats(res.data.chats || []);
			} catch (err) {
				console.error('Failed to fetch chats:', err);
			}
		};
		fetchChats();
	}, [patientId]);
	// console.log(activeChats, 'active');
	if (loading) return <div>Loading...</div>;

	return (
		<div className='p-6'>
			<h2 className='text-2xl font-bold mb-4 text-blue-700'>
				Welcome, {user?.unsafeMetadata.firstName as string}
			</h2>
			<h2 className='text-3xl font-bold mb-4 text-blue-700'>
				Available Doctors
			</h2>

			<div className='overflow-x-auto shadow rounded-lg border border-gray-200'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-blue-50'>
						<tr>
							<th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
								Name
							</th>
							<th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
								Specialization
							</th>
							<th className='px-6 py-3 text-center text-sm font-semibold text-gray-700'>
								Action
							</th>
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-100'>
						{doctors.map(doc => (
							<tr key={doc.id} className='hover:bg-blue-50 transition'>
								<td className='px-6 py-4 text-sm text-gray-800'>{doc?.name}</td>
								<td className='px-6 py-4 text-sm text-gray-600'>
									{doc?.specialization}
								</td>
								<td className='px-6 py-4 text-center'>
									<button
										className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
										onClick={() => {
											// console.log('Consulting Doctor ID:', doc.id);
											// console.log('Patient Id:', patientId);
											alert(`Consulting ${doc?.name}`);
											const chatId = `${doc.id + '__' + patientId}`;
											navigate(`/chat/${chatId}`);
										}}
									>
										Consult
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div>
				<h2 className='mt-10 text-xl text-blue-700 mb-2 font-semibold'>
					Your Consultations
				</h2>
				{activeChats.length === 0 ? (
					<p>No consultations yet</p>
				) : (
					<ul className='space-y-2'>
						{activeChats.map(chat => {
							const lastMessage = chat.messages[chat.messages.length - 1];

							return (
								<li key={chat.doctorId} className='border p-3 rounded'>
									<div>
										Doctor: {chat.doctorName || chat.doctorId}
										<p className='text-gray-500 text-sm mt-1'>
											Last: {lastMessage?.message || ''}
										</p>
									</div>
									<button
										className='mt-2 bg-blue-600 text-white px-4 py-1 rounded'
										onClick={() =>
											navigate(`/chat/${chat.doctorId}__${patientId}`)
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
}
