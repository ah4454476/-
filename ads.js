(() => {
    "use strict";

    const adsList = [
        {
            url: "https://ah4454476.github.io/parkinsons/",
            title: "Help For Parkinson's Patient",
            desc: "Click here to learn more about Parkinson's Patient and his health details.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Nra9BWFbr_BjL8FBsnZ1m1D1wM1jUT7MDC2x6iWyZQ&s=10"
        },
        {
            url: "https://ah4454476.github.io/usd/",
            title: "PROP US MONEY",
            desc: "Check out details & prices not real US$ Bolls.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo75lu3mN3hiY3muL_wICX5qPQQuDLIjxC8gqGHYJuZA&s=10"
        },
        {
            url: "https://www.youtube.com/",
            title: "Watch Videos on YouTube",
            desc: "Explore trending videos, music, and more online.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGJH3_ZQvwa5B3NQSWzlxJPW_nlS0eTQtv74M7FtxNAQ&s=10"
        },
        {
            url: "https://wa.me/923394454476",
            title: "Place Your Ad Here",
            desc: "Contact here to get your ad ticket.",
            image: "https://cdn.vectorstock.com/i/500p/18/49/place-your-ads-here-seal-with-grunge-style-vector-35811849.jpg"
        },
        {
            url: "https://www.amazon.com/",
            title: "Buy What You Want",
            desc: "Explore online shopping, products, and more.",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-EY-lND57214mCtVG1cSBew0tV54Z_S10MRhgiDFdKA&s=10"
        }
    ];

    const style = document.createElement("style");
    style.textContent = `
        .adsense-banner-wrapper {
            width: 100%;
            max-width: 1000px;
            margin: 20px auto;
            padding: 10px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            background: #f8fafc;
            border: 1px solid #800000;
            border-radius: 8px;
            text-align: center;
        }
        .adsense-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #800000;
            margin-bottom: 6px;
            text-align: right;
            display: block;
        }
        .adsense-scroll-container {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
            -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
            gap: 6px;
            width: 100%;
            box-sizing: border-box;
        }
        .adsense-card {
            -webkit-box-flex: 1;
            -ms-flex: 1 1 0px;
            flex: 1 1 0;
            min-width: 0;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            overflow: hidden;
            box-sizing: border-box;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            text-align: left;
            -webkit-transition: box-shadow 0.2s ease;
            transition: box-shadow 0.2s ease;
        }
        .adsense-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .adsense-card a {
            display: block;
            color: inherit;
            text-decoration: none;
            width: 100%;
            height: 100%;
        }
        .adsense-card img {
            width: 100%;
            height: 90px;
            object-fit: cover;
            border-bottom: 1px solid #e2e8f0;
        }
        .adsense-content {
            padding: 8px;
        }
        .adsense-title {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: #1d4ed8;
            margin-bottom: 3px;
            text-decoration: underline;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .adsense-desc {
            font-size: 10px;
            color: #475569;
            line-height: 1.2;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        @media (max-width: 768px) {
            .adsense-scroll-container {
                gap: 4px;
            }
            .adsense-card img {
                height: 75px;
            }
            .adsense-title {
                font-size: 11px;
            }
            .adsense-desc {
                font-size: 9px;
            }
        }
        @media (max-width: 480px) {
            .adsense-banner-wrapper {
                margin: 10px 2px;
                padding: 6px;
            }
            .adsense-content {
                padding: 6px;
            }
            .adsense-card img {
                height: 65px;
            }
        }
    `;
    document.head.appendChild(style);

    if (window.__adsInitialized) return;
    window.__adsInitialized = true;

    function renderAds() {
        const targetContainer = document.getElementById("ads-banner-container");
        if (!targetContainer) return;

        const wrapper = document.createElement("div");
        wrapper.className = "adsense-banner-wrapper";

        const label = document.createElement("span");
        label.className = "adsense-label";
        label.textContent = "Ads";
        wrapper.appendChild(label);

        const scrollContainer = document.createElement("div");
        scrollContainer.className = "adsense-scroll-container";

        // Ads list ko shuffle karne ke liye logic
        const shuffledAds = [...adsList].sort(() => 0.5 - Math.random());
        const selectedAds = shuffledAds.slice(0, 3);

        selectedAds.forEach(item => {
            const card = document.createElement("div");
            card.className = "adsense-card";

            const link = document.createElement("a");
            link.href = item.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            if (item.image && item.image.trim() !== "") {
                const img = document.createElement("img");
                img.src = item.image;
                img.alt = item.title;
                img.loading = "lazy";
                link.appendChild(img);
            }

            const content = document.createElement("div");
            content.className = "adsense-content";

            const title = document.createElement("span");
            title.className = "adsense-title";
            title.textContent = item.title;

            const desc = document.createElement("div");
            desc.className = "adsense-desc";
            desc.textContent = item.desc;

            content.append(title, desc);
            link.appendChild(content);
            card.appendChild(link);
            scrollContainer.appendChild(card);
        });

        wrapper.appendChild(scrollContainer);
        targetContainer.innerHTML = "";
        targetContainer.appendChild(wrapper);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderAds);
    } else {
        renderAds();
    }
})();
