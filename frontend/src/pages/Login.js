import axios from 'axios';
import React, { useContext, useState } from 'react';
import  { useHistory } from "react-router-dom";
import { CredentialContext } from "../App";
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';




export default function Login(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [, setCredentials] = useContext(CredentialContext);
    const [error, setError] = useState("");
    

    const login = (e) =>{
        e.preventDefault();
        trackPromise(
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
            }));
    };

    const LoadingIndicator = props => {
        const { promiseInProgress } = usePromiseTracker();
        return (
            promiseInProgress && 
            <div
            style={{
                width: "100%",
                height: "5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            >
            <Loader type="TailSpin" color="#FF0000" height='20' width='100' />
            </div>
        );  
    }
    
    const history = useHistory();

    return <form onSubmit={login}>
        <h1>Login to an Account</h1>
        <h2>{error}</h2>
        <label>Username: </label>
        <input onChange={(e)=> setUsername(e.target.value)} type='text' placeholder='Enter username'/>
        <label>Password: </label>
        <input onChange={(e)=> setPassword(e.target.value)} type='password' placeholder='Enter password'/><br></br><br></br>
        <button>Login</button>
        <LoadingIndicator/>
    </form>
}