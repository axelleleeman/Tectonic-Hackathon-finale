// Behaviour for kate-flow.html (kept external: the production CSP allows only same-origin scripts).
document.documentElement.classList.add('js');
// Theme toggle (light / dark), remembered per viewer when storage is available.
(function () {
  var root = document.documentElement
  try { var saved = localStorage.getItem('kate-flow-theme'); if (saved) root.setAttribute('data-theme', saved) } catch (e) {}
  document.getElementById('theme').addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches)
    var next = dark ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try { localStorage.setItem('kate-flow-theme', next) } catch (e) {}
  })
})();
// Reveal the three steps in sequence once the flow is on screen (content stays visible without JS).
(function () {
  var flow = document.getElementById('flow')
  if (!('IntersectionObserver' in window)) { flow.classList.add('in'); return }
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { flow.classList.add('in'); io.disconnect() }
  }, { threshold: 0.2 })
  io.observe(flow)
})();
