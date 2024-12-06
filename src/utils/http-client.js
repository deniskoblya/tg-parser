import axios from 'axios';
import axiosRetry from 'axios-retry';
import { SocksProxyAgent } from 'socks-proxy-agent';
import tunnel from 'tunnel';
import { getRandomUserAgent } from './user-agents.js';

const PROXY_LIST = [
  { host: 'proxy1.example.com', port: 1080, type: 'socks5' },
  { host: 'proxy2.example.com', port: 8080, type: 'http' }
];

function createProxyAgent(proxy) {
  if (proxy.type === 'socks5') {
    return new SocksProxyAgent(`socks5://${proxy.host}:${proxy.port}`);
  } else {
    return tunnel.httpsOverHttp({
      proxy: {
        host: proxy.host,
        port: proxy.port
      }
    });
  }
}

function createAxiosInstance(proxy = null) {
  const config = {
    timeout: 30000,
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0'
    }
  };

  if (proxy) {
    config.httpsAgent = createProxyAgent(proxy);
  }

  const instance = axios.create(config);

  axiosRetry(instance, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
             error.code === 'ECONNABORTED' ||
             error.code === 'ECONNRESET' ||
             (error.response && error.response.status === 429);
    }
  });

  return instance;
}

export async function fetchWithFallback(url) {
  let lastError;

  // Try without proxy first
  try {
    const directInstance = createAxiosInstance();
    const response = await directInstance.get(url);
    return response.data;
  } catch (error) {
    lastError = error;
    console.log('Direct connection failed, trying with proxies...');
  }

  // Try with each proxy
  for (const proxy of PROXY_LIST) {
    try {
      const proxyInstance = createAxiosInstance(proxy);
      const response = await proxyInstance.get(url);
      return response.data;
    } catch (error) {
      lastError = error;
      console.log(`Proxy ${proxy.host} failed, trying next...`);
    }
  }

  throw lastError;
}