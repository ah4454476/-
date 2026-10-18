document.addEventListener("DOMContentLoaded", function() {
    // 1. Automatic Year Update
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Render Sidebar Categories
    renderSidebarCategories();

    // 3. Render Home or Category Page Content
    if (document.getElementById("recent-posts-container")) {
        renderHomePosts();
    }
    if (document.getElementById("category-posts-container")) {
        renderCategoryPosts();
    }
});

function renderSidebarCategories() {
    const categoryContainers = document.querySelectorAll(".dynamic-categories");
    if (categoryContainers.length === 0) return;

    let categoryCounts = {};
    blogPosts.forEach(post => {
        let cats = post.category.split(',').map(c => c.trim());
        cats.forEach(cat => {
            if (cat) {
                categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
            }
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
    blogPosts.forEach(post => {
        let firstCategory = post.category.split(',')[0].trim();
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
        blogPosts.slice(0, 5).forEach(post => {
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

    let filteredPosts = blogPosts;
    if (selectedCat) {
        if (titleElem) titleElem.textContent = selectedCat;
        filteredPosts = blogPosts.filter(p => p.category.split(',').map(c => c.trim()).includes(selectedCat));
    } else {
        if (titleElem) titleElem.textContent = "All Categories";
    }

    let html = '';
    if (filteredPosts.length === 0) {
        html = '<div class="col-12"><p class="text-muted">No recipes found in this category.</p></div>';
    } else {
        filteredPosts.forEach(post => {
            let firstCategory = post.category.split(',')[0].trim();
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
