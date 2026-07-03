const axios = require('axios');

module.exports = async (req, res) => {
    // Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { query } = req.body;

    try {
        const response = await axios.post('https://apis.roblox.com/toolbox-service/v2/assets:search', {
            query: query,
            assetTypes: ["Model"],
            limit: 10
        }, {
            headers: {
                'x-api-key': process.env.ROBLOX_API_KEY, // Diambil dari Vercel Environment Variables
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch from Roblox API' });
    }
};
