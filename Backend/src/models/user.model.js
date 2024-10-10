import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    image:String,
    
    

})


export const User = mongoose.model("User", userSchema)