
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'
import mongoose from 'mongoose'
import users from './routes/users'
import config from './config/database'
import passportFunc from './config/passport'
passportFunc(passport)


// Connect To Database
mongoose.connect(config.database, { useNewUrlParser: true })

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();


// Port Number
const port = 3000;

// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/user', users);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(port, () => {
  console.log('Server started on port '+port);
});
