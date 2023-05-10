// Get references to HTML elements.
// These will be used for various functionality throughout the script.
const body = document.querySelector('body');
const bodyElements = body.getElementsByTagName('*');
const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navElementsArray = Array.from(nav.querySelectorAll('*'));
const main = document.querySelector('main');
const footer = document.querySelector('footer');

const navbar = document.getElementById("navbar");
const hamburgerButton = document.getElementById("hamburger_button");
const mobileBanner = document.getElementById("mobile_banner");
const gallerySection = document.getElementById("gallery");
const fullscreenImage = document.querySelector('#fullscreen_image');
const loadMoreButton = document.getElementById("button_load_more");

// This is a honeypot field used as a spam prevention technique in the form.
const honeypotField = document.getElementById("lastname");

// Store the previous scroll position for comparison on scroll events.
var prevScrollPos = window.pageYOffset;

// Store the previous focused element for correct redirecting after exiting fullscreen image view.
var prevFocusedElement = document.activeElement;

// Constants for controlling the image loading functionality.
let numLoadedImages = 12;
const imagesPerLoad = 12;

// Array containing descriptions for the gallery images that are loaded in by the image loading functionality.
// Each object in the array represents an image and has two properties: 
// "number" - the image number (used to match the image file)
// "description" - the alt text for the image
const imageDescriptions = [
  { number: "13", description: "Sett inn bildebeskrivelsen her" },
  { number: "14", description: "Sett inn bildebeskrivelsen her" },
  { number: "15", description: "Sett inn bildebeskrivelsen her" },
  { number: "16", description: "Sett inn bildebeskrivelsen her" },
  { number: "17", description: "Sett inn bildebeskrivelsen her" },
  { number: "18", description: "Sett inn bildebeskrivelsen her" },
  { number: "19", description: "Sett inn bildebeskrivelsen her" },
  { number: "20", description: "Sett inn bildebeskrivelsen her" },
  { number: "21", description: "Sett inn bildebeskrivelsen her" },
  { number: "22", description: "Sett inn bildebeskrivelsen her" },
  { number: "23", description: "Sett inn bildebeskrivelsen her" },
  { number: "24", description: "Sett inn bildebeskrivelsen her" },
  ];



// Scroll event listener to show/hide the navbar based on scroll direction.
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos || currentScrollPos < 100) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-100px";
  }
  prevScrollPos = currentScrollPos;
};



// This function adds fullscreen view functionality to gallery images.
// It also ensures proper tab order and ARIA accessibility when an image is enlarged.
// It's necessary to call this function whenever new images are added to the gallery to ensure they also have fullscreen view functionality.
function addFullScreenView() {
  const gallery_links = document.querySelectorAll('.gallery_link');

  gallery_links.forEach(gallery_link => {
    gallery_link.addEventListener('click', function() {
      prevFocusedElement = document.activeElement;
      
      fullscreenImage.style.backgroundImage = 'url(img/gallery/highRes/' + gallery_link.querySelector('img').src.split('/').pop() + ')';
      fullscreenImage.style.display = 'block';
      fullscreenImage.querySelector('button').focus();
      body.classList.add("stop-scrolling");

      for (let i = 0; i < bodyElements.length; i++) {
        bodyElements[i].setAttribute('tabindex', '-1');
      }
      fullscreenImage.removeAttribute('tabindex');

      nav.setAttribute("aria-hidden", "true");
      header.setAttribute("aria-hidden", "true");
      main.setAttribute("aria-hidden", "true");
      footer.setAttribute("aria-hidden", "true");
    });
  });

  fullscreenImage.addEventListener('click', exitFullscreenView);
}

// Function to exit the fullscreen view of an image.
// It also ensures proper tab order and ARIA accessibility.
// This is called when the user clicks anywhere inside the fullscreen image container.
function exitFullscreenView() {  
  fullscreenImage.style.display = 'none';

  body.classList.remove("stop-scrolling");

  for (let i = 0; i < bodyElements.length; i++) {
    bodyElements[i].removeAttribute('tabindex');
  }

  nav.removeAttribute("aria-hidden");
  header.removeAttribute("aria-hidden");
  main.removeAttribute("aria-hidden");
  footer.removeAttribute("aria-hidden");

  prevFocusedElement.focus();
}



// This function opens the hamburger menu and makes various accessibility-related changes:
// It disables scrolling, changes the hamburger button's functionality and image, 
// and modifies tabindex and aria-hidden attributes to ensure proper tab order and screen reader behavior.
function openNav() {
  navbar.classList.add("fullscreen_nav");
  body.classList.add("stop-scrolling");

  hamburgerButton.onclick = closeNav;
  hamburgerButton.setAttribute('aria-expanded', 'true');
  hamburgerButton.querySelector("img").src = "img/exit_menu_icon.svg";

  for (let i = 0; i < bodyElements.length; i++) {
    if (!navElementsArray.includes(bodyElements[i])) {
      bodyElements[i].setAttribute('tabindex', '-1');
    } else {
      bodyElements[i].removeAttribute('tabindex');
    }
  }
  
  main.setAttribute("aria-hidden", "true");
  footer.setAttribute("aria-hidden", "true");
  mobileBanner.setAttribute("aria-hidden", "true");
};

// This function closes the hamburger menu and makes various accessibility-related changes:
// It enables scrolling, changes the hamburger button's functionality and image, 
// and modifies tabindex and aria-hidden attributes to ensure proper tab order and screen reader behavior.
function closeNav() {
  navbar.classList.remove("fullscreen_nav");
  body.classList.remove("stop-scrolling");

  hamburgerButton.onclick = openNav;
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.querySelector("img").src = "img/hamburger_menu_icon.svg";

  for (let i = 0; i < bodyElements.length; i++) {
    bodyElements[i].removeAttribute('tabindex');
  }

  main.removeAttribute("aria-hidden");
  footer.removeAttribute("aria-hidden");
  mobileBanner.removeAttribute("aria-hidden");
};

// Event listener to close the navigation menu when a link is clicked.
document.querySelectorAll('.menu_link').forEach(item => {
  item.addEventListener('click', event => {
    closeNav();
  })
});



// This function creates a new image element for the gallery. 
// The created element is a list item (li) that includes a button with an image and an overlay div:
// <li>
//   <button class="gallery_link">
//     <img class="gallery_image" src="..." alt="..." />
//   </button>
//   <div class="overlay"></div>
// </li>
// The image source and alt text are set based on the image number.
// The function returns the newly created list item.
function createImageElement(imageNumber) {
  const li = document.createElement("li");

  const button = document.createElement("button");
  button.setAttribute("class", "gallery_link");
  li.appendChild(button);

  const img = document.createElement("img");
  img.src = "img/gallery/" + imageNumber + ".jpg";
  img.setAttribute("class", "gallery_image");

  const imageDescription = imageDescriptions.find(
    (image) => image.number === imageNumber.toString()
    );
  if (imageDescription) {
    img.alt = imageDescription.description;
  } else {
    img.alt="";
  }

  button.appendChild(img);

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  li.appendChild(overlay);

  return li;
};

// Function to add a specified number of images to the gallery.
// This is called by the "Load More" button's click event.
function addImages() {
  loadMoreButton.style.display = 'none';

  const fragment = document.createDocumentFragment();

  for (let i = numLoadedImages + 1; i <= numLoadedImages + imagesPerLoad; i += 1) {
    const li = createImageElement(i);
    fragment.appendChild(li);
  }

  const ul = gallerySection.getElementsByTagName("ul")[0];
  ul.appendChild(fragment);

  const listItems = gallerySection.querySelectorAll('li');
  listItems[numLoadedImages].setAttribute('tabindex', '-1');
  listItems[numLoadedImages].focus();
  listItems[numLoadedImages].removeAttribute('tabindex');

  numLoadedImages += imagesPerLoad;
  addFullScreenView();
};



// This function scrolls to a specified section and focuses on the section's heading. 
// It's used for internal navigation links to ensure proper focus management.
function redirectToSection(sectionName) {
  const section = document.getElementById(sectionName);
  const heading = section.querySelector("h1");
  const scrollPos = section.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({ top: scrollPos - 20, behavior: 'auto' });

  heading.setAttribute('tabindex', '-1');
  heading.focus();
  heading.removeAttribute('tabindex');
}



// Event listener for form submission.
// This checks the honeypot field and prevents form submission if it contains a value.
document.getElementById('my_form').addEventListener('submit', (event) => {
  if (honeypotField.value !== '') {
    event.preventDefault();
    return false;
  }
});



// When the page loads, add fullscreen view functionality to the existing gallery images.
window.onload = addFullScreenView;