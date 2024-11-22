const API_KEY = "055b7317cc9348e2a851fc4576173549";
const url = "https://newsapi.org/v2/everything?q=";

// Jab window load ho toh 
window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    // " fetch" library promise return karti hai jiper hame await karna padega 
    // async function
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    // https://newsapi.org/v2/everything?q=tesla&from=2024-07-04&sortBy=publishedAt&apiKey=3e0532391f25450c914551c1e357a9d0
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    // card ka clone bana bana kar main ke card container me dalte jayenge 
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");
     
    // jab bhi bind data call ho tab pahle card-container ko empty kar do 
    // naho toh jitni bar api call hogi cards ek ke niche ek aate jayenege
    cardsContainer.innerHTML = "";


    articles.forEach((article) => {
        if (!article.urlToImage) return;

        // deep cloning : "newsCardTemplate" wili div me jitne bhi div hai sari kai sari recursively clone ho jani chahiye 
        
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        // "cardsContainer" me sare card dal do 
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});