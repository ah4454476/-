document.addEventListener("DOMContentLoaded", () => {
    // 1. Auto-update Footer Copyright Year
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Fetch Posts Data and Initialize UI
    fetch('data/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load posts data.");
            }
            return response.json();
        })
        .then(posts => {
            initNavbarCategories(posts);
            initSidebarCategories(posts);
            initSearchFunctionality();
            
            const path = window.location.pathname;
            
            if (path.includes("post.html")) {
                renderSinglePost(posts);
            } else if (path.includes("category.html")) {
                renderCategoryPage(posts);
            } else {
                renderHomePage(posts);
            }
        })
        .catch(error => {
            console.error("Error loading posts:", error);
        });
});

// Populate Navbar Dropdown Categories
function initNavbarCategories(posts) {
    const navCategoriesList = document.getElementById("nav-categories");
    if (!navCategoriesList) return;

    let allCategories = [];
    posts.forEach(post => {
        if (Array.isArray(post.categories)) {
            allCategories.push(...post.categories);
        } else if (post.category) {
            allCategories.push(post.category);
        }
    });

    const uniqueCategories = [...new Set(allCategories)];
    let html = '';
    uniqueCategories.forEach(cat => {
        html += `<li><a class="dropdown-item" href="category.html?cat=${encodeURIComponent(cat)}">${cat}</a></li>`;
    });
    navCategoriesList.innerHTML = html;
}

// Populate Sidebar Categories List with Count
function initSidebarCategories(posts) {
    const sidebarCatList = document.getElementById("sidebar-categories-list");
    if (!sidebarCatList) return;

    let allCategories = [];
    posts.forEach(post => {
        if (Array.isArray(post.categories)) {
            allCategories.push(...post.categories);
        } else if (post.category) {
            allCategories.push(post.category);
        }
    });

    const categoryCounts = {};
    allCategories.forEach(cat => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    let catListHTML = '';
    for (const [cat, count] of Object.entries(categoryCounts)) {
        catListHTML += `
            <li>
                <a href="category.html?cat=${encodeURIComponent(cat)}" class="d-flex justify-content-between align-items-center">
                    <span>${cat}</span>
                    <span class="badge bg-secondary rounded-pill">${count}</span>
                </a>
            </li>`;
    }
    sidebarCatList.innerHTML = catListHTML;
}

// Search Bar Functionality
function initSearchFunctionality() {
    const searchBtn = document.getElementById("sidebar-search-btn");
    const searchInput = document.getElementById("sidebar-search-input");

    if (!searchBtn || !searchInput) return;

    const performSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `category.html?search=${encodeURIComponent(query)}`;
        }
    };

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") performSearch();
    });
}

// Render Home Page Sections (New, Popular by Views, Random)
function renderHomePage(posts) {
    const sortedPosts = [...posts].sort((a, b) => b.id - a.id);
    
    // 1. New Posts
    const newPostsContainer = document.getElementById("new-posts-container");
    if (newPostsContainer) {
        let html = '';
        sortedPosts.slice(0, 6).forEach(post => {
            html += createPostCardHTML(post);
        });
        newPostsContainer.innerHTML = html;
    }

    // 2. Popular Posts (Automatic Traffic Views Based)
    const popularPostsContainer = document.getElementById("popular-posts-container");
    if (popularPostsContainer) {
        const trafficSorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
        let html = '';
        trafficSorted.slice(0, 4).forEach(post => {
            html += createPostCardHTML(post);
        });
        popularPostsContainer.innerHTML = html;
    }

    // 3. Random Posts
    const randomPostsContainer = document.getElementById("random-posts-container");
    if (randomPostsContainer) {
        const shuffled = [...posts].sort(() => 0.5 - Math.random());
        let html = '';
        shuffled.slice(0, 4).forEach(post => {
            html += createPostCardHTML(post);
        });
        randomPostsContainer.innerHTML = html;
    }
}

// Render Category & Search Results Page
function renderCategoryPage(posts) {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('cat');
    const searchQuery = urlParams.get('search');
    
    const categoryTitleEl = document.getElementById("category-title");
    const categoryPostsContainer = document.getElementById("category-posts-container");

    let filteredPosts = [];

    if (searchQuery) {
        if (categoryTitleEl) categoryTitleEl.textContent = `Search Results for: "${searchQuery}"`;
        const q = searchQuery.toLowerCase();
        filteredPosts = posts.filter(p => 
            p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
        );
    } else if (categoryName) {
        if (categoryTitleEl) categoryTitleEl.textContent = `Category: ${categoryName}`;
        filteredPosts = posts.filter(p => {
            if (Array.isArray(p.categories)) {
                return p.categories.some(c => c.toLowerCase() === categoryName.toLowerCase());
            } else if (p.category) {
                return p.category.toLowerCase() === categoryName.toLowerCase();
            }
            return false;
        });
    } else {
        if (categoryTitleEl) categoryTitleEl.textContent = "All Posts";
        filteredPosts = posts;
    }

    if (categoryPostsContainer) {
        let html = '';
        if (filteredPosts.length > 0) {
            filteredPosts.forEach(post => {
                html += createPostCardHTML(post);
            });
        } else {
            html = `<div class="col-12"><p class="alert alert-warning">No posts found matching your criteria.</p></div>`;
        }
        categoryPostsContainer.innerHTML = html;
    }
}

// Render Single Post Page & WhatsApp Open Graph Thumbnails
function renderSinglePost(posts) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = parseInt(urlParams.get('id'));

    const post = posts.find(p => p.id === postId);
    const postContainer = document.getElementById("single-post-container");

    if (!postContainer) return;

    if (post) {
        document.title = `${post.title} - Static Blog`;
        setOpenGraphMeta(post);

        const cats = Array.isArray(post.categories) ? post.categories.join(', ') : (post.category || '');

        postContainer.innerHTML = `
            <article class="bg-white p-4 p-md-5 rounded shadow-sm card-custom">
                <span class="badge badge-maroon mb-2">${cats}</span>
                <h1 class="fw-bold mb-3" style="color: #800000;">${post.title}</h1>
                <p class="text-muted small mb-4">Published on: ${post.date} | Views: ${post.views || 0}</p>
                <hr class="mb-4">
                <div class="post-content lh-lg">
                    ${post.content}
                </div>
            </article>
        `;
    } else {
        postContainer.innerHTML = `<div class="alert alert-danger">Post not found. <a href="index.html">Return to Home</a></div>`;
    }
}

// WhatsApp Thumbnail Open Graph Generator
function setOpenGraphMeta(post) {
    const head = document.head;
    let thumb = post.image || '';
    if (!thumb) {
        const div = document.createElement('div');
        div.innerHTML = post.content;
        const img = div.querySelector('img');
        if (img) thumb = img.src;
    }

    const metas = [
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.title + ' - Read complete details on our blog.' },
        { property: 'og:image', content: thumb },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'article' }
    ];

    metas.forEach(m => {
        let tag = document.querySelector(`meta[property='${m.property}']`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', m.property);
            head.appendChild(tag);
        }
        tag.setAttribute('content', m.content);
    });
}

// Reusable Post Card HTML Generator with Thumbnail Image Support
function createPostCardHTML(post) {
    const cats = Array.isArray(post.categories) ? post.categories.join(', ') : (post.category || '');
    
    // Extract thumbnail image from JSON 'image' property or fallback to first image in content
    let thumb = post.image || '';
    if (!thumb) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const imgTag = tempDiv.querySelector('img');
        if (imgTag) thumb = imgTag.src;
    }

    const imageHTML = thumb ? `<img src="${thumb}" class="card-img-top" alt="${post.title}" style="height: 180px; object-fit: cover;">` : '';

    return `
        <div class="col-md-6 mb-4">
            <div class="card h-100 card-custom">
                ${imageHTML}
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <span class="badge badge-maroon">${cats}</span>
                        <small class="text-muted float-end">${post.date}</small>
                    </div>
                    <h5 class="card-title fw-bold">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h5>
                    <p class="card-text text-muted small mt-2">Click below to read the complete article, view images, and explore custom blocks...</p>
                    <div class="mt-auto pt-3">
                        <a href="post.html?id=${post.id}" class="btn btn-sm btn-maroon w-100">Read More</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}
