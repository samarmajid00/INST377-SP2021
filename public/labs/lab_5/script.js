function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  const mymap = L.map('mapid').setView([38.9907561,-76.9384114], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiY3Bhd2luc3QiLCJhIjoiY2ttM3d0djFuMGsxbzJvbzJ6dmdnZ3hlcSJ9.kvJqb2mlSULFZ6YKqvPZCw'
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap);
console.log('mymap', mymap)
return mymap;
}


async function dataHandler(mapObjectFromFunction) {
const form = document.querySelector('#search-form');
const search = document.querySelector('#search');
const targetList = document.querySelector('target-list');

//const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';
const request = await fetch("/api");
const zipcodes = await request.json();

function findMatches(wordToMatch, zipcodes) {
  return zipcodes.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.zip.match(regex); // || place.state.match(regex);
  });
}

function displayMatches() {

  //an array of 5 matches to loop through and display 


  const matchArray = findMatches(this.value, zipcodes);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city;
    const zipCode = place.zip;
    const addressLine1 = place.address_line_1;
    const {category} = place;
    const restaurantName = place.name;
    return `
      <li>
      <div class = "suggestions li box is-small has-background-orange">
        <span class="name">${restaurantName}</span>
        <br>
        <span class="category">${category}</span>
        <br>
        <span class="address">${addressLine1}</span>
        <br>
        <span class="zipcode">${zipCode}</span>
        <br>
        <span class="city">${cityName}</span>
      </div>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;

  const searchInput = document.querySelector('.button');
  const suggestions = document.querySelector('.suggestions');
  
  searchInput.addEventListener('change', displayMatches);
  searchInput.addEventListener('keyup', displayMatches);

  // use your assignment 1 data handling code h ere
  // and target mapObjectFromFunction to attach markers
  form.addEventListener('submit', async (event) => {
    targetList.innerText = '';
    event.preventDefault();
    console.log('submit activated', search.value);
    //make sure resturaunts show up on map with code - note for charles
    const filtered = data.filter((record) => record.zip.includes(search.value) && record.geocoded_column_1);
    const topfive = filtered.slice(0, 5);
    // add code for filtering top 5

    if (topfive.length < 1) {
      replyMessage.classList.add('box');
      replyMessage.innerText = 'No Matches Found';
    } else {
      console.table(topfive);
      topfive.forEach((item) => {
        const longLatitude = item.geocoded_column_1.coordinates;
        console.log('make long lat', longLatitude[0],longLatitude[1]);
        const marker = L.marker([longLatitude[1],longLatitude[0]]).addTo(mapObjectFromFunction);
  
      const appendItem = document.createElement('li');
      appendItem.classList.add('block');
      appendItem.classList.add('list-item');
      appendItem.innerHTML= `<div class = "list-header is size-5">${item.name}</div><address class ="is-size-6">${item.address_Line_1}</address>`;
      targetList.append(appendItem);
    });
    const {coordinates} = topfive[0]?.geocoded_column_1;
    console.log('view coords',coordinates);
    mapObjectFromFunction.panTo([coordinates[1],coordinates[0]], 0);
    }
    });
  }
}




async function windowActions() {
  const map = mapInit();
  await dataHandler(map);
}

window.onload = windowActions;

