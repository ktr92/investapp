export async function getUSD() {
  const url = '//www.cbr-xml-daily.ru/daily_json.js';

  const usdRate = await fetch(url)
      .then(response => response.json())
      .then(data => {
        const result = data.Valute.USD.Value;
        return result
      })
      .catch(error => console.error('Ошибка при получении данных: ', error));

  return usdRate
}
