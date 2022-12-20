function initSlideshow() {
  "use strict";

  var slideshowList = [
    {
      background:
        document.dir === "rtl"
          ? "images/keyarts/poster_explore_rtl.png"
          : "images/keyarts/poster_explore.png",
      title: "home-poster1-title",
      detail: "home-poster1-description",
      linkTo: "#",
    },
    {
      background: "images/keyart/orchid_1.1.png",
      title: "home-poster2-title",
      detail: "home-poster2-description",
      linkTo: "#",
    }
  ];

  var progress = 0;
  var isPaused = false;
  var slideshowContainer = document.getElementById("slideshow");
  var slideshowPosters = slideshowContainer.querySelector(".holder");
  var backButton = slideshowContainer.querySelector(".controls .back");
  var forwardButton = slideshowContainer.querySelector(".controls .forward");
  var slideshowDots = slideshowContainer.querySelector(".dots");

  slideshowPosters.innerHTML = "";
  slideshowDots.innerHTML = "";
  slideshowList.forEach((slideshow, index) => {
    var element = document.createElement("div");
    element.classList.add("slideshow");
    if (index == 0) {
      element.classList.add("current");
    }
    slideshowPosters.appendChild(element);

    var background = document.createElement("img");
    window.addEventListener("load", () => {
      setTimeout(() => {
        background.src = slideshow.background;
      }, 250);
    });
    background.onload = () => {
      setTimeout(() => {
        colorPicker(slideshow.background, { colors: 2 }).then((colors) => {
          element.style.setProperty("--color-primary", colors[0]);
          dot.style.setProperty("--color-primary", colors[0]);

          switch (lightOrDark(colors[0])) {
            case "light":
              colorPicker(slideshow.background, {
                colors: 2,
                brightness: 0.25,
              }).then((colors) => {
                element.style.setProperty("--color-secondary", colors[1]);
                dot.style.setProperty("--color-secondary", colors[1]);
              });
              break;

            case "dark":
              colorPicker(slideshow.background, {
                colors: 2,
                brightness: 1.75,
              }).then((colors) => {
                element.style.setProperty("--color-secondary", colors[1]);
                dot.style.setProperty("--color-secondary", colors[1]);
              });
              break;
          }
        });
      }, 250);
    };
    element.appendChild(background);

    var context = document.createElement("div");
    element.appendChild(context);

    if (slideshow.wordmark) {
      var wordmark = document.createElement("img");
      wordmark.src = slideshow.wordmark;
      context.appendChild(wordmark);
    }

    if (slideshow.title) {
      var title = document.createElement("h1");
      title.dataset.l10nId = slideshow.title;
      context.appendChild(title);
    }

    if (slideshow.detail) {
      var detail = document.createElement("p");
      detail.dataset.l10nId = slideshow.detail;
      context.appendChild(detail);
    }

    if (slideshow.linkTo) {
      var link = document.createElement("a");
      link.href = slideshow.linkTo;
      link.target = "_blank";
      context.appendChild(link);

      var linkText = document.createElement("span");
      if (slideshow.linkText) {
        linkText.dataset.l10nId = slideshow.linkText;
      } else {
        linkText.dataset.l10nId = "learn-more";
      }
      link.appendChild(linkText);
    }

    var dot = document.createElement("div");
    dot.classList.add("dot");
    dot.addEventListener("click", () => {
      var selectedSlideshow =
        slideshowPosters.querySelector(".slideshow.current");
      if (selectedSlideshow) {
        selectedSlideshow.classList.remove("current");
      }

      var selectedDot = slideshowDots.querySelector(".dot.active");
      if (selectedDot) {
        selectedDot.classList.remove("active");
      }

      element.classList.add("current");
      element.classList.remove("previous");
      element.classList.remove("next");
      dot.classList.add("active");
    });
    if (index == 0) {
      dot.classList.add("active");
    }
    slideshowDots.appendChild(dot);
  });

  setInterval(() => {
    progress = 0;
    if (!isPaused) {
      var selectedSlideshow =
        slideshowPosters.querySelector(".slideshow.current");
      if (selectedSlideshow) {
        selectedSlideshow.classList.remove("current");
        selectedSlideshow.classList.add("previous");
      }

      var selectedDot = slideshowDots.querySelector(".dot.active");
      if (selectedDot) {
        selectedDot.classList.remove("active");
      }

      if (selectedSlideshow.nextElementSibling) {
        selectedSlideshow.nextElementSibling.classList.add("current");
        selectedSlideshow.nextElementSibling.classList.remove("previous");
        selectedSlideshow.nextElementSibling.classList.remove("next");

        if (selectedSlideshow.nextElementSibling.nextElementSibling) {
          selectedSlideshow.nextElementSibling.nextElementSibling.classList.remove(
            "previous"
          );
          selectedSlideshow.nextElementSibling.nextElementSibling.classList.add(
            "next"
          );
        } else {
          slideshowPosters.children[0].classList.remove("previous");
          slideshowPosters.children[0].classList.add("next");
        }
      } else {
        slideshowPosters.children[0].classList.add("current");
        slideshowPosters.children[0].classList.remove("previous");
        slideshowPosters.children[0].classList.remove("next");

        if (slideshowPosters.children[1]) {
          slideshowPosters.children[1].classList.remove("previous");
          slideshowPosters.children[1].classList.add("next");
        }
      }

      if (selectedDot.nextElementSibling) {
        selectedDot.nextElementSibling.classList.add("active");
      } else {
        slideshowDots.children[0].classList.add("active");
      }
    }
  }, 4000);

  setInterval(() => {
    progress += 1000 / 120;
    if (!isPaused) {
      var selectedDot = slideshowDots.querySelector(".dot.active");
      if (selectedDot) {
        selectedDot.style.setProperty(
          "--progress",
          (progress / 4000) * 200 + "%"
        );
      }
    }
  }, 1000 / 60);

  backButton.addEventListener("click", () => {
    var selectedSlideshow =
      slideshowPosters.querySelector(".slideshow.current");
    if (selectedSlideshow) {
      selectedSlideshow.classList.remove("current");
      selectedSlideshow.classList.add("next");
    }

    var selectedDot = slideshowDots.querySelector(".dot.active");
    if (selectedDot) {
      selectedDot.classList.remove("active");
    }

    if (selectedSlideshow.previousElementSibling) {
      selectedSlideshow.previousElementSibling.classList.add("current");
      selectedSlideshow.previousElementSibling.classList.remove("previous");
      selectedSlideshow.previousElementSibling.classList.remove("next");

      if (selectedSlideshow.previousElementSibling.previousElementSibling) {
        selectedSlideshow.previousElementSibling.previousElementSibling.classList.add(
          "previous"
        );
        selectedSlideshow.previousElementSibling.previousElementSibling.classList.remove(
          "next"
        );
      } else {
        slideshowPosters.children[
          slideshowPosters.children.length - 1
        ].classList.add("previous");
        slideshowPosters.children[
          slideshowPosters.children.length - 1
        ].classList.remove("next");
      }
    } else {
      slideshowPosters.children[
        slideshowPosters.children.length - 1
      ].classList.add("current");
      slideshowPosters.children[
        slideshowPosters.children.length - 1
      ].classList.remove("previous");
      slideshowPosters.children[
        slideshowPosters.children.length - 1
      ].classList.remove("next");

      if (slideshowPosters.children[slideshowPosters.children.length - 2]) {
        slideshowPosters.children[
          slideshowPosters.children.length - 2
        ].classList.add("previous");
        slideshowPosters.children[
          slideshowPosters.children.length - 2
        ].classList.remove("next");
      }
    }

    if (selectedDot.previousElementSibling) {
      selectedDot.previousElementSibling.classList.add("active");
    } else {
      slideshowDots.children[slideshowDots.children.length - 1].classList.add(
        "active"
      );
    }
  });

  forwardButton.addEventListener("click", () => {
    var selectedSlideshow =
      slideshowPosters.querySelector(".slideshow.current");
    if (selectedSlideshow) {
      selectedSlideshow.classList.remove("current");
      selectedSlideshow.classList.add("previous");
    }

    var selectedDot = slideshowDots.querySelector(".dot.active");
    if (selectedDot) {
      selectedDot.classList.remove("active");
    }

    if (selectedSlideshow.nextElementSibling) {
      selectedSlideshow.nextElementSibling.classList.add("current");
      selectedSlideshow.nextElementSibling.classList.remove("previous");
      selectedSlideshow.nextElementSibling.classList.remove("next");

      if (selectedSlideshow.nextElementSibling.nextElementSibling) {
        selectedSlideshow.nextElementSibling.nextElementSibling.classList.remove(
          "previous"
        );
        selectedSlideshow.nextElementSibling.nextElementSibling.classList.add(
          "next"
        );
      } else {
        slideshowPosters.children[0].classList.remove("previous");
        slideshowPosters.children[0].classList.add("next");
      }
    } else {
      slideshowPosters.children[0].classList.add("current");
      slideshowPosters.children[0].classList.remove("previous");
      slideshowPosters.children[0].classList.remove("next");

      if (slideshowPosters.children[1]) {
        slideshowPosters.children[1].classList.remove("previous");
        slideshowPosters.children[1].classList.add("next");
      }
    }

    if (selectedDot.nextElementSibling) {
      selectedDot.nextElementSibling.classList.add("active");
    } else {
      slideshowDots.children[0].classList.add("active");
    }
  });

  slideshowContainer.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  slideshowContainer.addEventListener("mouseleave", () => {
    isPaused = false;
  });
}
