const zod = require("zod");

// Schema for creating a new todo
const createTodo = zod.object({
  title: zod.string(),
  content: zod.string(),
});

// Schema for updating an existing todo
const updateTodo = zod.object({
  title: zod.string().optional(),
  content: zod.string().optional(),
  completed: zod.boolean().optional(),
});

module.exports = { createTodo, updateTodo };
