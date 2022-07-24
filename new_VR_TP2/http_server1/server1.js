const http = require('http');
const port = 4004;
const express = require('express');
const app = express();
const path= require('path');
const cors= require('cors');
app.use(cors());


http.Server(app).listen(port);

console.log("server started on port " + port);

app.use(express.static(path.join(__dirname, 'public')));

//ROTAS
app.route('/').get((req, res)=>{
  res.sendFile(__dirname + "/public/login-page.html"); 
})
