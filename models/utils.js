const sanitizeHtml = require('sanitize-html')

exports.sanitize = (content) => {
  return sanitizeHtml(content, {
    allowedTags: ['p', 'h1', 'h2', 'h3', 'b', 'i', 'em', 'strong', 'blockquote', 'a', 'li', 'ol', 'ul'],
    allowedAttributes: { a: ['href'] }
  })
}
