const express = require("express") ;
const { registerUser, loginUser, getProfile } = require("../controllers/userController");
const router = express.Router() ;

const verifyToken =  (req , res , next)  => {
    const bearerHeader = req.headers["authorization"] ; 
    if(typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ")  ;
        const token  = bearer[1] ;
        req.token = token ; 
        next() ;
    }else{
        res.status(403).json({result : "Token is not Valid ... "}) ; 
    }
} ; 

router.post("/register" , registerUser) ;
router.post("/login" , loginUser)  ; 
router.post("/profile" , verifyToken , getProfile) ; 

module.exports = router ; 