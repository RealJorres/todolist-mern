import React, { useContext, useState } from 'react';
import  { useHistory } from "react-router-dom";
import { CredentialContext } from "../App";
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';


export default function Register(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfimPassword] = useState("");
    const [, setCredentials] = useContext(CredentialContext);
    const [error, setError] = useState("");
    

    const register = (e) =>{
        e.preventDefault();
        trackPromise(
        axios({
            url:"/register",
            method:"POST",
            headers:{
                "Content-Type": "application/json"},
            data : {username, password, confirmpassword}
        })
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
                
            }))
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
        <LoadingIndicator/>
    </form>
}