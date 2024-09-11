import jwt from 'jsonwebtoken'
export const shouldBeLoggedIn= async (req,res) => {
    try {
        console.log(req.userId)
        res.status(200).json({message:"Authenticated"});
    } catch (error) {
        console.log(error);
    }
    
}

export const shouldBeAdmin= async (req,res) => {
    try {

        const token = req.cookies.token;

        if(!token) return res.status(401).json({message:"Not Authenticated"});

        jwt.verify(token, process.env.JWT_SECRET_KEY,async (err,paylod) => {
          if(err) return res.status(403).json({message : "Token is invalid"});
          if(!paylod.isAdmin) return res.status(403).json({message : "Not Admin"});
        })

        res.status(200).json({message:"Authenticated"});
    } catch (error) {
        console.log(error);
    }
    
}