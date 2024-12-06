export function formatPost(post) {
  const parts = [];
  
  if (post.time) {
    const date = new Date(post.time);
    parts.push(`📅 Time: ${date.toLocaleString()}`);
  }
  
  if (post.text) {
    parts.push(`📝 Content:\n${post.text}`);
  }
  
  if (post.images && post.images.length > 0) {
    parts.push(`🖼️ Images: ${post.images.length} attachment(s)`);
    post.images.forEach((url, index) => {
      parts.push(`  ${index + 1}. ${url}`);
    });
  }
  
  return parts.join('\n\n');
}