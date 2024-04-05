export default function numberWithSpaces(x) {
  if (x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  } else {
    if (x===0) {
      return '0'
    } else {
      return ''
    }
  }
}
