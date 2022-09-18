const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db'); // database connection

// middleware
app.use(cors());
app.use(express.json()); // get the req.body from the client

// ROUTES //

// a.k.a endpoints or API endpoints

// create a todo

app.post("/todos", async(req, res) => {
    try {
        const {description} = req.body; //recieve a description from the client
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", [description]); // insert the description into the database
        // returning * means you wanna see the data that you just worked on
        // so every time you tryna INSERT, UPDATE, or DELETE... you'll need to do a RETURNING * 
        res.json(newTodo.rows[0]); //return the newTodo response
    } catch (err) {
        console.error(err.message);
    }
})

// get all todos

app.get("/todos", async(req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo");
        res.json(allTodos.rows);
    } catch (err) {
        console.error(err.message)
    }
});

// get a todo

app.get("/todos/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
    } catch (err) {
        console.error(err.message)
    }
})

// update a todo

app.put("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2", [description, id]);
        res.json("Todo was updated!");
    } catch (err) {
        console.error(err.message);
    }
});

// delete a todo

app.delete("/todos/:id", async(req, res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo was deleted!");
    } catch (err) {
        console.error(err.message);
    }
})


// start the server
app.listen(5000, () => {
    console.log('Server started on port 5000'); 
});