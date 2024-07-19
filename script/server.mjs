import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';
import cors from 'cors';
import path from 'path';

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: 'https://n1k-1ta.github.io/skupOnline_test/' 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/style', express.static(path.join(path.resolve(), 'style')));
app.use('/script', express.static(path.join(path.resolve(), 'script')));

app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'index.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'confirmation.html'));
});

app.post('/submit-form', upload.single('image'), async (req, res) => {
    console.log('Received form submission');
    const { name, phone, product, model, condition, price, description, specificType } = req.body;
    const image = req.file;

    console.log('Form data:', { name, phone, product, model, condition, price, description, specificType });
    console.log('Image file:', image);

    const botToken = '7011778898:AAH1Ych5EKziMaaXKhRkUgmJDaX4UEkLp0Q';
    const chatId = '-4174297101';

    const message = `
    Имя: ${name}
    Телефон: ${phone}
    Категория товара: ${product}${specificType ? ' (' + specificType + ')' : ''}
    Модель: ${model}
    Состояние: ${condition}
    Цена: ${price}
    Описание: ${description}
    `;

    try {
        console.log('Отправка сообщения...');
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });
        const data = await response.json();
        console.log('Результат отправки сообщения:', data);

        if (response.ok && image) {
            console.log('Отправка фото...');
            const form = new FormData();
            form.append('chat_id', chatId);
            form.append('photo', fs.createReadStream(image.path));

            const photoResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                body: form
            });
            const photoData = await photoResponse.json();
            console.log('Результат отправки фото:', photoData);
        }

        res.redirect('/confirmation');
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Не удалось отправить форму');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Сервер запущен на http://0.0.0.0:${port}/`);
});

