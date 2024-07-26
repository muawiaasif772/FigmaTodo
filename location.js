export const currLocCon = document.querySelector('.current-loc-con');
export const prevLocCon = document.querySelector('.previous-loc-con');
export const coordinates = [29.3544, 71.6911];

export const getLatLong = function () {
  return new Promise(resolve => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          resolve([latitude, longitude]);
        },
        () => resolve(coordinates)
      );
    } else resolve(coordinates);
  });
};

export const fetchData = async function (lat, lon) {
  const apiKey = '269e2523f92542e934133cd485093bd6';
  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  return fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(() => 'error');
};

export const displayFetchedData = function (lat, lon, name, state, country) {
  const currentLocation = document.createElement('div');
  currentLocation.classList.add('current-loc-added');

  const label = document.createElement('label');
  label.textContent = '📍';

  const cityInfo = document.createElement('p');
  cityInfo.classList.add('city');
  cityInfo.textContent = `${name}, ${state}, ${country}`;

  const coordinates = document.createElement('p');
  coordinates.classList.add('coordinates');
  coordinates.textContent = `${lat}° N, ${lon}° E`;

  const existingCurrentLocation =
    currLocCon.querySelector('.current-loc-added');

  if (existingCurrentLocation) {
    existingCurrentLocation.classList.remove('current-loc-added');
    existingCurrentLocation.classList.add('previous-loc-added');
    prevLocCon.prepend(existingCurrentLocation);
    localStorage.setItem('previousLocation', prevLocCon.innerHTML);
  }

  currentLocation.append(label, cityInfo, coordinates);

  currLocCon.append(currentLocation);
  localStorage.setItem('currentLocation', currLocCon.innerHTML);
};
