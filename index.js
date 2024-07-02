const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.ip;

  console.log('Client IP:', clientIp);

  try {
    console.log('Fetching data from Weatherstack...');
    const response = await axios.get(`http://api.weatherstack.com/current`, {
      params: {
        access_key: process.env.WEATHERSTACK_API_KEY,
        query: clientIp
      }
    });
    
    console.log('Response from Weatherstack:', response.data);

    const location = response.data.location.name;
    const temperature = response.data.current.temperature;

    const result = {
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
