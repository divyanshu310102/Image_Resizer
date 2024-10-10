import mongoose from 'mongoose'


const resizeSchema = new mongoose.Schema({
    image:{
        type : mongoose.Schema.Types.ObjectId, 
        ref : "User"
    },
    width:Number,
    height:Number
    

})


export const Resize = mongoose.model("Resize", userSchema)