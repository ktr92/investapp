export default function* idGenerator(startId = 0) {
  let id = startId
  while (true) {
    yield ++id
  }
}
