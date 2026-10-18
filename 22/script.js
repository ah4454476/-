// Auto current year for footer
document.addEventListener('DOMContentLoaded', () => {
    const yearElem = document.getElementById('current-year');
    if (yearElem) {
        yearElem.innerText = new Date().getFullYear();
    }
});

let allPostsData = [];

// Robust metadata parsing (Supports HTML tags & Frontmatter/Markdown)
function parsePostMeta(text, fileName) {
    let title = "Untitled";
    let category = "General";
    let description = "";
    let date = "";

    // 1. Try extracting from HTML Tags (<title>, <category>, <meta name="description">)
    const titleTagMatch = text.match(/<title>([^<]+)<\/title>/i);
    if (titleTagMatch) title = titleTagMatch[1].trim();

    const categoryTagMatch = text.match(/<category>([^<]+)<\/category>/i);
    if (categoryTagMatch) category = categoryTagMatch[1].trim();

    const descTagMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    if (descTagMatch) description = descTagMatch[1].trim();

    // 2. Try Markdown/YAML or key-value style meta
    if (title === "Untitled") {
        const titleMatch = text.match(/title:\s*["']?([^"'\n]+)["']?/i);
        if (titleMatch) title = titleMatch[1].trim();
    }

    if (category === "General") {
        const catMatch = text.match(/category:\s*["']?([^"'\n]+)["']?/i);
        if (catMatch) category = catMatch[1].trim();
    }

    if (!description) {
        const descMatch = text.match(/description:\s*["']?([^"'\n]+)["']?/i);
        if (descMatch) description = descMatch[1].trim();
    }

    const dateMatch = text.match(/date:\s*["']?([^"'\n]+)["']?/i);
    if (dateMatch) date = dateMatch[1].trim();

    try {
        const parts = text.split('---');
        if (parts.length >= 3) {
            const meta = jsyaml.load(parts[1]);
            if (meta) {
                if (meta.title) title = meta.title;
                if (meta.category) category = meta.category;
                if (meta.description) description = meta.description;
                if (meta.date) date = meta.date;
            }
        }
    } catch (e) {}

    let catArray = category ? category.split(',').map(c => c.trim()) : ['General'];
    
    // Check for Markdown image format ![alt](url) OR HTML image format <img src="url">
    let imageUrl = '';
    let mdImgMatch = text.match(/!\[.*?\]\((.*?)\)/);
    let htmlImgMatch = text.match(/<img[^>]+src=["']([^"']+)["']/i);

    if (mdImgMatch) {
        imageUrl = mdImgMatch[1];
    } else if (htmlImgMatch) {
        imageUrl = htmlImgMatch[1];
    }

    return {
        fileName: fileName,
        title: title,
        categories: catArray,
        categoryStr: category,
        description: description,
        image: imageUrl,
        date: date
    };
}

// Logic for Home Page (index.html)
async function loadLocalPosts() {
    const postsContainer = document.getElementById('posts-container');
    const categoriesList = document.getElementById('categories-list');
    if (!postsContainer) return;

    postsContainer.innerHTML = '';
    let categories = new Set();
    allPostsData = [];

    if (typeof markdownFiles !== 'undefined') {
        for (let fileName of markdownFiles) {
            try {
                const res = await fetch(fileName);
                if (!res.ok) continue;
                const text = await res.text();
                
                const postInfo = parsePostMeta(text, fileName);
                postInfo.categories.forEach(c => categories.add(c));
                allPostsData.push(postInfo);
            } catch (err) { console.error(err); }
        }
    }

    renderPosts(allPostsData);

    if (categoriesList) {
        categoriesList.innerHTML = `<a href="index.html" class="btn btn-sm btn-outline-secondary m-1">All Posts</a>`;
        categories.forEach(cat => {
            categoriesList.innerHTML += `<a href="category.html?cat=${encodeURIComponent(cat)}" class="btn btn-sm btn-outline-dark m-1" style="border-color: #500000; color: #500000;">${cat}</a>`;
        });
    }
}

function renderPosts(posts) {
    const postsContainer = document.getElementById('posts-container');
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.length === 0 ? '<p class="text-muted">No posts found.</p>' : '';
    posts.forEach(post => {
        const catBadges = post.categories.map(cat => `<a href="category.html?cat=${encodeURIComponent(cat)}" class="badge bg-secondary text-decoration-none me-1 mb-1">${cat}</a>`).join('');
        let imgHtml = post.image ? `<a href="post.html?file=${post.fileName}"><img src="${post.image}" alt="${post.title}" class="post-thumb"></a>` : '';

        postsContainer.innerHTML += `
            <div class="post-card">
                ${imgHtml}
                <h4 class="h5 mb-2"><a href="post.html?file=${post.fileName}" class="text-decoration-none" style="color: #500000;">${post.title}</a></h4>
                <div class="mb-2">${catBadges}</div>
                <p class="text-muted small mb-2">${post.description}</p>
                ${post.date ? `<small class="text-muted d-block" style="font-size: 11px;">${post.date}</small>` : ''}
            </div>
        `;
    });
}

function searchPosts() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const query = searchInput.value.toLowerCase();
    const filtered = allPostsData.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.categories.some(c => c.toLowerCase().includes(query)));
    renderPosts(filtered);
}

// Logic for Category View (category.html)
async function loadCategoryPosts() {
    const postsContainer = document.getElementById('posts-container');
    const categoriesList = document.getElementById('categories-list');
    const titleElement = document.getElementById('category-title');
    if (!postsContainer || !titleElement) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('cat');

    if (!selectedCategory) {
        titleElement.innerText = "No category selected!";
        postsContainer.innerHTML = '<p class="text-danger">Please select a category.</p>';
        return;
    }

    titleElement.innerText = `Category: ${selectedCategory}`;
    postsContainer.innerHTML = '';
    let categories = new Set();
    let found = false;

    if (typeof markdownFiles !== 'undefined') {
        for (let fileName of markdownFiles) {
            try {
                const res = await fetch(fileName);
                const text = await res.text();
                const postInfo = parsePostMeta(text, fileName);
                
                postInfo.categories.forEach(c => categories.add(c));

                if (postInfo.categories.map(c => c.toLowerCase()).includes(selectedCategory.trim().toLowerCase())) {
                    found = true;
                    let imgHtml = postInfo.image ? `<a href="post.html?file=${fileName}"><img src="${postInfo.image}" alt="${postInfo.title}" class="post-thumb"></a>` : '';

                    postsContainer.innerHTML += `
                        <div class="post-card">
                            ${imgHtml}
                            <h4 class="h5 mb-2"><a href="post.html?file=${fileName}" class="text-decoration-none" style="color:#500000;">${postInfo.title}</a></h4>
                            <span class="badge bg-secondary mb-2">${postInfo.categoryStr}</span>
                            <p class="text-muted small mb-2">${postInfo.description || ''}</p>
                            ${postInfo.date ? `<small class="text-muted d-block" style="font-size: 11px;">${postInfo.date}</small>` : ''}
                        </div>
                    `;
                }
            } catch (e) {}
        }
    }

    if (!found) postsContainer.innerHTML = '<p class="text-muted">No posts found in this category.</p>';

    if (categoriesList) {
        categoriesList.innerHTML = `<a href="index.html" class="btn btn-sm btn-outline-secondary m-1">All Posts</a>`;
        categories.forEach(cat => {
            categoriesList.innerHTML += `<a href="category.html?cat=${encodeURIComponent(cat)}" class="btn btn-sm btn-outline-dark m-1" style="border-color: #500000; color: #500000;">${cat}</a>`;
        });
    }
}

// Logic for Single Post View (post.html)
async function loadSinglePost() {
    const contentElem = document.getElementById('content');
    const categoriesList = document.getElementById('categories-list');
    if (!contentElem) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    let categories = new Set();
    if (typeof markdownFiles !== 'undefined' && categoriesList) {
        for (let file of markdownFiles) {
            try {
                const res = await fetch(file);
                const text = await res.text();
                const postInfo = parsePostMeta(text, file);
                postInfo.categories.forEach(c => categories.add(c));
            } catch (e) {}
        }
        categoriesList.innerHTML = `<a href="index.html" class="btn btn-sm btn-outline-secondary m-1">All Posts</a>`;
        categories.forEach(cat => {
            categoriesList.innerHTML += `<a href="category.html?cat=${encodeURIComponent(cat)}" class="btn btn-sm btn-outline-dark m-1" style="border-color: #500000; color: #500000;">${cat}</a>`;
        });
    }

    if (fileName) {
        fetch(fileName)
            .then(res => res.text())
            .then(text => {
                const parts = text.split('---');
                let bodyText = parts.length >= 3 ? parts.slice(2).join('---') : text;

                // Clean header HTML tags if pure HTML post
                bodyText = bodyText
                    .replace(/<title>.*?<\/title>/gi, '')
                    .replace(/<category>.*?<\/category>/gi, '')
                    .replace(/<meta[^>]*>/gi, '');

                const postInfo = parsePostMeta(text, fileName);
                
                // --- WhatsApp & Open Graph Meta Tags Update ---
                document.getElementById('meta-title').innerText = postInfo.title;
                const ogTitle = document.getElementById('og-title');
                if (ogTitle) ogTitle.content = postInfo.title;
                
                const ogDesc = document.getElementById('og-desc');
                if (ogDesc) ogDesc.content = postInfo.description || "Check out this recipe on My Blog";
                
                if (postInfo.image) {
                    const absoluteImgUrl = new URL(postInfo.image, window.location.origin).href;
                    const ogImage = document.getElementById('og-image');
                    if (ogImage) ogImage.content = absoluteImgUrl;
                }
                const ogUrl = document.getElementById('og-url');
                if (ogUrl) ogUrl.content = window.location.href;
                // ---------------------------------------------------

                let catBadges = postInfo.categories.map(c => `<span class="badge bg-secondary me-1">${c}</span>`).join('');
                let titleHtml = `<h1 class="h3 theme-heading">${postInfo.title}</h1>
                    <div class="mb-2">${catBadges} ${postInfo.date ? `<span class="text-muted small ms-2">| ${postInfo.date}</span>` : ''}</div>
                    ${postInfo.description ? `<p class="text-muted">${postInfo.description}</p>` : ''}<hr>`;
                
                contentElem.innerHTML = titleHtml + (typeof marked !== 'undefined' ? marked.parse(bodyText) : bodyText);
            })
            .catch(() => { contentElem.innerHTML = '<p class="text-danger">Failed to load recipe.</p>'; });
    }
}
