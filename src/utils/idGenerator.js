export default function* idGenerator() {
  let id = 0
  while (true) {
    yield ++id
  }
}
