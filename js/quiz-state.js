const QuizManager = {
    storageKey: 'osiris_quiz_state',
    
    saveState(state) {
        try {
            const dataToSave = {
                ...state,
                timestamp: Date.now(),
                version: '1.0'
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            this.syncWithServer(dataToSave); // Optionnel : synchronisation avec le serveur
        } catch (e) {
            console.error('Erreur lors de la sauvegarde:', e);
        }
    },

    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (!saved) return null;

            const data = JSON.parse(saved);
            const hoursSinceLastSave = (Date.now() - data.timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceLastSave > 24) {
                this.clearState();
                return null;
            }

            return data;
        } catch (e) {
            console.error('Erreur lors du chargement:', e);
            return null;
        }
    },

    clearState() {
        localStorage.removeItem(this.storageKey);
    },

    autoSave(quizInstance) {
        // Sauvegarder automatiquement après chaque réponse
        const currentState = {
            answers: quizInstance.userAnswers,
            context: quizInstance.userContext,
            currentQuestion: quizInstance.currentQuestion
        };
        this.saveState(currentState);
    },

    resumeQuiz() {
        const savedState = this.loadState();
        if (savedState) {
            return {
                canResume: true,
                state: savedState
            };
        }
        return { canResume: false };
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const resumeData = QuizManager.resumeQuiz();
    if (resumeData.canResume) {
        // Proposer de reprendre le quiz
        showResumePrompt(resumeData.state);
    }
}); 