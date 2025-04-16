import { useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Chat from './Chat';

const ChatWrapper = () => {
	const { chatId } = useParams(); // chatId = doctorId__patientId
	const { user } = useUser();

	if (!user) return <div>Loading...</div>;
	console.log(chatId, 'chtId');
	const [doctorId, patientId] = chatId!.split('_');
	const senderRole =
		user?.unsafeMetadata.id === patientId ? 'Patient' : 'Doctor';
	console.log(doctorId, patientId, 'wrapper.tsx');

	return (
		<Chat doctorId={doctorId} patientId={patientId} senderRole={senderRole} />
	);
};

export default ChatWrapper;
