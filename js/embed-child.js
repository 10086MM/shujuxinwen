(function () {
  if (window.parent === window) return;

  function getRoot() {
    return document.getElementById('embed-fit') || document.body;
  }

  function measureHeight() {
    var root = getRoot();
    if (!root) return 0;
    /* 只量内容包裹层自身高度，不受 iframe 视口拉高影响 */
    var rect = root.getBoundingClientRect();
    var style = window.getComputedStyle(root);
    var mt = parseFloat(style.marginTop) || 0;
    var mb = parseFloat(style.marginBottom) || 0;
    return Math.max(1, Math.ceil(rect.height + mt + mb + 2));
  }

  var timer = 0;
  function notify() {
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      window.parent.postMessage({ type: 'embed-resize', height: measureHeight() }, '*');
    }, 16);
  }

  window.addEventListener('load', notify);
  window.addEventListener('resize', notify);
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'embed-parent-ready') notify();
  });

  document.querySelectorAll('img').forEach(function (img) {
    if (img.complete) return;
    img.addEventListener('load', notify);
    img.addEventListener('error', notify);
  });

  var root = getRoot();
  if (root && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(notify).observe(root);
  }

  [30, 120, 400, 1000, 2000].forEach(function (delay) {
    window.setTimeout(notify, delay);
  });
})();
