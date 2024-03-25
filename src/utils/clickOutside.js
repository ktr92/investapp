export default function closeByClickOutside(element, button, callback) {
  function close() {
    if (callback instanceof Function) {
      document.querySelector(button).classList.remove('active')
      document.querySelector(element).classList.add('hidden')
      callback();
    }
  }

  document.addEventListener('click', function(event) {
    if (!event.target.closest(`${element},${button}`)) {
      close()
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key === 'Escape') {
      close()
    }
  });
}
