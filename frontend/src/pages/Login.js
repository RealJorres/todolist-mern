import axios from 'axios';
import React, { useContext, useState } from 'react';
import  { useHistory } from "react-router-dom";
import { CredentialContext } from "../App";



export default function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [, setCredentials] = useContext(CredentialContext);
    const [error, setError] = useState("");
    

    const login = (e) =>{
        e.preventDefault();
        axios({
            url:"/login",
            method:"POST",
            headers:{"Content-Type": "application/json"},
            data: {username, password}
        })
            .then(async (res) => {
                if(!res.status === 200){
                    const {message} = await res.json();
                    throw Error(message);
                }return res.data;
            })
            .then((data) => {
                setCredentials({username, password,});
                localStorage.setItem('user', JSON.stringify({username}));
                console.log(data);
                history.push("/");
            })
            .catch((err) => {
                if(err.message === "Request failed with status code 403"){
                    setError("User not found!");
                }else{
                    setError(err.message);
                }
            });
    };
    const history = useHistory();

    return <form onSubmit={login}>
        <h1>Login to an Account</h1>
        <h2>{error}</h2>
        <label>Username: </label>
        <input onChange={(e)=> setUsername(e.target.value)} type='text' placeholder='Enter username'/>
        <label>Password: </label>
        <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Enter password'/><br></br><br></br>
        <button>Login</button>
    </form>
}