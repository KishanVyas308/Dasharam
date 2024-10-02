import React, { useState } from 'react'
import { login } from '../../backend/auth';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { currentAdminState } from '../../state/currentAdminAtom';

const Login = () => {
    const [name, setNmae] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [currentAdmin, setCurrentAdmin] = useRecoilState(currentAdminState);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const admin = await login(name, password);
        if(admin){
            localStorage.setItem('user', JSON.stringify(admin));
            setCurrentAdmin(admin);
            navigate('/');
        }   
        else{
            alert('Invalid Email or Password');
        }
        
    };
  return (
    <div>
      <div>Login</div>
      <input type="text" placeholder="name" value={name} onChange={(e) => setNmae(e.target.value)} />    
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Login</button>
    
    </div>
  )
}

export default Login
