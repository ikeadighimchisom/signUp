const jwt = require("jsonwebtoken");

const isSignIn = async (req, res, next) => {
    try{
        const authToken = req.header.authorization
        if(!authToken){
            res.status(401).json({message: "Not authorized"})
        } else{
            const token = authToken.split( " " )[1];

            if(token){
                jwt.verify(token, process.env.JWT_SECRET,(err, payload) => {
                    if(err){
                        res.status(401).json({message: err.message})
                    } else {
                        res.user = payload
                    }
                })
            } else {
                res.status(401).json({message: "No token"})
            }
        }
    }catch(err) {
        res.status(404).json({
            message: err.message
        })
    }
}

module.exports = isSignIn