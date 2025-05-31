import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  try {
    if (!token) {
      
      return res
        .status(401)
        .json({ message: "Aunthentication Failure" });
    }
   const decoded =  jwt.verify(token, process.env.JWT_SECRET);
  if(!decoded){
    console.log("decoded token",error);
    return res.status(401).json({success: false, message: "Access denied - Invalid token"});
  }
    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.log("Error in authenticateToken",error);
    return res.status(500).json({success: false, message: "Server error"});
  }
};