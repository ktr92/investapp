export default function closeByClickOutside(element, button, target, callback) {
  const $button = document.querySelector(button)
  const $element = document.querySelector(element)
  function close() {
    if ($button && $element) {
      $button.classList.remove('active')
      if (target) {
        document.querySelector(target).classList.add('hidden')
      } else {
        $element.classList.add('hidden')
      }
      if (callback instanceof Function) {
        callback();
      }
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
