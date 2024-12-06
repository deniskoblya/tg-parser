import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as cheerio from 'cheerio';

// Create axios instance with retry logic
const api = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  }
});

// Configure retry behavior
axiosRetry(api, {
  retries: 5,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Progressive delay
  },
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
           error.code === 'ECONNABORTED' ||
           error.code === 'ECONNRESET' ||
           (error.response && error.response.status >= 500);
  }
});

// Use a CORS proxy to bypass CORS restrictions
const CORS_PROXY = 'https://corsproxy.io/?';

export async function fetchPosts(channelUrl) {
  try {
    console.log('Fetching posts from Telegram channel...');
    
    if (!channelUrl.startsWith('https://t.me/s/')) {
      throw new Error('Invalid URL format. URL should start with https://t.me/s/');
    }
    
    const response = await api.get(`${CORS_PROXY}${encodeURIComponent(channelUrl)}`);
    
    if (!response.data) {
      throw new Error('Empty response received from the server');
    }

    const $ = cheerio.load(response.data);
    const posts = [];

    $('.tgme_widget_message').each((_, element) => {
      try {
        const timeElement = $(element).find('.tgme_widget_message_date time');
        const textElement = $(element).find('.tgme_widget_message_text');
        const imageElements = $(element).find('.tgme_widget_message_photo_wrap');
        const viewsElement = $(element).find('.tgme_widget_message_views');
        
        const images = [];
        imageElements.each((_, img) => {
          const style = $(img).attr('style');
          const match = style?.match(/background-image:url\('(.+?)'\)/);
          if (match && match[1]) {
            images.push(match[1]);
          }
        });

        const post = {
          time: timeElement.attr('datetime') || '',
          text: textElement.text().trim(),
          images: images,
          views: viewsElement.text().trim()
        };

        if (post.text || post.images.length > 0) {
          posts.push(post);
        }
      } catch (err) {
        console.warn('Error parsing individual post:', err);
      }
    });

    if (posts.length === 0) {
      throw new Error('No posts found in the channel');
    }

    return posts.reverse(); // Show newest posts first
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.status
    });
    
    throw new Error(
      error.response?.status === 404
        ? 'Channel not found or is private'
        : 'Failed to fetch posts from Telegram channel'
    );
  }
}