import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from '@clerk/clerk-react';

const Navbar = () => {
	return (
		<nav className='flex items-center justify-between p-4 bg-white shadow-md'>
			<div className='text-2xl font-bold text-blue-600'>Health Platform</div>
			<div className='space-x-4'>
				<SignedOut>
					<SignInButton>
						<button className='px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700'>
							Login
						</button>
					</SignInButton>
					<SignUpButton forceRedirectUrl='/select-role'>
						<button className='px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700'>
							Sign Up
						</button>
					</SignUpButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</nav>
	);
};

export default Navbar;
