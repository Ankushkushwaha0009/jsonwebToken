const express = require("express") ; 
const mongoose = require("mongoose") ; 
const userRoutes = require("./routes/userRoutes") ; 
const app = express()  ; 
const PORT = 4000 ; 

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
  });
  
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  

app.use(express.json()) ; 

app.use("/api/users" , userRoutes) ; 

app.get("/" , (req , res)  =>  {
    res.json({message : "Welcome to the api ... "}) ; 
})

app.listen(PORT , ()  => {
    console.log(`Server is running on http://localhost:${PORT}`)
}) ;