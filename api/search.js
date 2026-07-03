const axios = require('axios');

module.exports = async (req, res) => {
    // 1. Pastikan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Pastikan body di-parse sebagai JSON
    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON body' });
        }
    }

    const { query } = body;

    // 3. Cek apakah API Key ada
    if (!process.env.ROBLOX_API_KEY) {
        console.error("DEBUG: ROBLOX_API_KEY is missing in Vercel settings!");
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await axios({
            method: 'post',
            url: 'https://apis.roblox.com/toolbox-service/v2/assets:search',
            data: {
                query: query || "car", // default ke "car" jika query kosong
                assetTypes: ["Model"],
                limit: 10
            },
            headers: {
                'x-api-key': process.env.ROBLOX_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        // 4. Debugging error yang lebih detail ke Logs Vercel
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : error.message;
        
        console.error("ROBLOX API ERROR:", JSON.stringify(data));
        return res.status(status).json({ error: 'Roblox API failed', details: data });
    }
};
