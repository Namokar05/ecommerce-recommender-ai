const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Add interaction
router.post('/', async (req, res) => {
    try {
        const { user_id, product_id, interaction_type } = req.body;

        const { data, error } = await supabase
            .from('user_interactions')
            .insert([
                {
                    user_id,
                    product_id,
                    interaction_type,
                    timestamp: new Date().toISOString()
                }
            ])
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        console.error('Error adding interaction:', error);
        res.status(500).json({ error: error.message });
    }
});

// Add reset interactions endpoint
router.delete('/user/:userId', async (req, res) => {
    try {
        const { error } = await supabase
            .from('user_interactions')
            .delete()
            .eq('user_id', req.params.userId);

        if (error) throw error;
        res.json({ message: 'All interactions reset successfully' });
    } catch (error) {
        console.error('Error resetting interactions:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;