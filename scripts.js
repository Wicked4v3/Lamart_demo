const body = document.querySelector('body');
const header = body.querySelector('header');
const main = body.querySelector('main');
const footer = body.querySelector('footer');
const fullscreenImage = body.querySelector('#fullscreen_image');

const navbar = header.querySelector("#navbar");
const hamburgerButton = header.querySelector("#hamburger_button");
const navAboutMe = header.querySelector("#nav_about_me");
const navGallery = header.querySelector("#nav_gallery");
const navPricing = header.querySelector("#nav_pricing");
const navContact = header.querySelector("#nav_contact");
const navInstagram = header.querySelector("#nav_instagram");
const mobileBanner = header.querySelector("#mobile_banner");

const gallerySection = main.querySelector("#gallery");
const loadMoreButton = main.querySelector("#button_load_more");

const buttonBackToTop = footer.querySelector("#button_back_to_top");



// This is a honeypot field used as a spam prevention technique in the form.
const inconspicuousField = main.querySelector("#lastname");

// Store the previous scroll position for comparison on scroll events.
let prevScrollPos = window.pageYOffset;

// This variable will hold a reference to a setTimeout function used in the scroll event listener for showing/hiding the navbar.
let timeoutId;

// Store the previous focused element for correct redirecting after exiting fullscreen image view.
let prevFocusedElement = document.activeElement;

// Constants for controlling the image loading functionality.
let numLoadedImages = 12;
const imagesPerLoad = 12;

// Array containing descriptions for the gallery images that are loaded in by the image loading functionality, where:
// "number" - the image number (should match the image file name)
// "description" - the alt text for the image
const galleryImageDescriptions = [
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

function generateSrcset(imageNumber) {
  return `img/gallery/${imageNumber}x414.webp 414w,
  img/gallery/${imageNumber}x632.webp 632w,
  img/gallery/${imageNumber}x760.webp 760w,
  img/gallery/${imageNumber}x950.webp 950w`;
}

function generateSizes() {
  return `(min-width: 1920px) 950px,
  (min-width: 1536px) 760px,
  (min-width: 1280px) 632px,
  414px`;
}



// Scroll event listener to show/hide the navbar based on scroll direction.
window.onscroll = function() {
  const currentScrollPos = window.pageYOffset;

  if (prevScrollPos > currentScrollPos || currentScrollPos < 100) {
    clearTimeout(timeoutId);
    navbar.style.top = "0";
  } else {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      navbar.style.top = "-100px";
    }, 200);
  }

  prevScrollPos = currentScrollPos;
};



// This function adds fullscreen view functionality to gallery images.
// It also ensures proper tab order and ARIA accessibility when an image is enlarged.
// It's necessary to call this function whenever new images are added to the gallery to ensure they also have fullscreen view functionality.
function addFullScreenView() {
  const gallery_links = gallerySection.querySelectorAll('.gallery_link');

  gallery_links.forEach(gallery_link => {
    gallery_link.addEventListener('click', function() {
      prevFocusedElement = document.activeElement;
      fullscreenImage.style.backgroundImage = 'url(img/gallery/highRes/' + gallery_link.querySelector('img').src.split('/').pop().split('x')[0] + '.jpg)';
      fullscreenImage.style.display = 'block';
      body.classList.add("stop-scrolling");

      disableElements(header, main, footer);
      fullscreenImage.querySelector('button').focus();
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

  enableElements(header, main, footer);
  prevFocusedElement.focus();
}



// This function opens the hamburger menu and makes various accessibility-related changes:
// It disables scrolling, changes the hamburger button's functionality and image, 
// and modifies tabindex and aria-hidden attributes to ensure proper tab order and screen reader behavior.
function openNav() {
  body.classList.add("stop-scrolling");
  navbar.classList.add("fullscreen_nav");
  hamburgerButton.removeEventListener('click', openNav);
  hamburgerButton.addEventListener('click', closeNav);
  hamburgerButton.setAttribute('aria-expanded', 'true');
  hamburgerButton.querySelector("img").src = "img/exit_menu_icon.svg";

  disableElements(main, footer, mobileBanner);
};

// This function closes the hamburger menu and makes various accessibility-related changes:
// It enables scrolling, changes the hamburger button's functionality and image, 
// and modifies tabindex and aria-hidden attributes to ensure proper tab order and screen reader behavior.
function closeNav() {
  body.classList.remove("stop-scrolling");
  navbar.classList.remove("fullscreen_nav");
  hamburgerButton.removeEventListener('click', closeNav);
  hamburgerButton.addEventListener('click', openNav);
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.querySelector("img").src = "img/hamburger_menu_icon.svg";

  enableElements(main, footer, mobileBanner);
};



// This function creates a new image element for the gallery. 
// The created element is a list item (li) that includes a button with an image and an overlay div:
// <li>
//   <button class="gallery_link">
//     <img class="gallery_image" loading="lazy" src="..." srcset="..." sizes="..." alt="..." />
//   </button>
//   <div class="overlay"></div>
// </li>
// The image source and alt text are set based on the image number.
// The function returns the newly created list item.
function createImageElement(imageNumber) {
  const li = document.createElement("li");

  const button = document.createElement("button");
  button.className = "gallery_link";
  li.appendChild(button);

  const img = document.createElement("img");
  img.src = "img/gallery/" + imageNumber + "x950.webp";
  img.srcset = generateSrcset(imageNumber);
  img.sizes = generateSizes();
  img.className = "gallery_image";

  const imageDescription = galleryImageDescriptions.find(
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
// Additionally, it redirects the tab/focus to the first new image
// and adds fullscreen view functionality to each image
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
  const imageButton = listItems[numLoadedImages].querySelector('button');
  imageButton.focus();

  numLoadedImages += imagesPerLoad;
  addFullScreenView();
};



// This function scrolls to a specified section and focuses on the section's heading.
// It's used for internal navigation links to ensure proper focus management.
// Additionallly, if the fullscreen navmenu is open, it closes it too.
function redirectToSection(sectionName) {
  if (sectionName === "top") {
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    navbar.setAttribute('tabindex', '1');
    navbar.focus();
    navbar.removeAttribute('tabindex');
  } else {
    closeNav();

    const section = document.getElementById(sectionName);
    const heading = section.querySelector("h1");
    const scrollPos = section.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({ top: scrollPos - 20, behavior: 'auto' });

    heading.setAttribute('tabindex', '1');
    heading.focus();
    heading.removeAttribute('tabindex');
  }
}



// Function to enable elements by removing 'aria-hidden' and 'tabindex' attributes.
function enableElements(...elements) {
  elements.forEach(element => {
    element.removeAttribute('aria-hidden');
    element.querySelectorAll('*').forEach(child => {
      child.removeAttribute('tabindex');
    });
  });
}

// Function to disable elements by setting 'aria-hidden' and 'tabindex' attributes.
function disableElements(...elements) {
  elements.forEach(element => {
    element.setAttribute('aria-hidden', 'true');
    element.querySelectorAll('*').forEach(child => {
      child.setAttribute('tabindex', '-1');
    });
  });
}



// Event listener for form submission.
// This checks the honeypot field and prevents form submission if it contains a value.
document.getElementById('my_form').addEventListener('submit', (event) => {
  if (inconspicuousField.value !== '') {
    event.preventDefault();
  }
});



// When the page loads, add fullscreen view functionality to all buttons and the existing gallery images.
window.onload = function() {
  addFullScreenView();

  hamburgerButton.addEventListener('click', openNav);
  loadMoreButton.addEventListener('click', addImages);
  navAboutMe.addEventListener('click', () => redirectToSection('about_me'));
  navGallery.addEventListener('click', () => redirectToSection('gallery'));
  navPricing.addEventListener('click', () => redirectToSection('pricing'));
  navContact.addEventListener('click', () => redirectToSection('contact'));
  buttonBackToTop.addEventListener('click', () => redirectToSection('top'));
  navInstagram.addEventListener('click', function() {
    window.location.href='https://www.instagram.com/laraa__photography/';
  });
}