const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const RoundSchema = new mongoose.Schema({
    round_number: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    is_active: { type: Boolean, default: false },
});

const Round = mongoose.models.Round || mongoose.model('Round', RoundSchema);

async function checkRounds() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const rounds = await Round.find({});
        console.log('Rounds found:', rounds);

    } catch (error) {
        console.error('Error checking rounds:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

checkRounds();
