import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Chat from './Chat';

const ChatWrapper = () => {
	const { chatId } = useParams(); // chatId = doctorId__patientId
	const { user } = useUser();

	if (!user) return <div>Loading...</div>;
	console.log(chatId, 'chtId');
	const [doctorId, patientId] = chatId!.split('__');
	const senderRole =
		user?.unsafeMetadata.id === patientId ? 'Patient' : 'Doctor';
	let patientName = '';
	if (senderRole == 'Patient') {
		patientName =
			user?.unsafeMetadata.firstName + ' ' + user?.unsafeMetadata.lastName;
	}
	console.log(doctorId, patientId, 'wrapper.tsx');

	return (
		<Chat
			doctorId={doctorId}
			patientId={patientId}
			senderRole={senderRole}
			patientName={patientName}
		/>
	);
};

export default ChatWrapper;
