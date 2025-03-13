const usersRouter = require("express").Router();
const { getAllUsers } = require('../controller')

usersRouter.get("/", getAllUsers)

module.exports = usersRouter;