import './Todos.css'
import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Todos() {
    const [todos, setTodos] = useState([])
    const [input, setInput] = useState('')

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/todos/')
            setTodos(response.data)
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching todos:', error)
        }
    }

    const handleToggle = (id) => {
        const updatedTodos = todos.map((todo) => {
            try {
                if (todo.id === id) {
                    axios.put(`http://localhost:8000/api/todos/${id}/update/`, {
                        ...todo,
                        completed: !todo.completed
                    })
                    return { ...todo, completed: !todo.completed }
                }
                return todo
            }
            catch (error) {
                console.error('Error toggling todo:', error)
            }
        })
        setTodos(updatedTodos)
    }

    const handleDelete = (id) => {
        try {
            axios.delete(`http://localhost:8000/api/todos/${id}/delete/`)
            const updatedTodos = todos.filter((todo) => todo.id !== id)
            setTodos(updatedTodos)
        } catch (error) {
            console.error('Error deleting todo:', error)
        }
    }


    const addTodo = async () => {
        try {
            if (input === '') {
                alert('Please enter a todo')
                return
            }
            const response = await axios.post('http://localhost:8000/api/todos/add/', {
                title: input,
                completed: false
            })
            setTodos([...todos, response.data])
            setInput('')
        } catch (error) {
            console.error('Error adding todo:', error)
        }
    }
    return (
        <>
            <div className="container">
                <div className="todo-app">
                    <div className="app-title">
                        <h2>To-do app</h2>
                        <i className="fa-solid fa-book-bookmark"></i>
                    </div>
                    <div className="row">
                        <input type="text" id="input-box" placeholder="add your tasks" value={input} onChange={(e) => setInput(e.target.value)} />
                        <button onClick={addTodo}>Add</button>
                    </div>
                    <ul id="list-container">
                        {todos.map((todo) => (
                            <li key={todo.id} className={todo.completed ? 'checked' : ''}><i onClick={() => handleToggle(todo.id)}> {todo.completed ? <del>{todo.title}</del> : todo.title}</i> <span onClick={() => handleDelete(todo.id)}> X </span></li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Todos