import React,{useState,useEffect} from 'react'
import logo from '../assets/images/logo.svg'
import { useNavigate } from 'react-router-dom'

const register_login = () => {
    const [suggestion,setSuggestion] = useState('Already a member ?')
    const [linkText,setLinkText] = useState('Login')    

    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [alertMsg,setAlertMsg] = useState('')
    const navigate = useNavigate()

    const toggle = () =>{
        
        // here, toggling values for register and login

        if((linkText === 'Login') && (suggestion === 'Already a member ?')){
            setLinkText('Register')
            setSuggestion('Not a member yet?')   
        }
        else{
            setLinkText('Login')
            setSuggestion('Already a member ?')   
            
        }
    }

    useEffect(()=>{
        setTimeout(()=>{
            setAlertMsg('')
        },3000)
    },[alertMsg,])

    const handleSubmit = async()=>{
        
        if(linkText==='Login'){
            if(!name || (name == ' ') || !email || (email===' ') || !password || (password===' ')){
                setAlertMsg('Please Enter Name, Email and Password.!!!')
                setEmail('')
                setPassword('')
            }

            // current Register
            let response = await fetch('http://localhost:8000/api/user/registerUser',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({
                    'name':name,
                    'email': email,
                    'password':password
                })
            })
            if(response.status == 201){
                let data = await response.json()
                localStorage.setItem('user',data.user.email)
                localStorage.setItem('token',data.token)
                setAlertMsg('User Registered.!!!..Redirecting...')
                setTimeout(()=>{
                    navigate('/dashboard')
                },2000)
            }
            else if(response.status == 400){
                setAlertMsg('Please provide all information')
            }
            else if(response.status == 406){
                setAlertMsg('Email already used... try different one.!!')
            }
            else{
                let error = await response.json()
                console.log(error)
                /*
                let errorMsg = error.errorMsg + ''
                setAlertMsg(errorMsg)
                */
            }
        }
        else{
            if(!email || (email===' ') || !password || (password===' ')){
                setAlertMsg('Please Enter Name, Email and Password.!!!')
                setEmail('')
                setPassword('')
            }
            // current Login
            let response = await fetch('http://127.0.0.1:8000/api/user/loginUser',{
                method : 'POST',
                headers : {
                    'Content-Type':'application/json'
                },
                body : JSON.stringify({
                    'email':email,
                    'password':password
                })
            })
            if(response.status == 200){
                let data = await response.json()
                console.log(data)
                localStorage.setItem('user',data.user.email)
                localStorage.setItem('token',data.token)
                setAlertMsg('Login successful.!!!Redirecting...')
                setTimeout(()=>{
                    navigate('/dashboard')
                },2000)
            }else if(response.status == 401){
                setAlertMsg('Invalid Credentials.!!!')
            }
            else{
                let errorMsg = await response.json()
                console.log(errorMsg)
                setAlertMsg('Error Occured in loging in.!!! Try again.!')
            }
        }
    }

    return (
    <div className='register-login-page'>
        <div className='centertab'>
            <div className='centertab-head'>
                <img src={logo} alt="Can't load img" />
                
                {
                    // here, toggling of Register and Login
                    (linkText==='Login')?
                    (<h2>Register</h2>):
                    (<h2>Login</h2>)
                }
                <p className='alertMsg'>{alertMsg}</p>
            </div>
            <div className='register-login-form'>
                {
                    (linkText === 'Login')
                    ?(<label htmlFor='name'>
                        Name
                       </label>
                    ):(<></>)
                }
                {
                    (linkText === 'Login')
                    ?(<input 
                        type='text' 
                        name='username' 
                        id='name' 
                        value={name} 
                        onChange={(e)=>setName(e.target.value)} 
                        required
                    />  

                    ):(<></>)

                }    
                <label htmlFor='email'>
                    Email
                </label>
                <input 
                    type='email' 
                    name='useremail' 
                    id='email' 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                    required
                />
                <label htmlFor='password'>
                    Password
                </label>
                <input 
                    type='password' 
                    name='password' 
                    id='password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required 
                />
                <button className='submit-btn' onClick={handleSubmit}>
                    Submit
                </button>
                <p>{suggestion} <span onClick={toggle}>{linkText}</span></p>
            </div>
        </div>
    </div>
  )
}

export default register_login