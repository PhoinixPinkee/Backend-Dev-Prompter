const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" }); // 💥 Add 'return' here
        }

        const userModel = new UserModel({
            name,
            email,
            password: await bcrypt.hash(password, 10), // Directly hash here
        });

        await userModel.save();

        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

 const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isValid=await bcrypt.compare(password,user.password);
        if(!isValid){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
         return res.status(200).json({message:"Login success",jwtToken,email,name:user.name});
    }catch{
        return res.status(500).json({message:"Internal server error"});
    }
   
        
 }
 
 module.exports={signup,login};