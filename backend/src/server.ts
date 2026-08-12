import express from 'express';
import "dotenv/config";
const PORT = process.env.port || 5000;
import cors from 'cors';
const app = express();



app.use(cors({
   origin: "*",
  
}))


app.listen(PORT,() => {
    console.log(`server running on port ${PORT} successfully`);
})


