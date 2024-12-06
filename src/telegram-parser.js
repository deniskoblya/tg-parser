import * as cheerio from 'cheerio';
import { fetchWithFallback } from './utils/http-client.js';
import { extractPostTime, extractPostText, extractPostImages } from './extractors.js';
import { CHANNEL_URL } from './config.js';

export async function fetchChannelPosts() {
  try {
    console.log(`Fetching data from ${CHANNEL_URL}...`);
    const html = await fetchWithFallback(CHANNEL_URL);

    if (!html || typeof html !== 'string') {
      throw new Error('Invalid response format received');
    }

    const $ = cheerio.load(html);
    const posts = [];

    $('.tgme_widget_message').each((_, element) => {
      try {
        const post = {
          time: extractPostTime($, element),
          text: extractPostText($, element),
          images: extractPostImages($, element)
        };

        if (post.text || post.images.length > 0) {
          posts.push(post);
        }
      } catch (error) {
        console.warn('Error parsing post:', error.message);
      }
    });

    if (posts.length === 0) {
      console.warn('No posts found in the response');
    }

    return posts.reverse();
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.status
    });
    throw new Error(`Failed to fetch channel posts: ${error.message}`);
  }
}