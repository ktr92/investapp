export async function fetchCurrency() {
  const url = '//www.cbr-xml-daily.ru/daily_json.js';
  const currRate = await fetch(url)
      .then(response => response.json())
      .then(data => {
        const res = Object.keys(data.Valute).map(key => {
          const val = data.Valute[key].Value
          return {
            id: key,
            value: val
          }
        })

        return res
      })
      .catch(error => {
        console.error('Ошибка при получении данных: ', error)
        return []
      });

  return currRate
}
