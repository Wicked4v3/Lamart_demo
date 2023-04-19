const navbar = document.getElementById("navbar");
const gallerySection = document.getElementById("gallery");
const loadMoreButton = document.getElementById("button_load_more");


var prevScrollpos = window.pageYOffset;
// Define the initial number of images and the number of images to add on each load
let numLoadedImages = 12;
const imagesPerLoad = 12;



/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-100px";
  }
  prevScrollpos = currentScrollPos;
};




/*When the user clicks on an image, view it in fullscreen. When the user clicks anywhere on the screen, exit the fullscreen view*/
function addFullScreenView() {
  const gallery_overlays = document.querySelectorAll('.gallery .overlay');
  const fullscreen_image = document.querySelector('#fullscreen_image');

  gallery_overlays.forEach(overlay => {
    overlay.addEventListener('click', function() {
      fullscreen_image.style.backgroundImage = 'url(img/gallery/highRes/' + overlay.previousElementSibling.src.split('/').pop() + ')';
      fullscreen_image.style.display = 'block';
      document.body.classList.add("stop-scrolling");
    });
  });

  fullscreen_image.addEventListener('click', function() {
    fullscreen_image.style.display = 'none';
    document.body.classList.remove("stop-scrolling");
  });
}




/*Open/close the hamburger menu*/
function openNav() {
  navbar.classList.add("fullscreen_nav");
  document.body.classList.add("stop-scrolling");
};

function closeNav() {
  navbar.classList.remove("fullscreen_nav");
  document.body.classList.remove("stop-scrolling");
};

document.querySelectorAll('.menu_link').forEach(item => {
  item.addEventListener('click', event => {
    closeNav();
  })
});




// Define a function to create a new image and overlay element
function createImageElement(imageNumber) {
  // Create a new li element
  const li = document.createElement("li");

  // Create a new image element
  const img = document.createElement("img");
  img.src = "img/gallery/" + imageNumber + ".jpg";
  img.alt = "";
  li.appendChild(img);

  // Create a new overlay element
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  li.appendChild(overlay);

  return li;
};

// Define a function to add the specified number of images to the gallery
function addImages() {
  loadMoreButton.style.display = 'none';
  // Create a document fragment to hold the new elements
  const fragment = document.createDocumentFragment();

  // Loop through the number of images to add and create new image elements
  for (let i = numLoadedImages + 1; i <= numLoadedImages + imagesPerLoad; i += 1) {
    const li = createImageElement(i);
    fragment.appendChild(li);
  }

  // Add the new elements to the gallery
  const ul = gallerySection.getElementsByTagName("ul")[0];
  ul.appendChild(fragment);

  // Update the number of images
  numLoadedImages += imagesPerLoad;
  addFullScreenView();
};



window.onload = addFullScreenView;