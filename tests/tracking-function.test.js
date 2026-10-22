const test = require('node:test');
const assert = require('node:assert/strict');
const handler = require('../api/v1/track/[trackingNumber].js');
const vercelConfig = require('../vercel.json');

test('uses Vercel static hosting with clean URLs and security headers', () => {
    const headers = vercelConfig.headers.flatMap(rule => rule.headers.map(header => header.key));

    assert.equal(vercelConfig.framework, null);
    assert.equal(vercelConfig.cleanUrls, true);
    assert.ok(headers.includes('X-Content-Type-Options'));
    assert.ok(headers.includes('Strict-Transport-Security'));
});

function createResponse() {
    return {
        headers: {},
        statusCode: 200,
        body: null,
        setHeader(name, value) {
            this.headers[name] = value;
        },
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };
}

test('rejects unsupported methods', async () => {
    const response = createResponse();

    await handler({ method: 'POST', query: {} }, response);

    assert.equal(response.statusCode, 405);
    assert.equal(response.headers.Allow, 'GET');
});

test('rejects malformed tracking numbers', async () => {
    const response = createResponse();

    await handler({ method: 'GET', query: { trackingNumber: '123' } }, response);

    assert.equal(response.statusCode, 400);
});

test('requires a server-side tracking API key', async () => {
    const previousApiKey = process.env.PARTTRACK_API_KEY;
    delete process.env.PARTTRACK_API_KEY;
    const response = createResponse();

    try {
        await handler({ method: 'GET', query: { trackingNumber: '123456789012' } }, response);
        assert.equal(response.statusCode, 503);
        assert.equal(response.headers['Cache-Control'], 'no-store');
    } finally {
        if (previousApiKey === undefined) {
            delete process.env.PARTTRACK_API_KEY;
        } else {
            process.env.PARTTRACK_API_KEY = previousApiKey;
        }
    }
});

test('proxies valid requests with the server-side API key', async () => {
    const previousApiKey = process.env.PARTTRACK_API_KEY;
    const previousFetch = global.fetch;
    process.env.PARTTRACK_API_KEY = 'test-only-key';
    let requestUrl;
    let requestOptions;
    global.fetch = async (url, options) => {
        requestUrl = url;
        requestOptions = options;
        return {
            ok: true,
            status: 200,
            json: async () => ({ success: true, data: { current_status: 'In Transit' } })
        };
    };
    const response = createResponse();

    try {
        await handler({ method: 'GET', query: { trackingNumber: '123456789012' } }, response);
        assert.equal(response.statusCode, 200);
        assert.equal(requestOptions.headers['X-API-Key'], 'test-only-key');
        assert.match(requestUrl, /123456789012$/);
        assert.equal(response.body.data.current_status, 'In Transit');
    } finally {
        global.fetch = previousFetch;
        if (previousApiKey === undefined) {
            delete process.env.PARTTRACK_API_KEY;
        } else {
            process.env.PARTTRACK_API_KEY = previousApiKey;
        }
    }
});
