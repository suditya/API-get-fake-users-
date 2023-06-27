const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const casual = require('casual');
const moment = require('moment');

// Configure casual to use moment library
casual.define('moment', moment);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const connectionStr ='mongodb+srv://suditya:solcn4jaImJdKK1C@cluster0.nxaeikt.mongodb.net/?retryWrites=true&w=majority';
// Connect to MongoDB
mongoose.connect(connectionStr, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User schema
const userSchema = new mongoose.Schema({
  phoneNumber: String,
  emailAddress: String,
  name: String,
  status: String,
  lastSeen: String,
  profilePicture: String,
  upiId: String,
  username: String,
  profileUrl: String,
});

const User = mongoose.model('User', userSchema);

// Define API routes
app.get('/api/getUser', async (req, res) => {
  // xsgames.co/randomusers/avatar.php?g=male
  // https://randomuser.me/api/portraits/${casual.random_element([
  //     'men',
  //     'women',
  //   ])}/x.jpg`
  const { phoneNumber, emailAddress } = req.query;
  const user = {
    phoneNumber: phoneNumber,
    emailAddress,
    name: casual.full_name,
    status:casual.time('HH:mm A'),
    lastSeen: casual.date('DD/MM/YYYY'),
    profilePicture:`https://xsgames.co/randomusers/avatar.php?g=${casual.random_element(['male','female'])}`,
    upiId: casual.uuid,
    username: casual.username,
    profileUrl: casual.url,
  };
  try {
    console.log("Before saving user:", user);
    const result = await User.create(user);
    console.log("User saved successfully:", result);
    res.json(user);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Error saving user' });
  }
});




// Generate dummy data and save to database
app.get('/api/generate-dummy-data', async (req, res) => {
  const dummyData = [];
  console.log("generating dummy data...");
  // Generate 100 dummy user records
  for (let i = 1; i <= 100; i++) {
    const user = {
      phoneNumber: casual.phone,
      emailAddress: casual.email,
      name: casual.full_name,
      status: "12:01 AM",
      lastSeen: casual.date_recent,
      profilePicture: `https://randomuser.me/api/portraits/${casual.random_element([
        'men',
        'women',
      ])}/${i}.jpg`,
      upiId: casual.uuid,
      username: casual.username,
      profileUrl: casual.url,
    };
    dummyData.push(user);
  }
  // console.log(dummyData, "dummy data");
  // Save dummy data to the database
  try {
    console.log("Trying to save dummy data...");
    const result = await User.insertMany(dummyData);
    console.log("Dummy data generated and saved successfully");
    console.log("Insert result:", result);
    res.json({ message: 'Dummy data generated and saved successfully' });
  } catch {
    // console.error('Error saving dummy data:');
    console.log("Error object:");
    res.status(500).json({ message: 'Error generating dummy data' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
