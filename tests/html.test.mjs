import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeHtml, safeImageUrl } from '../src/utils/html.js';

test('API text cannot insert tags or break out of quoted attributes', () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(escapeHtml('\" autofocus onfocus=\'alert(1)\' &'), '&quot; autofocus onfocus=&#39;alert(1)&#39; &amp;');
  assert.equal(escapeHtml('Paris'), 'Paris');
  assert.equal(escapeHtml(100), '100');
});

test('destination images accept only absolute HTTP and HTTPS URLs', () => {
  assert.equal(safeImageUrl('https://picsum.photos/300/200?r=1'), 'https://picsum.photos/300/200?r=1');
  assert.equal(safeImageUrl('http://picsum.photos/300/200'), 'http://picsum.photos/300/200');
  for (const value of ['javascript:alert(1)', 'data:image/svg+xml,<svg onload="alert(1)">', 'file:///etc/passwd', '//example.com/a', 'invalid', '']) {
    assert.equal(safeImageUrl(value), '');
  }
});

test('same-origin image paths work without accepting protocol-relative URL injection', () => {
  assert.equal(safeImageUrl('/img/photos/1.jpg'), '/img/photos/1.jpg');
  for (const value of ['//evil.example/a.jpg', '/\\evil.example/a.jpg', '/\n/evil.example/a.jpg']) {
    assert.equal(safeImageUrl(value), '');
  }
});
