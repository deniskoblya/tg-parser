export function extractPostTime($, element) {
  const timeElement = $(element).find('.tgme_widget_message_date time');
  return timeElement.attr('datetime') || '';
}

export function extractPostText($, element) {
  const textElement = $(element).find('.tgme_widget_message_text');
  return textElement.text().trim()
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .replace(/\s+/g, ' '); // Normalize whitespace
}

export function extractPostImages($, element) {
  const images = [];
  $(element).find('.tgme_widget_message_photo_wrap').each((_, imgElement) => {
    const style = $(imgElement).attr('style');
    if (style) {
      const match = style.match(/background-image:url\('(.+?)'\)/);
      if (match && match[1]) {
        images.push(match[1]);
      }
    }
  });
  return images;
}