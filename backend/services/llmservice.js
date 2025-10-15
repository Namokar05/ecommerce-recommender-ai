const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class LLMService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateExplanation(product, userInteractions) {
        try {
            const interactionContext = this.buildContext(userInteractions);

            const prompt = `You are an e-commerce recommendation assistant. Generate a brief, compelling explanation (2-3 sentences) for why we're recommending this product to the user.

Product Details:
- Name: ${product.name}
- Category: ${product.category}
- Price: $${product.price}
- Description: ${product.description}

User's Recent Activity:
${interactionContext}

Write a personalized, friendly explanation that connects the product to the user's interests. Be conversational and focus on benefits. Keep it under 50 words.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text().trim();
        } catch (error) {
            console.error('LLM Error:', error);
            // Fallback explanation
            return `Based on your interest in ${product.category} products, we think you'll love this ${product.name}. It's highly rated and offers great value at $${product.price}.`;
        }
    }

    buildContext(interactions) {
        if (!interactions || interactions.length === 0) {
            return 'New user with no previous interactions';
        }

        const views = interactions.filter(i => i.interaction_type === 'view').length;
        const purchases = interactions.filter(i => i.interaction_type === 'purchase').length;
        const cart = interactions.filter(i => i.interaction_type === 'cart').length;

        const context = [];
        if (views > 0) context.push(`Viewed ${views} products`);
        if (purchases > 0) context.push(`Purchased ${purchases} items`);
        if (cart > 0) context.push(`Added ${cart} items to cart`);

        return context.join(', ') || 'Minimal activity';
    }
}

module.exports = new LLMService();