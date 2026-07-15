(function () {
  if (window.parent === window) return;

  function measureHeight() {
    var body = document.body;
    var html = document.documentElement;
    /* 不用 clientHeight：父页面临时拉高 iframe 时会把视口高度误算进内容高度 */
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  }

  function notify() {
    window.parent.postMessage({ type: 'embed-resize', height: measureHeight() }, '*');
  }

  window.addEventListener('load', notify);
  window.addEventListener('resize', notify);

  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete) return;
    img.addEventListener('load', notify);
    img.addEventListener('error', notify);
  });

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(notify).observe(document.body);
  }

  [50, 150, 400, 800, 1500, 3000, 5000].forEach(function (delay) {
    window.setTimeout(notify, delay);
  });
})();
