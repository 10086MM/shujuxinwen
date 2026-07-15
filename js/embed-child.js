(function () {
  if (window.parent === window) return;

  /**
   * 只量 body 实际内容底部，不用量 html/body 的 scrollHeight。
   * 否则父页把 iframe 临时拉高后，会把视口空白算进高度。
   */
  function measureHeight() {
    var body = document.body;
    if (!body) return 0;

    var bodyStyle = window.getComputedStyle(body);
    var padBottom = parseFloat(bodyStyle.paddingBottom) || 0;
    var bottom = 0;
    var children = body.children;

    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      var style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (style.position === 'fixed' || style.position === 'sticky') continue;
      var rect = el.getBoundingClientRect();
      var marginBottom = parseFloat(style.marginBottom) || 0;
      bottom = Math.max(bottom, rect.bottom + marginBottom);
    }

    if (bottom <= 0) {
      bottom = body.getBoundingClientRect().bottom;
    }

    return Math.ceil(bottom + window.pageYOffset + padBottom + 8);
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
    new ResizeObserver(function () {
      window.requestAnimationFrame(notify);
    }).observe(document.body);
  }

  [50, 150, 400, 800, 1500, 3000].forEach(function (delay) {
    window.setTimeout(notify, delay);
  });
})();
