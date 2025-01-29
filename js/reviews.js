class ReviewSystem {
    constructor() {
        this.reviewsContainer = document.querySelector('.reviews-container');
        this.setupReviewSystem();
    }

    setupReviewSystem() {
        // Charger les avis depuis le localStorage ou utiliser les avis par défaut
        this.loadReviews();
        this.displayReviews();
        this.setupReviewForm();
    }

    loadReviews() {
        const productName = document.querySelector('.product-header h1').textContent;
        const storedReviews = localStorage.getItem(`reviews_${productName}`);
        
        if (storedReviews) {
            this.reviews = JSON.parse(storedReviews);
        } else {
            // Avis par défaut élégants pour maintenir l'image de marque
            this.reviews = [
                {
                    author: "Sophie L.",
                    rating: 5,
                    title: "Une expérience olfactive divine",
                    comment: "Un parfum d'exception qui évoque parfaitement l'essence de l'Égypte ancienne. Le flacon est une véritable œuvre d'art.",
                    date: "2024-12-15",
                    verified: true
                },
                {
                    author: "Marc A.",
                    rating: 4,
                    title: "Élégance et mystère",
                    comment: "Les notes s'entremêlent avec une grâce particulière. Un parfum qui ne laisse pas indifférent.",
                    date: "2024-11-28",
                    verified: true
                }
            ];
            this.saveReviews();
        }
    }

    displayReviews() {
        if (!this.reviewsContainer) return;

        const averageRating = this.calculateAverageRating();
        this.updateProductRating(averageRating);

        this.reviewsContainer.innerHTML = `
            <div class="reviews-header">
                <h3>AVIS DE NOS CLIENTS</h3>
                <div class="reviews-summary">
                    <div class="average-rating">
                        <span class="rating-value">${averageRating.toFixed(1)}</span>
                        <div class="stars">
                            ${this.generateStars(averageRating)}
                        </div>
                    </div>
                    <div class="review-count">
                        Basé sur ${this.reviews.length} avis
                    </div>
                </div>
            </div>
            <div class="reviews-list">
                ${this.reviews.map(review => this.generateReviewHTML(review)).join('')}
            </div>
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i - 0.5 <= rating) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    generateReviewHTML(review) {
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="review-author">
                        <span class="author-name">${review.author}</span>
                        ${review.verified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Achat vérifié</span>' : ''}
                    </div>
                    <div class="review-date">${this.formatDate(review.date)}</div>
                </div>
                <div class="review-rating">
                    ${this.generateStars(review.rating)}
                </div>
                <h4 class="review-title">${review.title}</h4>
                <p class="review-comment">${review.comment}</p>
            </div>
        `;
    }

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    calculateAverageRating() {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / this.reviews.length;
    }

    updateProductRating(averageRating) {
        const ratingContainer = document.querySelector('.product-rating .stars');
        const ratingCount = document.querySelector('.rating-count');
        
        if (ratingContainer) {
            ratingContainer.innerHTML = this.generateStars(averageRating);
        }
        
        if (ratingCount) {
            ratingCount.textContent = `${this.reviews.length} avis`;
        }
    }

    setupReviewForm() {
        // Le formulaire d'avis sera ajouté ultérieurement si nécessaire
    }

    saveReviews() {
        const productName = document.querySelector('.product-header h1').textContent;
        localStorage.setItem(`reviews_${productName}`, JSON.stringify(this.reviews));
    }
}

// Initialiser le système d'avis
document.addEventListener('DOMContentLoaded', () => {
    new ReviewSystem();
});
