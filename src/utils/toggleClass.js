export default function changeClass(element, classname) {
  if (element.classList.contains(classname)) {
    element.classList.remove(classname)
  } else {
    element.classList.add(classname)
  }
}
