const usersRouter = require("express").Router();
const { getAllUsers, getUserByUserName } = require('../controller')

usersRouter.get("/", getAllUsers)
usersRouter.get('/:username', getUserByUserName
)


module.exports = usersRouter;