import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import RoleSelect from './components/RoleSelect';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/select-role' element={<RoleSelect />} />
				<Route
					path='/patient-dashboard'
					element={
						<SignedIn>
							<PatientPortal />
						</SignedIn>
					}
				/>
				<Route
					path='/doctor-dashboard'
					element={
						<SignedIn>
							<DoctorPortal />
						</SignedIn>
					}
				/>
				<Route path='*' element={<RedirectToSignIn />} />
			</Routes>
		</>
	);
}
