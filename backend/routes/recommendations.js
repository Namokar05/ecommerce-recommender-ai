const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const recommender = require('../services/recommender');
const llmService = require('../services/llmService');

// Get recommendations for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // Get recommendations
        const recommendations = await recommender.recommend(userId, 5);

        // Get user interactions for context
        const { data: interactions } = await supabase
            .from('user_interactions')
            .select('*')
            .eq('user_id', userId);

        // Generate LLM explanations for each recommendation
        const recommendationsWithExplanations = await Promise.all(
            recommendations.map(async (product) => {
                const explanation = await llmService.generateExplanation(
                    product,
                    interactions || []
                );
                return {
                    ...product,
                    explanation
                };
            })
        );

        res.json(recommendationsWithExplanations);
    } catch (error) {
        console.error('Error generating recommendations:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;