// navigation bar
function openNav() {
    document.getElementById("mobileMenu").style.width = "250px";
    document.getElementById("logo_img").style.marginLeft = "170px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
    document.getElementById("mobileMenu").style.width = "0";
    document.getElementById("logo_img").style.marginLeft = "0";
    document.body.style.backgroundColor = "#0D0D0D";
}
// home section
document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.getElementById("typing-text");
    const textArray = ["Sudheera Perera","A student", "A Developer", "A Programer"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        let currentText = textArray[textIndex];
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex--);
        } else {
            textElement.textContent = currentText.substring(0, charIndex++);
        }

        if (!isDeleting && charIndex === currentText.length + 1) {
            isDeleting = true;
            setTimeout(typeEffect, 1000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            setTimeout(typeEffect, 500);
        } else {
            setTimeout(typeEffect, isDeleting ? 50 : 100);
        }
    }

    typeEffect();
});

// About me
// Function to switch tabs
function showTab(event, tabId) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    // Remove active class from all tabs
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

     // Show selected tab content
    document.getElementById(tabId).classList.add("active");

    // Highlight active tab
    if (event) {
        event.currentTarget.classList.add("active");
    }
}

// Function to toggle dropdown
function toggleDropdown(event) {
    const dropdownContent = event.currentTarget.nextElementSibling;
    dropdownContent.style.display = dropdownContent.style.display === "flex" ? "none" : "flex";
}

// Animate Circular Progress Bars
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".circle").forEach(circle => {
        let percent = circle.getAttribute("data-percent");
        let degree = (percent / 100) * 360;
            ircle.style.setProperty("--degree", degree + "deg");
    });
});

// About me
// Function to switch tabs
function showTab(event, tabId) {
    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

    // Remove active class from all tabs
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));

     // Show selected tab content
    document.getElementById(tabId).classList.add("active");

    // Highlight active tab
    if (event) {
        event.currentTarget.classList.add("active");
         }
    }

    // Function to toggle dropdown
    function toggleDropdown(event) {
        const dropdownContent = event.currentTarget.nextElementSibling;
        dropdownContent.style.display = dropdownContent.style.display === "flex" ? "none" : "flex";
    }

    // Animate Circular Progress Bars
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".circle").forEach(circle => {
            let percent = circle.getAttribute("data-percent");
            let degree = (percent / 100) * 360;
            circle.style.setProperty("--degree", degree + "deg");
        });
    });


 // Portfolio

document.addEventListener("DOMContentLoaded", () => {
    const projects = document.querySelectorAll(".projects");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    let currentProjectIndex = 0;

    // Show first project initially
    if (projects.length > 0) {
        projects[currentProjectIndex].classList.add("active");
    }

    function showProject(index) {
        projects.forEach((project, i) => {
            project.classList.remove("active");
            if (i === index) project.classList.add("active");
        });
    }

    // Next Project
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentProjectIndex = (currentProjectIndex + 1) % projects.length;
            showProject(currentProjectIndex);
        });
    }

    // Previous Project
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            currentProjectIndex = (currentProjectIndex - 1 + projects.length) % projects.length;
            showProject(currentProjectIndex);
        });
    }

    // Image Hover Effect
    document.querySelectorAll(".media-container").forEach((container) => {
        const video = container.querySelector(".project-video");
        const images = container.querySelectorAll(".project-image");

        if (video && images) {
            container.addEventListener("mousemove", (event) => {
                const { clientX } = event;
                const { left, width } = container.getBoundingClientRect();
                const mouseX = clientX - left;
                const halfWidth = width / 2;

                video.pause(); // Pause video on hover
                images.forEach((img, index) => {
                    if (mouseX < halfWidth) {
                        img.classList.remove("hidden");
                        img.style.opacity = index === 0 ? "1" : "0";
                    } else {
                        img.classList.remove("hidden");
                        img.style.opacity = index === 1 ? "1" : "0";
                    }
                });
            });

            container.addEventListener("mouseleave", () => {
                video.play(); // Resume video on mouse leave
                images.forEach(img => img.classList.add("hidden"));
            });
        }
    });
});

// Contact me
const form = document.getElementById('contact-form');
const responseMessage = document.getElementById('responseMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbztx9oIIMO7g7u26EVbabhkO8nP7TPCOmud5NSgpEsEN55jJ8gvtdA9iCT2jZBbq3A/exec', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      responseMessage.textContent = 'Thank you! Your message has been sent.';
      form.reset();
    } else {
      responseMessage.textContent = 'Error submitting the form. Please try again.';
    }
  } catch (error) {
    responseMessage.textContent = 'An error occurred. Please try again.';
  }
});