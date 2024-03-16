export default function closeByClickOutside(element, button, callback) {
  document.addEventListener('click', function(event) {
    if (!event.target.closest(`${element},${button}`)) {
      document.querySelector(button).classList.remove('active')
      document.querySelector(element).classList.add('hidden')
    }
  });

  document.addEventListener('keyup', function(e) {
    if (e.key === 'Escape') {
      document.querySelector(button).classList.remove('active')
      document.querySelector(element).classList.add('hidden')
    }
  });

  if (callback instanceof Function) {
    callback();
  }
}
