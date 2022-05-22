const router = require("express").Router();
const { Board, validate } = require("../models/board");
const { Task } = require("../models/task");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const Joi = require("joi");

// create board
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const board = await Board({ ...req.body, user: user._id }).save();
  user.boards.push(board._id);
  await user.save();

  res.status(201).send({ data: board });
});

// edit board by id
router.put("/edit/:id", [validateObjectId, auth], async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).send({ message: "Board not found" });

  const user = await User.findById(req.user._id);
  if (!user._id.equals(board.user))
    return res.status(403).send({ message: "User don't have access to edit!" });

  board.name = req.body.name;
  await board.save();

  res.status(200).send({ message: "Updated successfully" });
});

// remove task from board
router.put("/remove-task", auth, async (req, res) => {
  const schema = Joi.object({
    boardId: Joi.string().required(),
    taskId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findById(req.user._id);
  const board = await Board.findById(req.body.boardId);
  if (!user._id.equals(board.user))
    return res
      .status(403)
      .send({ message: "User don't have access to Remove!" });

  const index = board.tasks.indexOf(req.body.taskId);
  board.tasks.splice(index, 1);
  await board.save();
  res.status(200).send({ data: board, message: "Removed from board" });
});

// user boards
router.get("/favourite", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const boards = await Board.find({ _id: user.boards });
  res.status(200).send({ data: boards });
});

// get random boards
router.get("/random", auth, async (req, res) => {
  const boards = await Board.aggregate([{ $sample: { size: 10 } }]);
  res.status(200).send({ data: boards });
});

// get board by id
router.get("/:id", [validateObjectId, auth], async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).send("not found");

  const tasks = await Task.find({ _id: board.tasks });
  res.status(200).send({ data: { board, tasks } });
});

// get all boards
router.get("/", auth, async (req, res) => {
  const boards = await Board.find();
  res.status(200).send({ data: boards });
});

// delete board by id
router.delete("/:id", [validateObjectId, auth], async (req, res) => {
  const user = await User.findById(req.user._id);
  const board = await Board.findById(req.params.id);
  if (!user._id.equals(board.user))
    return res
      .status(403)
      .send({ message: "User don't have access to delete!" });

  const index = user.boards.indexOf(req.params.id);
  user.boards.splice(index, 1);
  await user.save();
  await board.remove();
  res.status(200).send({ message: "Removed from library" });
});

module.exports = router;
