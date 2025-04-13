import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
	const { user } = useUser();
	const navigate = useNavigate();
	if (user) {
		if (user?.unsafeMetadata.role === 'doctor') navigate('/doctor-dashboard');
		else navigate('/patient-dashboard');
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Hero Section */}
			<section className='grid grid-cols-1 md:grid-cols-2 gap-10 p-10 items-center'>
				<div className='space-y-4'>
					<h1 className='text-4xl font-bold text-gray-800'>
						Your Health, Our Priority
					</h1>
					<p className='text-gray-600 text-lg'>
						Connect with certified doctors, describe your symptoms, and get
						real-time consultations online — all from the comfort of your home.
					</p>
				</div>
				<img
					src='https://images.unsplash.com/photo-1588776814546-ec7e4b2c8273?auto=format&fit=crop&w=800&q=80'
					alt='Online Consultation'
					className='rounded-lg shadow-md'
				/>
			</section>

			{/* Feature Cards */}
			<section className='grid grid-cols-1 md:grid-cols-3 gap-6 p-10'>
				<div className='bg-white p-6 rounded-lg shadow-md text-center'>
					<img
						src='https://cdn-icons-png.flaticon.com/512/3275/3275963.png'
						className='w-16 h-16 mx-auto mb-4'
						alt='Doctor'
					/>
					<h2 className='text-xl font-semibold mb-2'>Qualified Doctors</h2>
					<p className='text-gray-600'>
						Consult with verified professionals across various specialties.
					</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow-md text-center'>
					<img
						src='https://cdn-icons-png.flaticon.com/512/2965/2965567.png'
						className='w-16 h-16 mx-auto mb-4'
						alt='Form'
					/>
					<h2 className='text-xl font-semibold mb-2'>Easy Symptom Reporting</h2>
					<p className='text-gray-600'>
						Fill a quick form to describe your symptoms and medical history.
					</p>
				</div>
				<div className='bg-white p-6 rounded-lg shadow-md text-center'>
					<img
						src='https://cdn-icons-png.flaticon.com/512/1132/1132103.png'
						className='w-16 h-16 mx-auto mb-4'
						alt='Chat'
					/>
					<h2 className='text-xl font-semibold mb-2'>Real-time Chat</h2>
					<p className='text-gray-600'>
						Chat instantly with your doctor through our secure platform.
					</p>
				</div>
			</section>
		</div>
	);
}
