import React, { useContext, useState, useEffect } from 'react';
import { CredentialContext } from "../App";

export default function Todo(){
    const [todos, setTodos] = useState("");
    const [TodosArray, setTodoArray] = useState([]);
    const [contentText, setContentText] = useState("");
    const [credentials] = useContext(CredentialContext);

    const persist = (todos) => {
        fetch(`http://localhost:4000/todos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify(todos),
            }).then(() => {});
        };

    useEffect(() => {
        fetch(`http://localhost:4000/todos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Base ${credentials.username}:${credentials.password}`,
            },
          })
            .then((response) => response.json())
            .then((todos) => setTodoArray(todos));
        },);

    const addTodo = (e) => {
        e.preventDefault();
        if (!contentText) return;
        const newTodo = { user : credentials.username, text: contentText };
        const newTodos = [...todos, newTodo];
        setTodos(newTodos);
        setContentText("");
        persist(newTodo);
    };

    const updateTodo = (id) =>{
        fetch(`http://localhost:4000/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify({id}),
            }).then(() => {});
        };



    const deleteTodo = (id) =>{
        fetch(`http://localhost:4000/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${credentials.username}:${credentials.password}`,
            },
            body: JSON.stringify({id}),
            }).then(() => {});
        };
    

    return (
    <div>
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
                <div className='five columns'>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;{todo.content}</label>
                </div>
                <div className='four columns'>
                <label>&nbsp;&nbsp;&nbsp;&nbsp;</label>
                </div>
                <div className='two columns gitna'>
                    <button id={todo._id} onClick={()=>{updateTodo(todo._id)}} title="Mark as 'Done'" className='greenButton'><span role='img' aria-label='done'>&#10004;</span></button>
                    <button id={todo._id} onClick={()=>{deleteTodo(todo._id)}} title="Delete 'Todo-item'" className='redButton'><span role='img' aria-label='delete'>&#10060;</span></button>    
                </div>
                <div className='one columns'>

                </div><br/><br/><br/>
            </div>
        ))}
    </div>);
}