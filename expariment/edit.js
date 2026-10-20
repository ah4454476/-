(function() {
    const head = document.head;

    // ==========================================
    // 1. WEBMASTER & SEARCH CONSOLE VERIFICATION
    // ==========================================
    const verificationMetaTags = [
        { name: 'google-site-verification', content: 'YAHAN_APNA_GOOGLE_CODE_LIKHEIN' },
        { name: 'msvalidate.01', content: 'YAHAN_APNA_BING_CODE_LIKHEIN' },
        { name: 'yandex-verification', content: 'YAHAN_APNA_YANDEX_CODE_LIKHEIN' }
    ];

    verificationMetaTags.forEach(tagData => {
        let meta = document.querySelector(`meta[name="${tagData.name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', tagData.name);
            head.appendChild(meta);
        }
        meta.content = tagData.content;
    });

    // ==========================================
    // 2. GOOGLE ANALYTICS (GA4)
    // ==========================================
    const gaMeasurementId = 'G-XXXXXXXXXX'; // Yahan apni Google Analytics ID likhein
    if (gaMeasurementId && gaMeasurementId !== 'G-XXXXXXXXXX') {
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
        head.appendChild(gaScript);

        const gaInline = document.createElement('script');
        gaInline.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaMeasurementId}');
        `;
        head.appendChild(gaInline);
    }

    // ==========================================
    // 3. GOOGLE ADSENSE
    // ==========================================
    const adsensePubId = 'ca-pub-XXXXXXXXXXXXXXXX'; // Yahan apni AdSense Publisher ID likhein
    if (adsensePubId && adsensePubId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
        const adsenseScript = document.createElement('script');
        adsenseScript.async = true;
        adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePubId}`;
        adsenseScript.crossOrigin = 'anonymous';
        head.appendChild(adsenseScript);
    }

    // ==========================================
    // 4. COMMON CSS & FAVICON
    // ==========================================
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';

    const customCSS = document.createElement('link');
    customCSS.rel = 'stylesheet';
    customCSS.href = 'style.css';

    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = 'favicon.png';

    head.appendChild(bootstrapCSS);
    head.appendChild(customCSS);
    head.appendChild(favicon);

    // ==========================================
    // 5. AUTO-DETECT TITLE & IMAGE FOR SOCIAL SHARING
    // ==========================================
    document.addEventListener("DOMContentLoaded", function() {
        const pageTitle = document.title || "Recipe Blog";
        const pageUrl = window.location.href;
        
        const postImgElem = document.querySelector('.post-content img') || document.querySelector('.col-lg-8 img');
        const imageUrl = postImgElem ? postImgElem.src : "";

        const snippetMeta = document.querySelector('meta[name="post-snippet"]');
        const description = snippetMeta ? snippetMeta.content : pageTitle;

        const ogTags = [
            { property: 'og:type', content: 'article' },
            { property: 'og:title', content: pageTitle },
            { property: 'og:description', content: description },
            { property: 'og:url', content: pageUrl }
        ];

        if (imageUrl) {
            ogTags.push({ property: 'og:image', content: imageUrl });
            ogTags.push({ property: 'og:image:secure_url', content: imageUrl });
        }

        ogTags.forEach(tagData => {
            let meta = document.querySelector(`meta[property="${tagData.property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', tagData.property);
                head.appendChild(meta);
            }
            meta.content = tagData.content;
        });
    });
})();
