export default function closeByClickOutside(element, button, callback) {
  function close() {
    document.querySelector(button).classList.remove('active')
    document.querySelector(element).classList.add('hidden')
    if (callback instanceof Function) {
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
