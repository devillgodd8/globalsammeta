const TRACKING_API_URL = 'https://app.reviorcm.com/backend/index.php/api/v1/track/';

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ success: false, error: 'Method not allowed.' });
    }

    const trackingNumber = String(req.query.trackingNumber || '').trim().replace(/[^a-zA-Z0-9]/g, '');
    if (trackingNumber.length < 6 || trackingNumber.length > 32) {
        return res.status(400).json({ success: false, error: 'Please enter a valid consignment tracking number.' });
    }

    const apiKey = process.env.PARTTRACK_API_KEY;
    if (!apiKey) {
        console.error('Tracking service is missing its API key configuration.');
        return res.status(503).json({ success: false, error: 'Tracking is temporarily unavailable. Please contact support.' });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
        const upstreamResponse = await fetch(TRACKING_API_URL + encodeURIComponent(trackingNumber), {
            headers: {
                Accept: 'application/json',
                'X-API-Key': apiKey
            },
            signal: controller.signal
        });

        let payload;
        try {
            payload = await upstreamResponse.json();
        } catch (error) {
            return res.status(502).json({ success: false, error: 'Tracking service returned an invalid response.' });
        }

        if (upstreamResponse.status === 404) {
            return res.status(404).json({ success: false, error: 'No tracking record was found. Please verify the number or contact support.' });
        }

        if (!upstreamResponse.ok) {
            return res.status(502).json({ success: false, error: 'Tracking is temporarily unavailable. Please contact support.' });
        }

        if (payload && payload.success === false) {
            return res.status(404).json({ success: false, error: 'No tracking record was found. Please verify the number or contact support.' });
        }

        if (!payload || payload.success !== true || !payload.data || typeof payload.data !== 'object') {
            return res.status(502).json({ success: false, error: 'Tracking is temporarily unavailable. Please contact support.' });
        }

        return res.status(200).json({ success: true, data: payload.data });
    } catch (error) {
        const statusCode = error.name === 'AbortError' ? 504 : 502;
        return res.status(statusCode).json({ success: false, error: 'Tracking is temporarily unavailable. Please try again later.' });
    } finally {
        clearTimeout(timeout);
    }
};
