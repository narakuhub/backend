const axios = require('axios');

module.exports = async (req, res) => {
    // 1. Hanya izinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Parse body (handle string atau object)
    let body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { query } = body;

    // 3. Validasi API Key
    if (!process.env.ROBLOX_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // 4. Request ke Roblox dengan categoryPath yang wajib ada
        const response = await axios({
            method: 'post',
            url: 'https://apis.roblox.com/toolbox-service/v2/assets:search',
            data: {
                query: query || "car",
                assetTypes: ["Model"],
                limit: 10,
                // Parameter ini yang sering bikin error 400 kalau kosong
                category: {
                    categoryPath: "Models",
                    searchCategoryType: "Featured"
                }
            },
            headers: {
                'x-api-key': process.env.ROBLOX_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        return res.status(200).json(response.data);
    } catch (error) {
        // 5. Log detail error ke Vercel untuk debugging
        const status = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : error.message;
        
        console.error("ROBLOX API ERROR:", JSON.stringify(errorData));
        return res.status(status).json({ error: 'Roblox API failed', details: errorData });
    }
};
