import { fetchChannelPosts } from './telegram-parser.js';
import { formatPost } from './formatter.js';

async function main() {
  console.log('Fetching posts from truexanewsua channel...\n');
  
  try {
    const posts = await fetchChannelPosts();
    
    if (posts.length === 0) {
      console.log('No posts found. The channel might be empty or temporarily unavailable.');
      return;
    }

    console.log(`Successfully retrieved ${posts.length} posts:\n`);
    
    posts.forEach((post, index) => {
      console.log(`Post #${index + 1}`);
      console.log('-------------------');
      console.log(formatPost(post));
      console.log('-------------------\n');
    });
  } catch (error) {
    console.error('Error occurred while fetching posts:');
    console.error(error.message);
    if (error.cause) {
      console.error('Caused by:', error.cause);
    }
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

main();