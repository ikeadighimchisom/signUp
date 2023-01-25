require ('dotenv').config();
const models = require("../models").authenticateinfo;
const jwt = require( "jsonwebtoken");
const bcrypt = require("bcrypt");

// signup function
const signUp = async ( req, res) => {
    try{
        // extracting the attributes from the req.body
        const { name, email, password } = req.body;

        // capture the new user email
        const checkEmail = await models.findOne({
            where: {
                email: email
            }
        })

        // check for existence
        if( checkEmail ) {
            res.status( 400 ).json({
                status: "Failed",
                message: " Email already exist"
            })
        } else {
            // encrypt the user password
            const saltedPassword = await bcrypt.genSalt( 10 );
            const hashedPassword = await bcrypt.hash(password, saltedPassword)

            // generate token
            const generateToken = await jwt.sign({
                name,
                email,
                password,
            }, process.env.JWT_SECRET, { expiresIn: "1d" } );

            // user data
            const userData = {
                name,
                email,
                password:hashedPassword,
                token: generateToken
            }

            const newUser = await models.create( userData );
            if( !newUser ) {
                res.status( 400 ).json({
                    status: "Failed",
                    message: "Failed to create user"
                })
            } else {
                res.status( 201 ).json({
                    status: "successful",
                    data: newUser
                })
            }
        }
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}


// uthentication
const login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const check = await models.findOne({where: {email:email}})
        if(!check) return res.status(404).json({message: "not found"})
        const isPassword = await bcrypt.compare(password,check.password)
        if(!isPassword) return res.status(404).json({message: "Email or password incorrect"})

        const generateToken = await jwt.sign({
            email,
            password,
        }, process.env.JWT_SECRET, {
             expiresIn: "1d"
         });
         check.token = generateToken
         await check.save()
         res.status(201).json({
            message: "successful",
            data: check
         })
 } catch(err){
    res.status(400).json({
        message: err.message
    })
 }
}

// get all
const getAll = async(req, res) => {
    try{
        const allData = await models.findAll();
        res.status(201).json({
            message: "Availabe user",
            data: allData
        })
    } catch(err) {
        res.status(404).json({
            message: err.message
        })
    }
}

// get one
const readOne = async(req, res) => {
    try{
        const id = req.params.id;
        const getOne = await models.findAll({
            where: {id:id}
        });
        res.send(getOne)
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
}

// logout
const logOut = async(req, res) => {
    try{
        const {email, password} = req.body;
        const generateToken = await jwt.sign({
            email,
            password
        }, process.env.JWT_DESTROY);

        const exit = await models.destroy({where: { email: email, password: password, token:generateToken}})

        if(!exit){
            res.status(201).json({
                message: "exit was successfu",
                data: exit
            })
        } else{
            res.send("can not process logout")
        }

        }catch(err){
        res.status(400).json({
            message: err.message
        })
    }
}


const privatePage = (req, res) => {
    try{
        res.status(200).json({
            message: "Welcome you are authorized"
        })
    } catch(err) {
        res.status(404).json({
            message: err.message
        })
    }
}
module.exports = {
    signUp,
    login,
    getAll,
    readOne,
    logOut,
    privatePage
}
    

