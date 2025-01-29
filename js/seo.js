// Système SEO et données structurées pour OSIRIS
class OSIRISSEO {
    constructor() {
        this.init();
    }

    init() {
        this.setupStructuredData();
        this.setupBreadcrumbs();
        this.setupCanonicalLinks();
        this.setupSocialMeta();
    }

    setupStructuredData() {
        const pageType = document.body.dataset.pageType;
        let structuredData = {};

        switch (pageType) {
            case 'product':
                structuredData = this.generateProductSchema();
                break;
            case 'collection':
                structuredData = this.generateCollectionSchema();
                break;
            case 'article':
                structuredData = this.generateArticleSchema();
                break;
            default:
                structuredData = this.generateOrganizationSchema();
        }

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    generateProductSchema() {
        const product = {
            '@context': 'https://schema.org/',
            '@type': 'Product',
            name: document.querySelector('.product-header h1')?.textContent,
            description: document.querySelector('.product-description .luxury-text')?.textContent,
            image: document.querySelector('.main-image')?.src,
            brand: {
                '@type': 'Brand',
                name: 'OSIRIS'
            },
            offers: {
                '@type': 'Offer',
                priceCurrency: 'EUR',
                price: document.querySelector('.price')?.textContent.replace('€', '').trim(),
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'Organization',
                    name: 'OSIRIS'
                }
            },
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: document.querySelector('.rating-value')?.textContent || '5',
                reviewCount: document.querySelector('.review-count')?.textContent.split(' ')[0] || '0'
            }
        };

        return product;
    }

    generateCollectionSchema() {
        return {
            '@context': 'https://schema.org/',
            '@type': 'CollectionPage',
            name: 'Collection OSIRIS',
            description: 'Découvrez notre collection de parfums de luxe inspirés de l\'Égypte ancienne',
            publisher: {
                '@type': 'Organization',
                name: 'OSIRIS',
                logo: {
                    '@type': 'ImageObject',
                    url: '/images/logo.png'
                }
            }
        };
    }

    generateOrganizationSchema() {
        return {
            '@context': 'https://schema.org/',
            '@type': 'Organization',
            name: 'OSIRIS',
            description: 'Maison de parfums de luxe inspirée par l\'Égypte ancienne',
            url: 'https://www.osiris-parfums.fr',
            logo: '/images/logo.png',
            sameAs: [
                'https://www.facebook.com/osirisparfums',
                'https://www.instagram.com/osirisparfums',
                'https://www.pinterest.com/osirisparfums'
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+33-000-000000',
                contactType: 'customer service',
                areaServed: 'FR',
                availableLanguage: ['French', 'English']
            }
        };
    }

    setupBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs');
        if (!breadcrumbs) return;

        const breadcrumbList = {
            '@context': 'https://schema.org/',
            '@type': 'BreadcrumbList',
            itemListElement: Array.from(breadcrumbs.querySelectorAll('li')).map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.textContent,
                item: item.querySelector('a')?.href
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbList);
        document.head.appendChild(script);
    }

    setupCanonicalLinks() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.href.split('?')[0];
        document.head.appendChild(canonical);
    }

    setupSocialMeta() {
        const title = document.title;
        const description = document.querySelector('meta[name="description"]')?.content;
        const image = document.querySelector('.main-image')?.src || '/images/osiris-social.jpg';

        // Open Graph
        this.createMetaTag('og:title', title);
        this.createMetaTag('og:description', description);
        this.createMetaTag('og:image', image);
        this.createMetaTag('og:type', 'website');
        this.createMetaTag('og:site_name', 'OSIRIS');

        // Twitter Card
        this.createMetaTag('twitter:card', 'summary_large_image');
        this.createMetaTag('twitter:title', title);
        this.createMetaTag('twitter:description', description);
        this.createMetaTag('twitter:image', image);
    }

    createMetaTag(name, content) {
        if (!content) return;

        const meta = document.createElement('meta');
        const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
        
        if (isProperty) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }
}

// Initialiser le SEO
document.addEventListener('DOMContentLoaded', () => {
    new OSIRISSEO();
});
