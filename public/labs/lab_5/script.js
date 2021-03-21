/* eslint-disable max-len */

//getting map 
//initialzing map object 
function mapInit(){
  const mymap = L.map('mapid').setView([38.9897, -76.9378], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {

  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiY3Bhd2luc3QiLCJhIjoiY2ttM3d0djFuMGsxbzJvbzJ6dmdnZ3hlcSJ9.kvJqb2mlSULFZ6YKqvPZCw'
}).addTo(mymap);
return mymap;
//returning map 
}

//taking in map 
async function dataHandler(mapFromLeaflet){
  //creating const to get/store things from html 
  const form = document.querySelector('#search-form');
  const search = document.querySelector('#search');
  const targetList = document.querySelector('.target-list');
  const replyMessage = document.querySelector('.reply-message');

  //getting data from the api 
  const request = await fetch('/api');
  const data = await request.json();

  //getting data from the submit button 
  form.addEventListener('submit', async (event) => {
    targetList.innerText = "";
    event.preventDefault();

    //filters so that each record is checked for a record and a geocoded columnn 
    //allows the data to be put into 'filtered' 
    const filtered = data.filter((record) => record.zip.includes(search.value) && record.geocoded_column_1);
    const returnFive = filtered.slice(0, 5);

    //checking if empty 
    if(returnFive.length < 1) {
      replyMessage.classList.add("box");
      replyMessage.innerText = "No matches found";
    } 
    console.log(returnFive);

   //making the data appears as markers  
   returnFive.forEach((item) => {
      const longLat = item.geocoded_column_1.coordinates; // [Long, Lat]
      const marker = L.marker([longLat[1], longLat[0]]).addTo(mapFromLeaflet);
      //getting the long and lat for each restuarant and creating a marker 

      // Creates <li class="block list-item"></li>
      const appendItem = document.createElement('li');
      appendItem.classList.add('block');
      appendItem.classList.add('list-item');
      appendItem.innerHTML = `<div class="list-header is size 5">${item.name}</div><address class ="is size-6">${item.address_line_1}</address>`;
      targetList.append(appendItem);
    });
  })
  
   // this listens for typing into our input box
   search.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    if (search.value.length === 0) {
      // clear your "no matches found" code
      replyMessage.innerText = "";
      replyMessage.classList.remove("box");
    }
  });
}

  async function windowActions(){
    const map = mapInit();
    await dataHandler(map);
  }

window.onload = windowActions;
