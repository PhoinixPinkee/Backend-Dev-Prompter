const express=require('express');
const { connectDb } = require('./Models/db');
const AuthRouter=require('./Routes/AuthRouter');
const PromptRouter = require("./Routes/PromptRouter")
const app=express();
const cors=require('cors');
const bodyParser=require('body-parser');
require('dotenv').config();
const PORT=process.env.PORT || 3000;
app.get('/',(req,res)=>{
res.send('Server Response');});
app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);

app.use("/api/prompts", PromptRouter);
connectDb();
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});