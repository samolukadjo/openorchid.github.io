(function (exports) {
  "use strict";

  var responseData;
  var news = document.getElementById("news");
  var sources = document.getElementById("sources");
  var allNewsButton = document.getElementById("sidebar-allnews");

  allNewsButton.onclick = () => {
    var selected = document.querySelector('[aria-selected="true"]');
    selected.setAttribute("aria-selected", null);
    allNewsButton.setAttribute("aria-selected", true);
  };

  moment.locale(navigator.language);
  Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [
      this.getFullYear(),
      (mm > 9 ? "" : "0") + mm,
      (dd > 9 ? "" : "0") + dd,
    ].join("");
  };

  var date = new Date();
  var lastMonth =
    date.getFullYear() + "-" + date.getMonth() + "-" + date.getUTCDate();
  console.log("Last month was at " + lastMonth);

  var client = new XMLHttpRequest();
  client.open(
    "GET",
    "https://newsapi.org/v2/everything?q=news&from=" +
      lastMonth +
      "&language=" +
      navigator.language +
      "&sortBy=publishedAt&apiKey=4930e7035f9e4bcca838a594141153f9"
  );
  client.onreadystatechange = function () {
    responseData = JSON.parse(client.responseText);
    console.log(responseData);
    news.innerHTML = "";
    sources.innerHTML = "";
    responseData.articles.forEach(function (data, index) {
      createCard(data);
    });
  };
  client.send();

  function setCategory(id, app) {
    if (document.querySelector('[data-category="' + id + '"]')) {
      var container = document.querySelector(
        '[data-category="' + id + '"] > .news-container'
      );
      container.appendChild(app);
    } else {
      var listItem = document.createElement("li");
      sources.appendChild(listItem);

      var link = document.createElement("a");
      link.href = "#category-" + id;
      link.textContent = id;
      link.dataset.icon = "tree";
      link.onclick = () => {
        var selected = document.querySelector('[aria-selected="true"]');
        selected.setAttribute("aria-selected", null);
        link.setAttribute("aria-selected", true);
      };
      listItem.appendChild(link);

      var element = document.createElement("div");
      element.id = "category-" + id;
      element.dataset.category = id;
      element.classList.add("news-group");
      news.appendChild(element);

      document.addEventListener("wheel", () => {
        if (
          element.getBoundingClientRect().top <=
          window.innerHeight - (element.getBoundingClientRect().height - 1)
        ) {
          var selected = document.querySelector('[aria-selected="true"]');
          selected.setAttribute("aria-selected", null);
          link.setAttribute("aria-selected", true);
        }
      });
      document.addEventListener("touchmove", () => {
        if (
          element.getBoundingClientRect().top <=
          window.innerHeight - (element.getBoundingClientRect().height - 1)
        ) {
          var selected = document.querySelector('[aria-selected="true"]');
          selected.setAttribute("aria-selected", null);
          link.setAttribute("aria-selected", true);
        }
      });

      var header = document.createElement("header");
      element.appendChild(header);

      var title = document.createElement("h1");
      title.textContent = id;
      header.appendChild(title);

      var expandButton = document.createElement("a");
      expandButton.href = "#";
      expandButton.dataset.icon = "expand-chevron";
      expandButton.dataset.l10nId = "show-more";
      expandButton.onclick = (evt) => {
        evt.preventDefault();
        element.classList.toggle("expanded");
        if (element.classList.contains("expanded")) {
          expandButton.dataset.icon = "collapse-chevron";
          expandButton.dataset.l10nId = "show-less";
        } else {
          expandButton.dataset.icon = "expand-chevron";
          expandButton.dataset.l10nId = "show-more";
        }
      };
      header.appendChild(expandButton);

      var container = document.createElement("div");
      container.classList.add("news-container");
      element.appendChild(container);

      container.appendChild(app);
    }
  }

  function createCard(data) {
    var element = document.createElement("li");
    var image = document.createElement("img");
    var textHolder = document.createElement("div");
    var timestamp = document.createElement("span");
    var title = document.createElement("h1");
    var author = document.createElement("span");
    var source = document.createElement("p");

    element.onclick = function () {
      openInfo(data);
    };
    element.classList.add("news-card");
    setCategory(data.source.name, element);

    image.src = data.urlToImage;
    image.loading = "lazy";
    element.appendChild(image);

    element.appendChild(textHolder);

    var dateString = new Date(data.publishedAt).yyyymmdd();

    timestamp.textContent = moment(dateString, "YYYYMMDD").fromNow();
    timestamp.classList.add("date");
    textHolder.appendChild(timestamp);

    title.textContent = data.title;
    title.classList.add("title");
    textHolder.appendChild(title);

    author.textContent = data.author;
    author.classList.add("author");
    textHolder.appendChild(author);

    source.textContent = data.source.name;
    source.classList.add("source");
    textHolder.appendChild(source);
  }

  var data = {};
  var header = document.getElementById("header");
  var searchbox = document.getElementById("searchbox");
  var searchboxInput = document.getElementById("searchbox-input");
  var newsContainer = document.getElementById("widgets-news");

  searchbox.addEventListener("submit", function (evt) {
    evt.preventDefault();

    var newsList = newsContainer.querySelectorAll("li");
    newsList.forEach(function (item) {
      if (searchboxInput.value !== "") {
        if (searchboxInput.value.test(item.innerText)) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      } else {
        item.style.display = "";
      }
    });
  });

  function openInfo(data) {
    var sidebar = document.getElementById("sidebar");
    var toggleSidebarButton = document.getElementById("toggle-sidebar-button");
    var backButton = document.getElementById("back-button");
    var content = document.getElementById("content");
    var article = document.getElementById("news-article");
    var articleBanner = document.getElementById("news-article-banner");
    var articleTitle = document.getElementById("news-article-title");
    var articleSummary = document.getElementById("news-article-summary");
    var articleContent = document.getElementById("news-article-content");
    var articleLink = document.getElementById("news-article-link");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    article.classList.add("visible");
    sidebar.style.display = "none";
    toggleSidebarButton.style.display = "none";
    backButton.style.display = "block";
    content.style.display = "none";

    backButton.onclick = () => {
      article.classList.remove("visible");
      sidebar.style.display = "block";
      toggleSidebarButton.style.display = "block";
      backButton.style.display = "none";
      content.style.display = "block";
    };

    articleBanner.src = data.urlToImage;
    articleTitle.textContent = data.title;
    articleSummary.textContent = data.description;
    articleContent.innerHTML = data.content;
    articleLink.href = data.url;
  }
})(window);
