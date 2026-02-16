const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "team", "judge", "superadmin"], default: "team" },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: null },
    name: { type: String },
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function addAdmin() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is not defined in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'gowreesh4343@gmail.com';

        // Upsert user with admin role
        const user = await User.findOneAndUpdate(
            { email },
            {
                email,
                role: 'admin',
                name: 'Gowreesh Admin'
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`Successfully added/updated admin user: ${user.email}`);

    } catch (error) {
        console.error('Error adding admin:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

addAdmin();
