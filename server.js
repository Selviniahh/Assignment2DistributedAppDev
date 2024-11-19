const express = require('express');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize and seed the SQLite database
let db;
(async () => {
    try {
        db = await sqlite.open({
            filename: path.join(__dirname, 'data/greetings.db'),
            driver: sqlite3.Database,
        });

        // Create the 'greetings' table if it doesn't exist
        await db.exec(`
            CREATE TABLE IF NOT EXISTS greetings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timeOfDay TEXT NOT NULL,
                language TEXT NOT NULL,
                greetingMessage TEXT NOT NULL,
                tone TEXT NOT NULL
            )
        `);

        // Seed the database with some greetings in3 different languages
        await seedDatabase();
        console.log('Database initialized and seeded.');
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
})();

// Function to seed the database
async function seedDatabase() {
    const greetings = [
        // English Greetings
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good morning', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Good afternoon', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Good evening', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Morning My friend!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Hey!!!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Hi there! Have a great evening', tone: 'Casual' },

        // German Greetings
        { timeOfDay: 'Morning', language: 'German', greetingMessage: 'Guten Morgen', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'German', greetingMessage: 'Guten Tag', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'German', greetingMessage: 'Guten Abend', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'German', greetingMessage: 'Hallo!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'German', greetingMessage: 'Hi!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'German', greetingMessage: 'Servus!', tone: 'Casual' },

        // Turkish Greetings
        { timeOfDay: 'Morning', language: 'Turkish', greetingMessage: 'Gunaydin', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'Turkish', greetingMessage: 'Iyi gunler', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'Turkish', greetingMessage: 'Iyi aksamlar', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'Turkish', greetingMessage: 'Merhaba!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'Turkish', greetingMessage: 'Selam!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'Turkish', greetingMessage: 'Naber?', tone: 'Casual' }
    ];

    const insertQuery = 'INSERT INTO greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)';

    for (const greeting of greetings) {
        // Check if the greeting already exists to avoid duplicates
        const existing = await db.get(
            'SELECT id FROM greetings WHERE timeOfDay = ? AND language = ? AND greetingMessage = ? AND tone = ?',
            [greeting.timeOfDay, greeting.language, greeting.greetingMessage, greeting.tone]
        );

        if (!existing) {
            await db.run(insertQuery, [greeting.timeOfDay, greeting.language, greeting.greetingMessage, greeting.tone]);
        }
    }
}

// Greet endpoint
app.post('/api/greet', async (req, res) => {
    const { timeOfDay, language, tone } = req.body;

    if (!timeOfDay || !language || !tone) {
        return res.status(400).json({ error: 'timeOfDay, language, and tone are required' });
    }

    try {
        const greeting = await db.get(
            `SELECT greetingMessage FROM greetings WHERE timeOfDay = ? AND language = ? AND tone = ?`,
            [timeOfDay, language, tone]
        );

        if (greeting) {
            res.json({ greetingMessage: greeting.greetingMessage });
        } else {
            res.status(404).json({ error: 'Greeting not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all times of day
app.get('/api/timesOfDay', async (req, res) => {
    try {
        const times = await db.all(`SELECT DISTINCT timeOfDay FROM greetings`);
        res.json({ message: 'success', data: times });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all supported languages
app.get('/api/languages', async (req, res) => {
    try {
        const languages = await db.all(`SELECT DISTINCT language FROM greetings`);
        res.json({ message: 'success', data: languages });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
