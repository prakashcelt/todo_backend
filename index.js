import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

// Connect to MongoDB
try {
  mongoose.connect("mongodb://127.0.0.1:27017/todocrud");
  console.log("Database connected");
} catch (error) {
  console.log("Database connection error:", error.message);
}

// Define the Todo schema and model
const todoSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
  },
  { timestamps: true }
);
const Todo = mongoose.model("Todo", todoSchema);

// Create a new Todo
app.post("/create", async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const existingTodo = await Todo.findOne({ title });

    if (existingTodo) {
      return res.status(400).json({ error: "Todo with this title already exists" });
    }

    const newTodo = new Todo({
      title,
      subtitle,
    });

    await newTodo.save();
    res.json({ todo: newTodo._doc });

  } catch (error) {
    console.log("Error in creating todo:", error.message);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Update an existing Todo
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, subtitle },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);

  } catch (error) {
    console.log("Error in updating todo:", error.message);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a Todo
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.log("Error in deleting todo:", error.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Get a specific Todo by ID
app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);

  } catch (error) {
    console.log("Error in getting todo:", error.message);
    res.status(500).json({ error: "Failed to get todo" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
