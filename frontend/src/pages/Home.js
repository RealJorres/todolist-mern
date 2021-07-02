import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CredentialContext } from "../App";
import Todo from '../component/Todos';

export default function Home(){

    const [credentials, setCredentials] = useContext(CredentialContext);

    const logOut = () =>{
        localStorage.clear();
        setCredentials(null);
    };

    return <div id='home'>
        {/* Pag di naka-log-in */}
        {!credentials && <div className='container labas' >
            <div className='row'>
                <div className='twelve columns'><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
                <h1 id='labas'>Are you ready to write your Todo List?</h1>
                </div>
            </div>
            <div className='row'>
                <div className='six columns'>
                    <Link to='/login' id='link'><button>Login</button></Link>
                    
                </div>
                <div className='six columns'>
                  <Link to='/register' id='link'><button>Register</button></Link>
                </div>
            </div>
        </div>}
        


        {/* Pag naka-login */}
        {credentials && <div className='container loob'>
            <div className='row'>
                <div className='twelve columns'>
                    <h1 id='loob'>{credentials.username}'s Todo List | <Link to='/' id='link' onClick={()=>{logOut()}}>Log out?</Link></h1>
                </div>
            </div>
            <Todo/>
        </div>}
    </div>
}