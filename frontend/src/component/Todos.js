import React, { useContext, useState, useEffect } from 'react';
import { CredentialContext } from "../App";
import moment from "moment";
import axios from "axios";
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

export default function Todo(){
    const [todos, setTodos] = useState("");
    const [TodosArray, setTodoArray] = useState([]);
    const [contentText, setContentText] = useState("");
    const [credentials] = useContext(CredentialContext);


    const persist = (todos) => {
        trackPromise(
        axios({
            url: "/todos",
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                 Authorization: `Basic ${credentials.username}:${credentials.password}`
            },
            data: todos
        }).then(()=>{}))
        };

    useEffect(() => {
        axios({
            url:"/todos",
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                Authorization: `Base ${credentials.username}:${credentials.password}`
            },
        })
            .then((response) => response.data)
            .then((todos) => setTodoArray(todos));
        },);

    const addTodo = (e) => {
        e.preventDefault();
        if (!contentText) return;
        const newTodo = { user : credentials.username, text: contentText , dateCreated : Date.now()};
        const newTodos = [...todos, newTodo];
        setTodos(newTodos);
        setContentText("");
        persist(newTodo);
    };

    const doneTodo = (id) =>{
        trackPromise(
        axios({
            url: "/done",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            data:{id}
        }).then(()=>{}))
        };

    const deleteTodo = (id) =>{
        trackPromise(
        axios({
            url: "/delete",
            method:"DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            data:{id}
        }).then(()=>{}))
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
    

    return (
    <div>
        <LoadingIndicator/>
        <form className='row todo' onSubmit={addTodo}>
            <div className='six columns'>
                <input onChange={(e)=>{setContentText(e.target.value)}} value={contentText}  type='text' id='todo-input' placeholder='Start typing your list here'/>
            </div>
            <div className='six columns'>
                <button className='button button-primary' type='submit'>Add</button>
            </div>
        </form>
        {TodosArray.filter(todo => !todo.done).map((todo) => (
            <div key={todo} className='row card'>
                <div className='twelve columns'>
                    <label className='content'>{todo.content}</label>
                    <p className='content small'> Date created: {moment(todo.dateCreated).format('LLL')}</p>
                    <button id={todo._id} onClick={()=>{doneTodo(todo._id)}} title="Mark as 'Done'" className='greenButton'>DONE</button>
                </div>
            </div>
        ))}
        {TodosArray.filter(todo => todo.done).map((todo) => (
            <div key={todo} className='row card'>
                <div className='twelve columns'>
                    <label className='content strike'>{todo.content}</label>
                    <p className='content small'>Date completed: {moment(todo.dateCreated).format('LLL')}</p>
                    <button id={todo._id} onClick={()=>{deleteTodo(todo._id)}} title="Delete 'Todo-item'" className='redButton'>DELETE</button>
                </div>
            </div>
        ))}
    </div>);
}