const express = require ("express");
const isSignIn = require("../CONTROLLER/authorization");
const router = express.Router();
const {Authorization} = require('../CONTROLLER/authorization')

const {signUp, login, getAll, readOne, logOut, privatePage} = require ("../CONTROLLER/userController");

router.route( "/user" )
.post( signUp )
router.route("/login").post(login)
router.route("/user/:id").get(readOne)
router.route("/all").get(getAll)
router.route("/out").post(logOut)

router.route("/private", isSignIn).get(privatePage)

module.exports = router;