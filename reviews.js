class ReviewSystem {
    constructor(productId) {
        this.productId = productId;
        this.reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
        this.init();
    }

    init() {
        this.displayReviews();
        this.setupEventListeners();
    }

    addReview(name, rating, comment) {
        const review = {
            id: Date.now(),
            name,
            rating,
            comment,
            date: new Date().toLocaleDateString('fr-FR'),
            likes: 0,
            verified: Math.random() > 0.5 // Simulation d'achat vérifié
        };

        this.reviews.unshift(review);
        this.saveReviews();
        this.displayReviews();
    }

    saveReviews() {
        localStorage.setItem(`reviews_${this.productId}`, JSON.stringify(this.reviews));
    }

    likeReview(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.likes++;
            this.saveReviews();
            this.displayReviews();
        }
    }

    calculateAverageRating() {
        if (this.reviews.length === 0) return 0;
        const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / this.reviews.length).toFixed(1);
    }

    displayReviews() {
        const container = document.querySelector('.reviews-container');
        if (!container) return;

        const averageRating = this.calculateAverageRating();
        const totalReviews = this.reviews.length;

        container.innerHTML = `
            <div class="reviews-header">
                <h2>Avis Clients</h2>
                <div class="reviews-summary">
                    <div class="average-rating">
                        <span class="rating-number">${averageRating}</span>
                        <div class="stars">
                            ${this.getStarsHTML(averageRating)}
                        </div>
                        <span class="total-reviews">Basé sur ${totalReviews} avis</span>
                    </div>
                    <button class="add-review-btn">Ajouter un avis</button>
                </div>
            </div>
            <div class="review-form-container" style="display: none;">
                <form class="review-form">
                    <div class="form-group">
                        <label for="name">Nom</label>
                        <input type="text" id="name" required>
                    </div>
                    <div class="form-group">
                        <label>Note</label>
                        <div class="rating-input">
                            ${[5,4,3,2,1].map(num => `
                                <input type="radio" id="star${num}" name="rating" value="${num}">
                                <label for="star${num}">★</label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="comment">Votre avis</label>
                        <textarea id="comment" required></textarea>
                    </div>
                    <button type="submit">Publier</button>
                </form>
            </div>
            <div class="reviews-list">
                ${this.reviews.map(review => this.createReviewHTML(review)).join('')}
            </div>
        `;

        this.setupEventListeners();
    }

    createReviewHTML(review) {
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <span class="reviewer-name">${review.name}</span>
                        ${review.verified ? '<span class="verified-badge">Achat vérifié</span>' : ''}
                    </div>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">
                    ${this.getStarsHTML(review.rating)}
                </div>
                <p class="review-comment">${review.comment}</p>
                <div class="review-footer">
                    <button class="like-btn" data-review-id="${review.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span>${review.likes}</span>
                    </button>
                </div>
            </div>
        `;
    }

    getStarsHTML(rating) {
        return Array(5).fill('').map((_, index) => {
            const starClass = index < rating ? 'filled' : 'empty';
            return `<span class="star ${starClass}">★</span>`;
        }).join('');
    }

    setupEventListeners() {
        const addReviewBtn = document.querySelector('.add-review-btn');
        const formContainer = document.querySelector('.review-form-container');
        const form = document.querySelector('.review-form');
        const likeBtns = document.querySelectorAll('.like-btn');

        if (addReviewBtn) {
            addReviewBtn.addEventListener('click', () => {
                formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const rating = parseInt(form.rating.value);
                const comment = document.getElementById('comment').value;

                this.addReview(name, rating, comment);
                form.reset();
                formContainer.style.display = 'none';
            });
        }

        likeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const reviewId = parseInt(btn.dataset.reviewId);
                this.likeReview(reviewId);
            });
        });
    }
}
