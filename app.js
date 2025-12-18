
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const dotenv=require("dotenv")
dotenv.config()
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const helmet=require("helmet")
let secretkey=process.env.SECRETKEY

const app = express();
const port = process.env.PORT;
app.use(helmet(
  
))
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const usermodel = mongoose.model("users", userSchema);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 55,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
})

app.use(cors());
app.use(limiter);
app.use(express.json());

// MONGODB CONNECTION
async function connection() {
    try {
       await mongoose.connect(process.env.MONGODBURL);
        console.log("DB Connected Successfully");
    } catch (err) {
        console.error("DB Connection Failed:", err);
    }
}
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const isuser = await usermodel.findOne({
      $or: [{ username }, { email }]
    });

    if (isuser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await usermodel.create({
      username,
      email,
      password: hashedpassword
    });

    res.status(201).json({ msg: "Registration successful" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.get
app.post('/signin',async(req,res)=>{
      const {username,password}=req.body
      let userdetail=await usermodel.findOne({username})
      if(!userdetail)
        return res.json({msg:"user not found"})
   
    let checkpassword=await bcrypt.compare(password,userdetail.password)
    if(!checkpassword){
       return  res.json({msg:"incorrect username or password"})
    }
    let payload={username:username};
    let token = jwt.sign(payload,secretkey,{expiresIn:"1h"});

    res.json({
        msg:"login successfull",
        token
    })
})

// SCHEMA + MODEL
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true }
});

// register model
const Product = mongoose.model("products", productSchema);

// ROUTES
app.get("/products", async (req, res) => {
    const products = await Product.find();    // fetch from DB
    res.json({ products });
});

app.post("/submitproduct", async (req, res) => {
    const { title, price, img } = req.body;

    const newProduct = new Product({
        title,
        price,
        img
    });

    await newProduct.save();   // save to DB

    res.json({ msg: "Product added successfully" });
});
app.get('/dummy',(req,res)=>{
    const age=req.query.age
    const location=req.query.location
    const name=req.query.name
    res.send("my name is ");
        

})
// START SERVER
app.listen(port, async () => {
    await connection();
    console.log(`Server running on port ${port}`);

    
    await Product.create({
        title: "Premium bag",
        price: 90000,
        img: "https://res.cloudinary.com/...image.jpg"
    });
    
});