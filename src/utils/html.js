const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => HTML_ENTITIES[character]);

export const safeImageUrl = (value) => {
  try {
    const base = 'https://big-trip.invalid';
    const url = new URL(value, base);
    if (String(value).startsWith('/') && !String(value).startsWith('//') && url.origin === base) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    if (!/^https?:\/\//i.test(value)) {
      return '';
    }
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
};
