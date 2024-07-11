const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // to support JSON-encoded bodies

const viewsPath = path.join(__dirname, 'web', 'views');
app.set('views', viewsPath);
app.use(express.static(__dirname + '/web'));

const User = require('./models/users'); 
const Report = require('./models/reports');
const ConnectionString = "mongodb+srv://ibrahimmostafa768:abcABC12@movu.c685elx.mongodb.net/?retryWrites=true&w=majority&appName=MovU";
mongoose.connect(ConnectionString)
    .then(() => {
        console.log("connection success");
    })
    .catch((err) => {
        console.log("connection failed", err);
    });

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Ensure session data is available
app.use((req, res, next) => {
    console.log('Session data:', req.session);
    next();
});

mongoose.connect(ConnectionString)
    .then(()=>{
        //app.listen(5000);
        console.log("connection success");
    })
    .catch((err)=>{
        console.log("connection failed" , err);
    })
// Define a route that renders the 'home' view
app.get('/', (req, res) => {
    if (req.session.user) {
        // Access user data from session
        const user = req.session.user;
        // Pass user data to the view
        res.render('home', { user });
    } else {
        // Render home page without user data if user is not logged in
        res.render('home', { user: null });
    }
});
app.get('/MoviePage', (req, res) => {
    if (req.session.user) {
            // Access user data from session
            const user = req.session.user;
            // Pass user data to the view
            res.render('MoviePage', { user });
        } else {
            // Render home page without user data if user is not logged in
            res.render('MoviePage', { user: null });
        }
});
app.get('/home', (req, res) => {
    res.redirect('/');
});
app.get('/AboutUs', (req, res) => {
    res.render('AboutUs');
});
app.get('/artist', (req, res) => {
    if (req.session.user) {
        // Access user data from session
        const user = req.session.user;
        // Pass user data to the view
        res.render('artist', { user });
    } else {
        // Render home page without user data if user is not logged in
        res.render('artist', { user: null });
    }
});
app.get('/help', (req, res) => {
    res.render('help');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/SignUp', (req, res) => {
    res.render('SignUp');
});
app.get('/myratings', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const ratings = user.ratings;

        // Fetch additional movie details from TMDB for each rating
        const tmdbApiKey = '90196cb49ac4418ca023dc30de4e2130';
        const movieDetailsPromises = ratings.map(rating =>
            fetch(`https://api.themoviedb.org/3/movie/${rating.movieId}?api_key=${tmdbApiKey}`)
            .then(response => response.json())
        );

        const movies = await Promise.all(movieDetailsPromises);

        // Combine the movie details with the corresponding ratings
        const movieRatings = movies.map((movie, index) => ({
            movie,
            rating: ratings[index].rating
        }));

        res.render('myratings', { movieRatings, user });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        res.status(500).send('Server error');
    }
});

app.get('/mywatchlist', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId).populate('watchlist');
        if (!user) {
            return res.status(404).send('User not found');
        }

        const watchlist = user.watchlist;

        // Fetch additional movie details from TMDB
        const tmdbApiKey = '90196cb49ac4418ca023dc30de4e2130';
        const movieDetailsPromises = watchlist.map(movieId => 
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${tmdbApiKey}`)
            .then(response => response.json())
        );

        const movieDetails = await Promise.all(movieDetailsPromises);

        res.render('mywatchlist', { movies: movieDetails ,user});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
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
// Start the server
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ UserName: username, Password: password });

        if (!user) {
            return res.redirect('/login?loginFailed=true');
           
        }

        req.session.user = user;
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Server error');
    }
});


app.post('/addToWatchlist', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.session.user._id;
    const { movieId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { watchlist: movieId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Movie added to watchlist', watchlist: user.watchlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/rateMovie', async (req, res) => {
    const { movieId, rating } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        // Check if the user has already rated the movie
        const existingRatingIndex = user.ratings.findIndex(item => item.movieId === movieId);

        if (existingRatingIndex !== -1) {
            // Update the existing rating
            user.ratings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            user.ratings.push({ movieId, rating });
        }

        await user.save();

        // Send a JSON response indicating success
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/submitForm', async (req, res) => {
    try {
        // Create a new Report instance using the data from the request body
        const reportData = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            Email: req.body.email,
            mobile: req.body.mobile,
            Questions: req.body.issue
        };

        // Save the report to the database
        const report = new Report(reportData);
        await report.save();

        res.send('Report submitted successfully');
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).send('Server error: ' + error.message); // Log detailed error message
    }
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
