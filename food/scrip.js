let parsedPosts = [];

document.addEventListener("DOMContentLoaded", async function() {
    // 1. Automatic Year Update
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Load Data from Post HTML Files
    await loadAllPostsData();

    // 3. Render Dynamic Categories
    renderSidebarCategories();

    // 4. Render Home or Category Page Content
    if (document.getElementById("recent-posts-container")) {
        renderHomePosts();
    }
    if (document.getElementById("category-posts-container")) {
        renderCategoryPosts();
    }
});

async function loadAllPostsData() {
    parsedPosts = [];
    // Duplicate URL Removal
    const uniquePosts = [...new Set(blogPosts)];

    for (let url of uniquePosts) {
        try {
            let response = await fetch(url);
            if (!response.ok) continue;

            let htmlText = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlText, 'text/html');

            let title = doc.querySelector('title') ? doc.querySelector('title').innerText.split('-')[0].trim() : "Blog Post";
            let rawCategory = doc.querySelector('meta[name="post-category"]') ? doc.querySelector('meta[name="post-category"]').content : "Recipes";
            let image = doc.querySelector('meta[name="post-image"]') ? doc.querySelector('meta[name="post-image"]').content : "https://via.placeholder.com/300x200";
            let snippet = doc.querySelector('meta[name="post-snippet"]') ? doc.querySelector('meta[name="post-snippet"]').content : "Click below to view full details...";

            // Clean up categories (split by commas if multiple)
            let categories = rawCategory.split(',').map(c => c.trim()).filter(c => c.length > 0);

            parsedPosts.push({
                url: url,
                title: title,
                categories: categories.length > 0 ? categories : ["Recipes"],
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
        post.categories.forEach(cat => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
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
        let firstCategory = post.categories[0];
        recentHtml += `
            <div class="card mb-4">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${post.image}" class="img-fluid rounded-start h-100 object-fit-cover" alt="${post.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <a href="category.html?cat=${encodeURIComponent(firstCategory)}" class="badge badge-category mb-2">${firstCategory}</a>
                            <h3 class="card-title h5"><a href="${post.url}">${post.title}</a></h3>
                            <p class="card-text text-muted small">${post.snippet}</p>
                            <a href="${post.url}" class="btn btn-sm btn-primary">Read More</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    if (recentContainer) recentContainer.innerHTML = recentHtml || '<p class="text-muted">No posts found.</p>';

    if (popularContainer) {
        let popularHtml = '';
        let count = 1;
        parsedPosts.slice(0, 5).forEach(post => {
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
        filteredPosts = parsedPosts.filter(p => p.categories.includes(selectedCat));
    } else {
        if (titleElem) titleElem.textContent = "All Categories";
    }

    let html = '';
    if (filteredPosts.length === 0) {
        html = '<div class="col-12"><p class="text-muted">No recipes found in this category.</p></div>';
    } else {
        filteredPosts.forEach(post => {
            let firstCategory = post.categories[0];
            html += `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="${post.image}" class="card-img-top" alt="${post.title}">
                        <div class="card-body d-flex flex-column">
                            <div>
                                <a href="category.html?cat=${encodeURIComponent(firstCategory)}" class="badge badge-category mb-2">${firstCategory}</a>
                                <h3 class="card-title h5"><a href="${post.url}">${post.title}</a></h3>
                                <p class="card-text text-muted small">${post.snippet}</p>
                            </div>
                            <div class="mt-auto pt-3">
                                <a href="${post.url}" class="btn btn-sm btn-primary">Read More</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    if (container) container.innerHTML = html;
}
