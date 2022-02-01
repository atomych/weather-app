const citiesList = document.querySelector('.cities-list')
const searchInput = document.querySelector('.search-input')
const updateWeatherBtn = document.querySelector('.btn-update')

async function getCities() {
  const response = await fetch('./js/data.json')

  if (response) {
    const data = await response.json()
    return data
  } else {
    console.error(response)
    return null
  }
}

async function getWeather(code) {
  const apiKey = 'f61129cd32fad61bf71cec359c80c87e'
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${code}&appid=${apiKey}`)
  if (response) {
    const data = await response.json()
    return data
  } else {
    console.error(response)
    return null
  }
}

const waitingAnimation = (first, second) => {
  document.body.style.opacity = .3
  document.querySelector(first).style.display = 'none'
  setTimeout(() => {
    document.body.style.opacity = 1
    document.querySelector(second).style.display = 'flex'
  }, 100)
}

const getTime = data => {
  const newDate = new Date(data*1000)
  return `${newDate.getHours()}:${newDate.getMinutes() < 10 ? '0' + newDate.getMinutes().toString() : newDate.getMinutes()}`
}

const getWindDirection = deg => {
  if (deg >= 338 || deg <= 22) {
    return 'Северный'
  } else if (deg < 68) {
    return 'Северо-восточный'
  } else if (deg <= 112) {
    return 'Восточный'
  } else if (deg < 158) {
    return 'Южно-восточный'
  } else if (deg <= 202) {
    return 'Южный'
  } else if (deg < 248) {
    return 'Южно-западный'
  } else if (deg <= 292) {
    return 'Западный'
  } else {
    return 'Северо-западный'
  }
}

const clearWeather = () => {
  document.querySelector('.city-name').dataset.code = ''
  document.querySelector('.city-name').textContent = ''
  document.querySelector('.temp').textContent = ''
  document.querySelector('.weather-icon').setAttribute('src', '')
  document.querySelector('.main-temp-v').textContent = ''
  document.querySelector('.temp-fl-v').textContent = ''
  document.querySelector('.temp-max-v').textContent = ''
  document.querySelector('.temp-min-v').textContent = ''
  document.querySelector('.wind-speed-v').textContent = ''
  document.querySelector('.wind-direction-v').textContent = ''
  document.querySelector('.clouds-v').textContent = ''
  document.querySelector('.pressure-v').textContent = ''
  document.querySelector('.sunrise-v').textContent = ''
  document.querySelector('.sunset-v').textContent = ''
  document.querySelector('.snow-1h-v').textContent = ''
  document.querySelector('.snow-1h').classList.add('hide')
  document.querySelector('.snow-3h-v').textContent = ''
  document.querySelector('.snow-3h').classList.add('hide')
  document.querySelector('.rain-1h-v').textContent = ''
  document.querySelector('.rain-1h').classList.add('hide')
  document.querySelector('.rain-3h-v').textContent = ''
  document.querySelector('.rain-3h').classList.add('hide')
}

const displayWeather = (data, name) => {
  clearWeather()
  document.querySelector('.city-name').dataset.code = data.id
  document.querySelector('.city-name').textContent = name
  document.querySelector('.temp').textContent = Math.round(data.main.temp - 273.15) + '℃'
  document.querySelector('.weather-icon').setAttribute('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
  document.querySelector('.main-temp-v').textContent = Math.round(data.main.temp - 273.15) + '℃'
  document.querySelector('.temp-fl-v').textContent = Math.round(data.main.feels_like - 273.15) + '℃'
  document.querySelector('.temp-max-v').textContent = Math.round(data.main.temp_max - 273.15) + '℃'
  document.querySelector('.temp-min-v').textContent = Math.round(data.main.temp_min - 273.15) + '℃'
  if (data.snow) {
    if (data.snow['1h']) {document.querySelector('.snow-1h-v').textContent = `${data.snow['1h']}мм`
                          document.querySelector('.snow-1h').classList.remove('hide')}
    if (data.snow['3h']) {document.querySelector('.snow-3h-v').textContent = `${data.snow['3h']}мм`
                          document.querySelector('.snow-3h').classList.remove('hide')}
  }
  if (data.rain) {
    if (data.rain['1h']) {document.querySelector('.rain-1h-v').textContent = `${data.rain['1h']}мм`
                          document.querySelector('.rain-1h').classList.remove('hide')}
    if (data.rain['3h']) {document.querySelector('.rain-3h-v').textContent = `${data.rain['3h']}мм`
                          document.querySelector('.rain-3h').classList.remove('hide')}
  }
  document.querySelector('.wind-speed-v').textContent = `${data.wind.speed}м/с`
  document.querySelector('.wind-direction-v').textContent = getWindDirection(data.wind.deg)
  document.querySelector('.clouds-v').textContent = `${data.clouds.all}%`
  document.querySelector('.pressure-v').textContent = `${Math.round(data.main.pressure*100/133,322)}мм`
  document.querySelector('.sunrise-v').textContent = getTime(data.sys.sunrise)
  document.querySelector('.sunset-v').textContent = getTime(data.sys.sunset)
}

const updateCities = (list) => {
  citiesList.innerHTML = ''
  for (item of list) {
    const cityHTML = `<li class="city-item" data-code="${item.id}">${item.name}</li>`
    citiesList.innerHTML += cityHTML
  }
  for (item of document.querySelectorAll('.city-item')) {
    item.addEventListener('click', (event) => {
      getWeather(event.path[0].dataset.code)
      .then(data => displayWeather(data, event.path[0].textContent))
      waitingAnimation('.cities', '.weather')
    })
  }
}

window.addEventListener('load', () => {
  getCities().then(data => updateCities(data))
})

searchInput.addEventListener('input', (event) => {
  const list = document.querySelectorAll('.city-item')
  for (item of list) {
    item.style.display = 'block'
  }
  if (searchInput.value.length > 0) {
    for (item of list) {
      if (searchInput.value.toLowerCase() != item.textContent.slice(0, searchInput.value.length).toLowerCase()) {
        item.style.display = 'none'
      }
    }
  }
})

updateWeatherBtn.addEventListener('click', () => {
  getWeather(document.querySelector('.city-name').dataset.code)
  .then(data => displayWeather(data, document.querySelector('.city-name').textContent))
  waitingAnimation('.weather', '.weather')
})

document.querySelector('.city-name').addEventListener('click', () => {  
  waitingAnimation('.weather', '.cities')
})