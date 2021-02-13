 const list_container = document.querySelector(".images")

 function shift_left(){
     const last_three = Array.from(list_container.children).slice(4,7).reverse();
     last_three.forEach((element) => {
         list_container.removeChild(element);
         list_container.insertBefore(element, list_container.children[0]);
     });
 }

 function shift_right(){
    const first_three = Array.from(list_container.children).slice(0,3);
    first_three.forEach((element) => {
        list_container.removeChild(element);
        list_container.appendChild(element);
    });
}

function load_page(){
    document.querySelector("button.arrow.prev").addEventListener("click", (event) => {
        shift_left();
    });
    document.querySelector("button.arrow.next").addEventListener("click", (event) => {
        shift_right()
    });
   
}
window.onload = load_page;

