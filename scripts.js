const navbar = document.getElementById("navbar");
const hamburgerButton = document.getElementById("hamburger_button");
const gallerySection = document.getElementById("gallery");
const loadMoreButton = document.getElementById("button_load_more");

const body = document.querySelector('body');
const bodyElements = body.getElementsByTagName('*');
const nav = document.querySelector('nav');
const navElements = nav.getElementsByTagName('*');

const main = document.querySelector('main');
const header = document.querySelector('header');
const footer = document.querySelector('footer');


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
  overlay.setAttribute('tabindex', '0');
  overlay.addEventListener('click', function() {
    openFullscreenImage(overlay);
  });
  overlay.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      openFullscreenImage(overlay);
    }
  });
});

function openFullscreenImage(overlay) {
  fullscreen_image.style.backgroundImage = 'url(img/gallery/highRes/' + overlay.previousElementSibling.src.split('/').pop() + ')';
  fullscreen_image.style.display = 'block';
  body.classList.add("stop-scrolling");
}

  fullscreen_image.addEventListener('click', function() {
    fullscreen_image.style.display = 'none';
    body.classList.remove("stop-scrolling");
  });
}




/*Open/close the hamburger menu*/
function openNav() {
  navbar.classList.add("fullscreen_nav");
  body.classList.add("stop-scrolling");

  hamburgerButton.onclick = closeNav;
  hamburgerButton.setAttribute('aria-expanded', 'true');
  hamburgerButton.querySelector("img").src = "img/exit_menu_icon.svg";

  for (let i = 0; i < bodyElements.length; i++) {
    bodyElements[i].setAttribute('tabindex', '-1');
  }
  for (let i = 0; i < navElements.length; i++) {
    navElements[i].removeAttribute('tabindex');
  }
  header.setAttribute("aria-hidden", "true");
  main.setAttribute("aria-hidden", "true");
  footer.setAttribute("aria-hidden", "true");
};

function closeNav() {
  navbar.classList.remove("fullscreen_nav");
  body.classList.remove("stop-scrolling");

  hamburgerButton.onclick = openNav;
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.querySelector("img").src = "img/hamburger_menu_icon.svg";

  for (let i = 0; i < bodyElements.length; i++) {
    bodyElements[i].removeAttribute('tabindex');
  }
  header.removeAttribute("aria-hidden");
  main.removeAttribute("aria-hidden");
  footer.removeAttribute("aria-hidden");
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



function redirectToSection(sectionName) {
  const section = document.getElementById(sectionName);
  const heading = section.querySelector("h1");
  const scrollPos = section.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({ top: scrollPos - 20, behavior: 'auto' });

  heading.setAttribute('tabindex', '-1');
  heading.focus();
  heading.removeAttribute('tabindex');
}


window.onload = addFullScreenView;