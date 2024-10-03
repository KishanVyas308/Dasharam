import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className='flex gap-2 '>
   <Link to="/subject-std" className='text-2xl font-bold text-blue-500 hover:text-blue-700'>
          SubjectStdPage
      </Link>
    <Link to="/manage-teacher" className='text-2xl font-bold text-blue-500 hover:text-blue-700'>
          ManageTeacherPage
    </Link>
    <Link to="/manage-student" className='text-2xl font-bold text-blue-500 hover:text-blue-700'>    
          ManageStudentPage
    </Link>
    </div>
  )
}

export default HomePage
