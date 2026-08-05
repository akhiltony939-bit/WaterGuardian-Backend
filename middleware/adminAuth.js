// ==========================================
// WaterGuardian-X
// Admin Authentication Middleware
// ==========================================


const jwt = require("jsonwebtoken");



module.exports = function(req,res,next){


try{


// Get token

const token =
req.headers.authorization;



if(!token){


return res.status(401).json({

success:false,

message:"Access denied. No token provided"

});


}




// Remove Bearer

const actualToken =
token.split(" ")[1];





const decoded =
jwt.verify(

actualToken,

process.env.JWT_SECRET || "waterguardianx_secret"

);





// Check role


if(decoded.role !== "admin"){


return res.status(403).json({

success:false,

message:"Admin access required"

});


}




req.user =
decoded;



next();



}

catch(error){


return res.status(401).json({

success:false,

message:"Invalid Token"

});


}


};