import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export default function RoleSelect() {
	const { user } = useUser();
	const navigate = useNavigate();
	const [role, setRole] = useState('patient');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [occupation, setOccupation] = useState('');

	const handleSubmit = async () => {
		if (!user) return;

		await user?.update({
			unsafeMetadata: { firstName, lastName, role, occupation },
		});
		const email = user?.primaryEmailAddress?.emailAddress;
		if (email === null) {
			alert('Please Sign in Again!');
		}

		if (role === 'doctor') {
			try {
				await axios.post(
					'https://r4d2qg2jxl.execute-api.us-east-1.amazonaws.com/doctors-list',
					{
						id: Math.random().toString(36).substring(2, 10),
						name: `${firstName} ${lastName}`,
						occupation: `${occupation}`,
						role: 'Doctor',
						email: email,
					}
				);
				alert('Doctor saved successfully!');
				navigate('/doctor-dashboard');
			} catch (error) {
				console.error('Error saving doctor:', error);
				alert('Failed to save doctor');
			}
		} else {
			try {
				await axios.post(
					'https://r4d2qg2jxl.execute-api.us-east-1.amazonaws.com/patients-list',
					{
						id: Math.random().toString(36).substring(2, 10),
						name: `${firstName} ${lastName}`,
						occupation: `${occupation}`,
						role: 'Patient',
						email: email,
					}
				);
				alert('patient saved successfully!');
				navigate('/patient-dashboard');
			} catch (error) {
				console.error('Error saving patient:', error);
				alert('Failed to save patient');
			}
		}
	};

	return (
		<div className='p-8 max-w-md mx-auto text-center'>
			<input
				type='text'
				placeholder='First Name'
				className='border p-2 w-full mb-2'
				value={firstName}
				onChange={e => setFirstName(e.target.value)}
			/>
			<input
				type='text'
				placeholder='Last Name'
				className='border p-2 w-full mb-2'
				value={lastName}
				onChange={e => setLastName(e.target.value)}
			/>
			<input
				type='text'
				placeholder='Occupation'
				className='border p-2 w-full mb-4'
				value={occupation}
				onChange={e => setOccupation(e.target.value)}
			/>
			<h1 className='text-2xl font-semibold mb-4'>Choose your role</h1>
			<select
				className='border rounded p-2 w-full mb-4'
				value={role}
				onChange={e => setRole(e.target.value)}
			>
				<option value='patient'>Patient</option>
				<option value='doctor'>Doctor</option>
			</select>
			<button
				onClick={handleSubmit}
				className='bg-blue-600 text-white px-4 py-2 rounded'
			>
				Continue
			</button>
		</div>
	);
}
