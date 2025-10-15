const supabase = require('../config/supabase');

class Recommender {
    async recommend(userId, limit = 5) {
        try {
            // Get all products
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*');

            if (productsError) throw productsError;

            // Get user interactions
            const { data: interactions, error: interactionsError } = await supabase
                .from('user_interactions')
                .select('*')
                .eq('user_id', userId);

            if (interactionsError) throw interactionsError;

            if (!interactions || interactions.length === 0) {
                // Return popular products for new users
                return products
                    .sort((a, b) => b.popularity - a.popularity)
                    .slice(0, limit);
            }

            // Get product IDs user has interacted with
            const interactedProductIds = new Set(
                interactions.map(i => i.product_id)
            );

            // Get categories user has shown interest in
            const interactedProducts = products.filter(p =>
                interactedProductIds.has(p.id)
            );

            const userCategories = new Set(
                interactedProducts.map(p => p.category)
            );

            // Score products
            const scoredProducts = products
                .filter(p => !interactedProductIds.has(p.id))
                .map(product => {
                    let score = 0;

                    // Category match
                    if (userCategories.has(product.category)) {
                        score += 2.0;
                    }

                    // Popularity bonus
                    score += (product.popularity || 0) / 100;

                    // Interaction type weights
                    interactions.forEach(interaction => {
                        const interactedProduct = products.find(
                            p => p.id === interaction.product_id
                        );

                        if (interactedProduct &&
                            interactedProduct.category === product.category) {
                            if (interaction.interaction_type === 'purchase') {
                                score += 0.5;
                            } else if (interaction.interaction_type === 'cart') {
                                score += 0.3;
                            } else if (interaction.interaction_type === 'view') {
                                score += 0.1;
                            }
                        }
                    });

                    return { ...product, score };
                });

            // Sort by score and return top recommendations
            return scoredProducts
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        } catch (error) {
            console.error('Recommendation Error:', error);
            throw error;
        }
    }
}

module.exports = new Recommender();