const axios = require('axios');

exports.trackOrder = async (req, res) => {
  const { trackingNumber } = req.params;

  try {
    const response = await axios.get(`https://api.ups.com/track/v1/details/${trackingNumber}`, {
      headers: {
        'AccessLicenseNumber': process.env.UPS_ACCESS_LICENSE, // Replace with your UPS license key
        'Username': process.env.UPS_USERNAME, // Replace with your UPS username
        'Password': process.env.UPS_PASSWORD // Replace with your UPS password
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).send('Tracking error');
  }
};
