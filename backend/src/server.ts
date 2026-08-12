import express from 'express';
import "dotenv/config";
const PORT = process.env.port || 5300;
import cors from 'cors';
import routes from "./routes/index.js";
import { errorHandler } from './middleware/error.middleware.js';
const app = express();
app.use(express.json());

app.use(cors({
   origin: "*",
   methods:['POST','GET','PATCH','PUT','DELETE']
  
}))

app.get("/test", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is working",
  });
});

app.use("/api",routes);
app.use(errorHandler);
app.listen(PORT,() => {
    console.log(`server running on port ${PORT} successfully`);
})


