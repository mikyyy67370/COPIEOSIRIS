// Configuration des produits OSIRIS
const OSIRIS_PRODUCTS = {
    'ANUBIS': {
        name: 'ANUBIS',
        subtitle: 'Une fragrance mystique aux accents sacrés',
        category: 'MASCULIN',
        collection: 'HÉRITAGE DES PHARAONS',
        nextProduct: 'HORUS',
        previousProduct: 'THOT',
        relatedProducts: ['OSIRIS ROYAL', 'HORUS'],
        description: 'Notes d\'encens et de myrrhe se mêlent dans une danse mystérieuse, évoquant les rituels sacrés de l\'embaumement.',
        prices: {
            '50ml': 202.30,
            '100ml': 289.00,
            '150ml': 404.60
        },
        stockStatus: {
            '50ml': true,
            '100ml': true,
            '150ml': true
        },
        metadata: {
            title: 'ANUBIS - Parfum de Luxe | OSIRIS',
            description: 'Découvrez ANUBIS, une création d\'exception qui capture l\'essence même du gardien mystique des âmes, alliant la profondeur des résines précieuses à la noblesse des bois rares.',
            keywords: 'parfum de luxe, OSIRIS, ANUBIS, encens, myrrhe, parfum masculin, parfumerie de luxe'
        }
    },
    'BASTET': {
        name: 'BASTET',
        subtitle: 'Une fragrance sensuelle aux notes félines',
        category: 'FÉMININ',
        collection: 'HÉRITAGE DES PHARAONS',
        nextProduct: 'ISIS',
        previousProduct: 'NEFERTITI',
        relatedProducts: ['ISIS', 'NEFERTITI'],
        description: 'Notes de jasmin et de rose dansent avec grâce, évoquant la sensualité féline de la déesse Bastet.',
        prices: {
            '50ml': 202.30,
            '100ml': 289.00,
            '150ml': 404.60
        },
        stockStatus: {
            '50ml': true,
            '100ml': true,
            '150ml': true
        },
        metadata: {
            title: 'BASTET - Parfum de Luxe | OSIRIS',
            description: 'Découvrez BASTET, une création d\'exception qui célèbre la féminité et la joie de vivre, alliant la douceur des fleurs précieuses à l\'élégance des muscs blancs.',
            keywords: 'parfum de luxe, OSIRIS, BASTET, jasmin, rose, parfum féminin, parfumerie de luxe'
        }
    }
    // Configurations similaires pour les autres produits...
};
