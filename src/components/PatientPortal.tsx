import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

export default function PatientPortal() {
	const [doctors, setDoctors] = useState([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();
	console.log(user);
	const patientId = user?.unsafeMetadata.id;

	useEffect(() => {
		const fetchDoctors = async () => {
			try {
				const res = await axios.get(
					'https://r4d2qg2jxl.execute-api.us-east-1.amazonaws.com/doctors-list'
				);
				setDoctors(res.data.doctors);
				console.log(res, 'res here');
				setLoading(false);
			} catch (err) {
				console.error('Error fetching users:', err);
			}
		};

		fetchDoctors();
	}, []);

	if (loading) return <div>Loading...</div>;

	return (
		<div className='p-6'>
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
											console.log('Consulting Doctor ID:', doc.id);
											console.log('Patient Id:', patientId);
											alert(`Consulting ${doc?.name}`);
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
		</div>
	);
}
