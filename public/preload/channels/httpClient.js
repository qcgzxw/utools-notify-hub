const https = require('node:https');
const http = require('node:http');

class HttpClient {
  /**
   * @param {boolean} debug 开启调试日志
   */
  constructor(debug = false) {
    this.debug = debug;
  }

  log(...args) {
    if (this.debug) {
      console.log('[HttpClient]', ...args);
    }
  }

  get(url, options = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      this.log('GET request to', url, 'with options', options);
      const client = url.startsWith('https') ? https : http;
      const timeout = options.timeout || 10000;

      const req = client.get(url, (res) => {
        let data = '';
        this.log('Response status', res.statusCode);
        this.log('Response headers', res.headers);

        res.on('data', chunk => {
          data += chunk;
          this.log('Received chunk:', chunk.length, 'bytes');
        });

        res.on('end', () => {
          const duration = Date.now() - start;
          this.log(`Response completed in ${duration}ms`);
          resolve({
            status: res.statusCode,
            data,
            headers: res.headers
          });
        });
      });

      req.setTimeout(timeout, () => {
        this.log(`GET request timeout after ${timeout}ms`);
        req.destroy();
        const err = new Error('请求超时');
        this.log('Error:', err);
        reject(err);
      });

      req.on('error', err => {
        this.log('Request error:', err);
        reject(err);
      });
    });
  }

  post(url, data, options = {}) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const postData = typeof data === 'string' ? data : JSON.stringify(data);
      this.log('POST request to', url, 'with body', postData, 'and options', options);

      const client = url.startsWith('https') ? https : http;
      const timeout = options.timeout || 10000;
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (url.startsWith('https') ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          ...options.headers
        }
      };
      this.log('Request options:', requestOptions);

      const req = client.request(requestOptions, (res) => {
        let responseData = '';
        this.log('Response status', res.statusCode);
        this.log('Response headers', res.headers);

        res.on('data', chunk => {
          responseData += chunk;
          this.log('Received chunk:', chunk.length, 'bytes');
        });

        res.on('end', () => {
          const duration = Date.now() - start;
          this.log(`Response completed in ${duration}ms`);
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        });
      });

      req.setTimeout(timeout, () => {
        this.log(`POST request timeout after ${timeout}ms`);
        req.destroy();
        const err = new Error('请求超时');
        this.log('Error:', err);
        reject(err);
      });

      req.on('error', err => {
        this.log('Request error:', err);
        reject(err);
      });

      req.write(postData);
      req.end();
    });
  }
}

const httpClient = new HttpClient();
module.exports = httpClient;
