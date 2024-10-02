import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
   <Link to="/subject-std">
          SubjectStdPage
      </Link>
    <Link to="/manage-teacher">
          ManageTeacherPage
    </Link>
    </div>
  )
}

export default HomePage
