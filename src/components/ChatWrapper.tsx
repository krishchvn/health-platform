import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Chat from './Chat';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ChatWrapper = () => {
	interface Doctor {
		id: string;
		name: string;
	}
	interface Patient {
		id: string;
		name: string;
	}
	const { chatId } = useParams(); // chatId = doctorId__patientId
	const { user } = useUser();

	if (!user) return <div>Loading...</div>;
	console.log(chatId, 'chtId');
	const [doctorId, patientId] = chatId!.split('__');
	const senderRole =
		user?.unsafeMetadata.id === patientId ? 'Patient' : 'Doctor';
	// if (senderRole == 'Patient') {
	// 	patientName =
	// 		user?.unsafeMetadata.firstName + ' ' + user?.unsafeMetadata.lastName;
	// }

	const [doctorName, setDoctorName] = useState('');
	const [patientName, setPatientName] = useState('');

	// console.log(doctorId, patientId, 'wrapper.tsx');

	useEffect(() => {
		const fetchNames = async () => {
			try {
				const res = await axios.get(
					' https://r4d2qg2jxl.execute-api.us-east-1.amazonaws.com/fetchList'
				);
				const { doctors, patients } = res.data as {
					doctors: Doctor[];
					patients: Patient[];
				};
				// console.log(doctors, patients, 'resdata');
				const doctor = doctors.find((d: any) => d.id === doctorId);
				const patient = patients.find((p: any) => p.id === patientId);
				// console.log(doctor, patient, 'resdata');
				setDoctorName(doctor?.name || '');
				setPatientName(patient?.name || '');
			} catch (err) {
				console.error('❌ Failed to fetch doctor/patient names', err);
			}
		};

		fetchNames();
	}, [doctorId, patientId]);

	return (
		<Chat
			doctorId={doctorId}
			patientId={patientId}
			senderRole={senderRole}
			patientName={patientName}
			doctorName={doctorName}
		/>
	);
};

export default ChatWrapper;
