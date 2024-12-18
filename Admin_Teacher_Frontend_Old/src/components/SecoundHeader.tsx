import React from 'react'
import { Link } from 'react-router-dom'

const SecoundHeader = ({ title ,addCallBack, editCallBack, deleteCallBack} : any) => {
  return (
    <div>
      <Link to={addCallBack}  >Add New {title}</Link> 
      <Link to={editCallBack}>Edit {title}</Link>
      <Link to={deleteCallBack}>Delete {title}</Link>
    </div>
  )
}

export default SecoundHeader
