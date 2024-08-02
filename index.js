const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Todo, User } = require("./db");
const { createTodo } = require("./types"); // Import only required functions
const authenticateToken = require("./authMiddleware.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Always use environment variable

// Signup
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
        res.json({ msg: "User created successfully" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Signin
app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Create Todo
app.post("/todo", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const createPayload = req.body;

    const parsedPayload = createTodo.safeParse(createPayload);
    if (!parsedPayload.success) {
        return res.status(400).json({ msg: "Invalid input data" });
    }

    try {
        const newTodo = await Todo.create({
            title: parsedPayload.data.title,
            content: parsedPayload.data.content,
            userId,
        });

        res.json({ msg: "Todo created successfully", todo: newTodo });
    } catch (error) {
        console.error("Error creating todo:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Get Todos
app.get("/todos", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const todos = await Todo.find({ userId });
        res.json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

// Delete Todo
app.delete("/api/todos/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        await Todo.deleteOne({ _id: id, userId });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
