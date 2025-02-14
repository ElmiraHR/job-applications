import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Увеличиваем лимит запроса

const FILE_PATH = './data.json';

// Получение данных
app.get('/applications', async (req, res) => {
    try {
        const data = await fs.readFile(FILE_PATH, 'utf8');
        const applications = JSON.parse(data || '[]');
        res.json(applications);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        res.status(500).json({ error: 'Ошибка чтения файла' });
    }
});

// Добавление новой заявки
app.post('/applications', async (req, res) => {
    try {
        const newApplication = req.body;

        let applications = [];
        try {
            const data = await fs.readFile(FILE_PATH, 'utf8');
            applications = JSON.parse(data || '[]');
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        applications.push(newApplication);
        await fs.writeFile(FILE_PATH, JSON.stringify(applications, null, 2), 'utf8');
        res.status(200).json({ message: 'Заявка добавлена' });
    } catch (err) {
        console.error('Ошибка обработки запроса:', err);
        res.status(500).json({ error: 'Ошибка обработки запроса' });
    }
});

// Обновление всех данных
app.put('/applications', async (req, res) => {
    try {
        const updatedApplications = req.body;

        if (!Array.isArray(updatedApplications)) {
            return res.status(400).json({ error: 'Входящие данные должны быть массивом.' });
        }

        await fs.writeFile(FILE_PATH, JSON.stringify(updatedApplications, null, 2), 'utf8');
        res.status(200).json({ message: 'Данные обновлены' });
    } catch (err) {
        console.error('Ошибка обработки запроса:', err);
        res.status(500).json({ error: 'Ошибка обработки запроса' });
    }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
