let parsedPosts = [];

document.addEventListener("DOMContentLoaded", async function() {
    // 1. آٹومیٹک سال اپ ڈیٹ کرنا
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. ایچ ٹی ایم ایل فائلوں سے ڈیٹا لوڈ کرنا
    await loadAllPostsData();

    // 3. سائیڈ بار کیٹگریز رینڈر کرنا
    renderSidebarCategories();

    // 4. ہوم پیج یا کیٹگری پیج کے مطابق رینڈرنگ
    if (document.getElementById("recent-posts-container")) {
        renderHomePosts();
    }
    if (document.getElementById("category-posts-container")) {
        renderCategoryPosts();
    }
});

async function loadAllPostsData() {
    parsedPosts = [];
    for (let url of blogPosts) {
        try {
            let response = await fetch(url);
            let htmlText = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlText, 'text/html');

            let title = doc.querySelector('title') ? doc.querySelector('title').innerText.split('-')[0].trim() : "بلاگ پوسٹ";
            let category = doc.querySelector('meta[name="post-category"]') ? doc.querySelector('meta[name="post-category"]').content : "عام";
            let image = doc.querySelector('meta[name="post-image"]') ? doc.querySelector('meta[name="post-image"]').content : "https://via.placeholder.com/300x200";
            let snippet = doc.querySelector('meta[name="post-snippet"]') ? doc.querySelector('meta[name="post-snippet"]').content : "تفصیلات کے لیے پوسٹ دیکھیں...";

            parsedPosts.push({
                url: url,
                title: title,
                category: category,
                image: image,
                snippet: snippet
            });
        } catch (e) {
            console.error("Error loading post:", url, e);
        }
    }
}

function renderSidebarCategories() {
    const categoryContainers = document.querySelectorAll(".dynamic-categories");
    if (categoryContainers.length === 0) return;

    let categoryCounts = {};
    parsedPosts.forEach(post => {
        categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
    });

    let html = '';
    for (let cat in categoryCounts) {
        html += `
            <a href="category.html?cat=${encodeURIComponent(cat)}" class="btn btn-outline-dark text-start d-flex justify-content-between align-items-center mb-2">
                <span>${cat}</span> <span class="badge bg-secondary">${categoryCounts[cat]}</span>
            </a>
        `;
    }
    categoryContainers.forEach(container => container.innerHTML = html);
}

function renderHomePosts() {
    const recentContainer = document.getElementById("recent-posts-container");
    const popularContainer = document.getElementById("popular-posts-container");

    let recentHtml = '';
    parsedPosts.forEach(post => {
        recentHtml += `
            <div class="card mb-4">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${post.image}" class="img-fluid rounded-start h-100 object-fit-cover" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <a href="category.html?cat=${encodeURIComponent(post.category)}" class="badge badge-category mb-2">${post.category}</a>
                            <h3 class="card-title h5"><a href="${post.url}">${post.title}</a></h3>
                            <p class="card-text text-muted small">${post.snippet}</p>
                            <a href="${post.url}" class="btn btn-sm btn-primary">مزید پڑھیں</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    if (recentContainer) recentContainer.innerHTML = recentHtml;

    if (popularContainer) {
        let popularHtml = '';
        let count = 1;
        parsedPosts.forEach(post => {
            popularHtml += `
                <li class="mb-3 pb-2 border-bottom">
                    <a href="${post.url}" class="text-dark text-decoration-none fw-semibold">${count}. ${post.title}</a>
                </li>
            `;
            count++;
        });
        popularContainer.innerHTML = popularHtml;
    }
}

function renderCategoryPosts() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCat = urlParams.get("cat");
    const titleElem = document.getElementById("category-title");
    const container = document.getElementById("category-posts-container");

    let filteredPosts = parsedPosts;
    if (selectedCat) {
        if (titleElem) titleElem.textContent = selectedCat;
        filteredPosts = parsedPosts.filter(p => p.category === selectedCat);
    } else {
        if (titleElem) titleElem.textContent = "تمام کیٹگریز";
    }

    let html = '';
    filteredPosts.forEach(post => {
        html += `
            <div class="col-md-6 mb-4">
                <div class="card h-100">
                    <img src="${post.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <span class="badge badge-category mb-2">${post.category}</span>
                        <h3 class="card-title h5"><a href="${post.url}">${post.title}</a></h3>
                        <p class="card-text text-muted small">${post.snippet}</p>
                        <a href="${post.url}" class="btn btn-sm btn-primary">پڑھیں</a>
                    </div>
                </div>
            </div>
        `;
    });
    if (container) container.innerHTML = html;
}
