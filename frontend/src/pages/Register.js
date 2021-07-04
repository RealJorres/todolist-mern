import React, { useContext, useState } from 'react';
import  { useHistory } from "react-router-dom";
import { CredentialContext } from "../App";
import axios from 'axios';


export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfimPassword] = useState("");
    const [, setCredentials] = useContext(CredentialContext);
    const [error, setError] = useState("");
    

    const register = (e) =>{
        e.preventDefault();
        axios({
            url:"/register",
            method:"POST",
            headers:{
                "Content-Type": "application/json"},
            data : {username, password, confirmpassword}
        })
        // fetch(`http://localhost:4000/register`, { 
        //     method: "POST", 
        //     headers:{
        //         "Content-Type": "application/json"}, 
        //     body: JSON.stringify({
        //         username, 
        //         password, 
        //         confirmpassword
        //     }),
        // })
            .then(async(res) =>{
                if(!res.status === 200){
                    const {message} = await res.data;
                    throw Error(message);
                }return res.data;
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
                if(err.message === "Request failed with status code 403"){
                    setError("Username already exists!");
                }else if(err.message === "Request failed with status code 406"){
                    setError("Password doesn't match!");
                }else if(err.message === "Request failed with status code 411"){
                    setError("Empty field is not allowed!");
                }else{
                    setError(err.message);
                }
                
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