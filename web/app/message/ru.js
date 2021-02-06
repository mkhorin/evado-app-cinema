'use strict';
/**
 * Extend default translations
 *
 * Use: Jam.t('Some text')
 * Use: <span data-t="">Some text</span>
 * Use: <div title="Some text" data-t=""></div>
 * Use: <input placeholder="Some text" type="text" data-t="">
 */
Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

/**
 * Define custom translation category
 *
 * Use: Jam.t('Some text', 'custom')
 * Use: <span data-t="custom">Some text</span>
 * Use: <div title="Some text" data-t="custom"></div>
 * Use: <input placeholder="Some text" type="text" data-t="custom">
 * Use: <div title="Some text" data-t-title="custom" data-t="">Text</div>
 */
Jam.I18n.custom = {

    'Some text': 'Некоторый текст'
};

// METADATA

Jam.I18n.meta = {

    'Active': 'Активно',

    'Column': 'Место',
    'Create': 'Создать',
    'Created at': 'Создано',
    'Creator': 'Создатель',

    'Date': 'Дата',
    'Description': 'Описание',
    'Duration': 'Длительность',

    'File': 'Файл',
    'Free seats': 'Свободные места',

    'Hall': 'Зал',
    'Halls': 'Залы',

    'Image': 'Изображение',
    'In minutes': 'В минутах',

    'Main': 'Главная',
    'Movie': 'Фильм',
    'Movies': 'Фильмы',

    'Name': 'Название',

    'Order number': 'Порядковый номер',

    'Poster': 'Плакат',
    'Posters': 'Плакаты',
    'Price': 'Цена',
    'Prices': 'Цены',
    'Pricing': 'Ценообразование',

    'Row': 'Ряд',

    'Screening': 'Показ',
    'Screenings': 'Показы',
    'Seat': 'Место',
    'Seat counter': 'Счетчик мест',
    'Seats': 'Места',
    'Special prices': 'Специальные цены',

    'Ticket': 'Билет',
    'Tickets': 'Билеты',
    'Title': 'Заголовок',

    'Value': 'Значение'
};