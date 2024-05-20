
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
app.use(express.static("views")); 
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const User = require('./models/users');

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

const ConnectionString = "mongodb+srv://youssefashraf162002:HJ3SucA9uYADHoEB@cluster0.ynoki88.mongodb.net/MOVU?retryWrites=true&w=majority&appName=Cluster0";


mongoose.connect(ConnectionString)
    .then(()=>{
        //app.listen(5000);
        console.log("connection success");
    })
    .catch((err)=>{
        console.log("connection failed" , err);
    })

app.get('/',(req,res)=>{
    res.render("home.ejs");
})
app.get('/MoviePage.html',(req,res)=>{
    res.render("MoviePage");
})
app.get('/artist.html',(req,res)=>{
    res.render("artist");
})
app.get('/AboutUs',(req,res)=>{
    res.render("AboutUs");
})
app.get('/SignUp.html',(req,res)=>{
    res.render("SignUp");
})
app.get('/login',(req,res)=>{
    res.render("login");
})
app.get('/SignUp', (req, res) => {
    const usernameExists = req.query.usernameExists === 'true';
    res.render("SignUp", { usernameExists }); 
});

app.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ UserName: req.body.UserName });
        if (existingUser) {
            return res.redirect('/SignUp?usernameExists=true');
        }

        const user = new User(req.body);
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(500).send('Server error');
    }
});

