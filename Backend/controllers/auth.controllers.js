import User from "../model/user.model.js"
import bcryptjs from "bcryptjs"
import generateTokenAndSetCookie from "../Utils/generateTokesandSet.js";
export const signup =async (req, res) =>
{
    console.log("signup called");

try{
    const {fullName,username,password,confirmPassword,gender,profilepic}=req.body

    if(password !== confirmPassword)
        return res.status(400).json({error: "Invalid password"})

    const user= await User.findOne({username})
    if  (user){
        return res.status(400).json({error: "Username already exists"})
    }

    // HASH PASSWORD HERE

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
// https://avatar-placeholder.iran.liara.run/

    const boyprofilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlprofilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;


    const newUser = new User({
        fullName,
        username,
        password:hashedPassword,
        gender,
        profilePic : gender === "male"? boyprofilePic : girlprofilePic
    })

    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save()

        res.status(201).json({
            _id: newUser._id,
            fullName:newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
        })}
    else{
        res.status(400).json({error: "Invalid user data"})
    }

console.log("User saved");


}
catch(error){
    console.log("error in signup ");

    console.error(error.message)
    res.status(500).json({error: "Internal Server Error"})
}
}

export const login = async (req, res) =>
    {
        try{
                const { username,password,}=req.body
                const user = await User.findOne({username})
                const isPasswordCorrect = await bcryptjs.compare(password,user?.password||"")


            if (!user || !isPasswordCorrect)
            {
                return res.status(401).json({error: "Invalid username or password"}

                )
            }
            generateTokenAndSetCookie(user._id,res);
            res.status(200).json({
                _id: user._id,
                fullName:user.fullName,
                username: user.username,
                profilePic: user.profilePic,
            })
        }
        catch(error){
            console.error(error.message)
            res.status(500).json({error: "Internal Server Error"})
        }

    }

export const logout =   (req, res) =>
    {

        try{
            res.cookie("jwt","",{maxAge:0})
            res.status(200).json({message:"Logged out Success"})

        }

        catch (error)
        {
            console.error(error.message)
            res.status(500).json({error: "Internal Server Error"})
    }}
