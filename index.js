const express = require("express");
const logger = require("morgan");

const ingredients = require("./data");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.status(200).json(ingredients);

    return;
  }

  const { type } = req.query;
  if (!type) {
    res.status(400).json({
      message: "failure",
      payload: 'The only valid query parameter accepted is "type".',
    });

    return;
  }

  const types = Object.keys(ingredients);
  if (!types.includes(type)) {
    res
      .status(400)
      .json({ message: "failure", payload: "No type of that name found." });

    return;
  }

  res.status(200).json({ message: "success", payload: ingredients[type] });
});

app.post("/:type", (req, res) => {
  const { name } = req.body;
  const { type } = req.params;
  const types = Object.keys(ingredients);
  if (!name) {
    res.status(400).json({
      message: "failure",
      payload: "Request body must include a name field for a new ingredient.",
    });

    return;
  }

  if (!types.includes(type)) {
    res
      .status(500)
      .json({ message: "failure", payload: "No type by that name." });

    return;
  }

  if (ingredients[type].includes(name)) {
    res
      .status(500)
      .json({ message: "failure", payload: "Ingredient already exists." });

    return;
  }

  ingredients[type].push(name);
  res.status(200).json({ message: "success", payload: name });
});

app.put("/:type", (req, res) => {
  const { newIngredient } = req.body;
  const types = Object.keys(ingredients);
  if (!newIngredient) {
    res.status(400).json({
      message: "failure",
      payload: "New ingredients must be included in the request body.",
    });

    return;
  }

  if (!ingredients.includes(type)) {
    res.status(500).json({
      message: "failure",
      payload: "No ingredients with that type exist.",
    });

    return;
  }
});

app.all("*", (_, res) => {
  res.status(404).json({ message: "failure", payload: "Resource not found." });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
