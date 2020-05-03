'use strict';

// evado/web/jam/utility/I18n.js

// extend default translation category
// use: <span data-t="">Some text</span>
// use: <div title="Some text"></div>
// use: <input placeholder="Some text" type="text" />

Object.assign(Jam.I18n.defaults, {

    'Test utility': 'Тестовая утилита'
});

// define custom translation category
// use: <span data-t="custom">Any text</span>
// use: <div data-t="custom" title="Any text"></div>
// use: <input data-t="custom" placeholder="Any text" type="text"/>
// use: <div data-t-title="customTitle" title="Any title" data-t="custom">Any text</div>

Jam.I18n.custom = {

    'Any text': 'Любой текст'
};

Jam.I18n.customTitle = {

    'Any title': 'Любой заголовок'
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