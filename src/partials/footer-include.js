(function () {
  const mount = document.getElementById('footer-include');
  if (!mount) return;
  fetch('src/partials/footer.html', { cache: 'no-cache' })
    .then(res => {
      if (!res.ok) throw new Error('Failed to load footer.html');
      return res.text();
    })
    .then(html => {
      mount.outerHTML = html;
    })
    .catch(err => {
      console.error('Footer include error:', err);
    });
})();
