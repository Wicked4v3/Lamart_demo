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
const loadMoreButton = document.getElementById("button_load_more");

var prevScrollPos = window.pageYOffset;
var prevFocusedElement = document.activeElement;


let numLoadedImages = 12;
const imagesPerLoad = 12;


const form = document.getElementById('myForm');
const endpointUrl = 'https://formsubmit.co';
const emailAddress = 'vanaquvojoba@rungel.net';
const encodedEmail = btoa(emailAddress);
form.action = `${endpointUrl}/${encodedEmail}`;


const imageDescriptions = [
  { number: "13", description: "Sett inn et bildebeskrivelse" },
  { number: "14", description: "Sett inn et bildebeskrivelse" },
  { number: "15", description: "Sett inn et bildebeskrivelse" },
  { number: "16", description: "Sett inn et bildebeskrivelse" },
  { number: "17", description: "Sett inn et bildebeskrivelse" },
  { number: "18", description: "Sett inn et bildebeskrivelse" },
  { number: "19", description: "Sett inn et bildebeskrivelse" },
  { number: "20", description: "Sett inn et bildebeskrivelse" },
  { number: "21", description: "Sett inn et bildebeskrivelse" },
  { number: "22", description: "Sett inn et bildebeskrivelse" },
  { number: "23", description: "Sett inn et bildebeskrivelse" },
  { number: "24", description: "Sett inn et bildebeskrivelse" },
];



/* When the user scrolls down, hide the navbar. When the user scrolls up, show the navbar */
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollPos > currentScrollPos || currentScrollPos < 100) {
    navbar.style.top = "0";
  } else {
    navbar.style.top = "-100px";
  }
  prevScrollPos = currentScrollPos;
};



const fullscreenImage = document.querySelector('#fullscreen_image');
/*When the user clicks on an image, view it in fullscreen. When the user clicks anywhere on the screen, exit the fullscreen view
Has to be re-run when new images are added to the galery
*/
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



/*Open/close the hamburger menu*/
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

document.querySelectorAll('.menu_link').forEach(item => {
  item.addEventListener('click', event => {
    closeNav();
  })
});



// Define a function to create a new image and overlay element
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

  // Set focus on the first of the newly added images
  const listItems = gallerySection.querySelectorAll('li');
  listItems[numLoadedImages].setAttribute('tabindex', '-1');
  listItems[numLoadedImages].focus();
  listItems[numLoadedImages].removeAttribute('tabindex');

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



form.addEventListener('submit', function(event) {
  fetch(event.target.action, {
    method: 'POST',
    body: new FormData(form)
  })
  .then(response => {
    // handle the response
    if (response.ok) {
      // reset the form
      form.reset();
    } else {
      throw new Error('Beklager, noe gikk galt... Vennligst send epost til laura.matiukaite2@gmail.com');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
});


window.onload = addFullScreenView;