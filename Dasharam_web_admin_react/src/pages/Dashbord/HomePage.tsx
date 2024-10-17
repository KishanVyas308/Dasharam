import { Link } from 'react-router-dom';

const HomePage = () => {
      const handleLogout = () => {
            // Add logout functionality here
            console.log('User logged out');
      };

      return (
            <div className='min-h-screen flex flex-col bg-gray-50'>
                  <header className='bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 shadow-lg'>
                        <h1 className='text-4xl font-extrabold text-center'>Dasharam Student Management System</h1>
                  </header>

                  <main className='flex-grow p-8'>
                        <h2 className='text-3xl mb-6 text-center font-semibold text-gray-900'>Welcome to Dasharam School</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                              <Link to="/subject-std" className='bg-white shadow-md rounded-lg p-6 text-center hover:bg-purple-50 transition'>
                                    <h3 className='text-xl font-bold text-purple-600'>SubjectStdPage</h3>
                              </Link>
                              <Link to="/manage-teacher" className='bg-white shadow-md rounded-lg p-6 text-center hover:bg-purple-50 transition'>
                                    <h3 className='text-xl font-bold text-purple-600'>ManageTeacherPage</h3>
                              </Link>
                              <Link to="/manage-student" className='bg-white shadow-md rounded-lg p-6 text-center hover:bg-purple-50 transition'>
                                    <h3 className='text-xl font-bold text-purple-600'>ManageStudentPage</h3>
                              </Link>
                              <Link to="/manage-test" className='bg-white shadow-md rounded-lg p-6 text-center hover:bg-purple-50 transition'>
                                    <h3 className='text-xl font-bold text-purple-600'>Manage Test</h3>
                              </Link>
                              <Link to="/add-attedance" className='bg-white shadow-md rounded-lg p-6 text-center hover:bg-purple-50 transition'>
                                    <h3 className='text-xl font-bold text-purple-600'>Add Attedance</h3>
                              </Link>
                        </div>
                  </main>

                  <footer className='bg-gray-900 text-white p-6 flex justify-between items-center'>
                        <span>&copy; 2023 Dasharam School</span>
                        <button onClick={handleLogout} className='bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded'>
                              Logout
                        </button>
                  </footer>
            </div>
      );
};

export default HomePage;
