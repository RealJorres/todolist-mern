import React, { useContext, useState } from 'react';
import  { useHistory } from "react-router-dom";
import { CredentialContext } from "../App";


export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfimPassword] = useState("");
    const [, setCredentials] = useContext(CredentialContext);
    const [error, setError] = useState("");
    

    const register = (e) =>{
        e.preventDefault();
        fetch(`http://localhost:${process.env.PORT}/register`, { 
            method: "POST", 
            headers:{
                "Content-Type": "application/json"}, 
            body: JSON.stringify({
                username, 
                password, 
                confirmpassword
            }),
        })
            .then(async(res) =>{
                if(!res.ok){
                    const {message} = await res.json();
                    throw Error(message);
                }return res.json();
            })
            .then(async (data)=>{
                setCredentials({
                    username,
                    password
                });
                localStorage.setItem('user', JSON.stringify({username}));
                console.log(data);
                history.push("/");
            })
            .catch((err)=>{
                setError(err.message);
            });
    };
    const history = useHistory();

    return <form onSubmit={register}>
        <h1>Create an Account</h1>
        <h2>{error}</h2>
        <label>Username: </label>
        <input onChange={(e)=>setUsername(e.target.value)} type='text' placeholder='Enter username'/>
        <label>Password: </label>
        <input onChange={(e)=>setPassword(e.target.value)} type='password' placeholder='Enter password'/>
        <label>Confirm Password: </label>
        <input onChange={(e)=>setConfimPassword(e.target.value)} type='password' placeholder='Confirm password'/><br></br><br></br>
        <button type='submit'>Register</button>
    </form>
}