import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({},{timestamps:true});

export const Comment=mongoose.model("Comment",commentSchema);