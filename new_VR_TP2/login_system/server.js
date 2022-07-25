const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const { syncBuiltinESMExports } = require("module");
const cors = require("cors");
app.use(cors());


//const router = require('./router');

const port = process.env.PORT || 3003;
const DB ="mongodb+srv://teste:teste@cluster0.q2adz.mongodb.net/docker?retryWrites=true&w=majority";
const JWT_SECRET='my-ultra-secure-and-ultra-long-secret'
const JWT_EXPIRES_IN= '90d'
const JWT_COOKIE_EXPIRES_IN='90'

const connectDB = () => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log("DB connection successful");
    })
    .catch((err) => {
      console.log(err);
    });
};

const signToken = id => {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    user.password = undefined;
    user.confirmPassword = undefined;
    res.status(statusCode).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  };

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    require: [true, "introduzir email"],
  },
  password: {
    type: String,
    minlenght: 8,
    require: [true, "password"],
  },
  confirmPassword: {
    type: String,
    require: [true, "confirmPassword"],
  },
  iflogin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
  })
);

// app.use('/route',router);

//home route
app.get("/", (req, res) => {
  res.render("base", { titl: "Login System" });
});

app.get("/register", (req, res) => {
  res.render("register", { titl: "Login System" });
});



//login user

app.post("/login", async (req, res) => {
  // if(req.body.email==credential.email && req.body.password == credential.password){
  //     req.session.user = req.body.email;
  //     res.end("login sucess")
  // }
  // else{
  //     res.end("Invalid Username")
  // }

  try {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password) {
      res.status(400).json({
        status: "failed",
        message: "Password did not macth",
      });
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        status: "failed",
        message: "User does not exist",
      });
    } else if (user.password != password) {
      res.status(400).json({
        status: "failed",
        message: "Incorrect password",
      });
    }

    const userUpdate = await User.findByIdAndUpdate(user._id, {
      iflogin: true,
    });
    
    createSendToken(user, 200, res);
  } catch (err) {}
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    users.map((el) => {
      let usersLogin;
      if (el.iflogin === true) {
        usersLogin = el.email;
      }
    });
  } catch (err) {}
});

app.post("/register", async (req, res) => {
  console.log(req.body);

  try {
    if (req.body.password === req.body.confirmPassword) {
      const newuser = await User.create(req.body);
      res.status(200).json({
        status: "success",
        data: {
          newuser,
        },
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "Password did not macth",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
    });
  }
});


app.listen(port, () => {
  console.log("Listening to the server on http://localhost:3003");
  connectDB();
});
