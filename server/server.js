const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './data.json';

// Получение данных из файла
app.get('/applications', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        try {
            const applications = JSON.parse(data || '[]'); // Парсим содержимое файла
            res.json(applications);
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            res.status(500).json({ error: 'Ошибка парсинга данных' });
        }
    });
});

// Сохранение новой заявки
app.post('/applications', (req, res) => {
    const newApplication = req.body;

    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).json({ error: 'Ошибка чтения файла' });
        }

        let applications = [];
        try {
            applications = data ? JSON.parse(data) : [];
        } catch (parseError) {
            console.error('Ошибка парсинга JSON:', parseError);
            applications = [];
        }

        applications.push(newApplication); // Добавляем новую заявку

        // Перезаписываем файл с обновлённым массивом
        fs.writeFile(FILE_PATH, JSON.stringify(applications, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Ошибка записи в файл:', err);
                return res.status(500).json({ error: 'Ошибка записи в файл' });
            }
            res.status(200).json({ message: 'Заявка добавлена' });
        });
    });
});

// Обновление всех данных (перезапись всего массива)
app.put('/applications', (req, res) => {
    const updatedApplications = req.body;

    if (!Array.isArray(updatedApplications)) {
        console.error('Ошибка: входящие данные не являются массивом.');
        return res.status(400).json({ error: 'Входящие данные должны быть массивом.' });
    }

    fs.writeFile(FILE_PATH, JSON.stringify(updatedApplications, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return res.status(500).json({ error: 'Ошибка записи в файл' });
        }
        res.status(200).json({ message: 'Данные обновлены' });
    });
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
