"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json()); // вместо body-parser
const AvailableResolutions = [
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160',
];
const videos = [
    {
        id: 0,
        title: 'string',
        author: 'string',
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: '2024-01-04T16:54:56.572Z',
        publicationDate: '2024-01-04T16:54:56.572Z',
        availableResolutions: ['P144'], // не знаю как через Enum
    },
];
exports.app.get('/videos', (req, res) => {
    res.send(videos);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((v) => v.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.app.post('/videos', (req, res) => {
    const errors = {
        errorsMessages: [],
    };
    let { title, author, availableResolutions, } = req.body;
    if (!title ||
        typeof title != 'string' ||
        !title.trim() || // Конструкция ! перед выражением преобразует его в логическое значение. Метод .trim() удаляет пробельные символы с начала и конца строки. Таким образом, выражение !title.trim() сначала удаляет пробельные символы из строки title, затем преобразует результат в логическое значение. Если после удаления пробельных символов строка оказывается пустой, выражение становится true. Если строка содержит хотя бы один символ, выражение становится false.
        title.trim().length > 40) {
        errors.errorsMessages.push({
            field: 'title',
            message: 'Incorrect title',
        });
    }
    if (!author ||
        typeof author != 'string' ||
        !author.trim() ||
        author.trim().length > 20) {
        errors.errorsMessages.push({
            field: 'author',
            message: 'Incorrect author',
        });
    }
    if (Array.isArray(availableResolutions)) {
        availableResolutions.forEach((r) => {
            if (!AvailableResolutions.includes(r)) {
                errors.errorsMessages.push({
                    field: 'availableResolutions',
                    message: 'Incorrect availableResolutions',
                });
                return;
            }
        });
    }
    else {
        availableResolutions = [];
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +new Date(),
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdAt.toISOString(),
        publicationDate: publicationDate.toISOString(),
        title,
        author,
        availableResolutions,
    };
    videos.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.delete('./testing/all-data', (req, res) => {
    videos.length = 0;
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videos.find((v) => v.id === id);
    if (video) {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1);
                break;
            }
        }
        res.sendStatus(204);
        return;
    }
    console.log('Video not found');
    res.sendStatus(404);
});
/////////////////////////
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex((video) => video.id === id);
    const errors = {
        errorsMessages: [],
    };
    if (videoIndex !== -1) {
        const updatedVideo = req.body;
        if (updatedVideo.title) {
            if (typeof updatedVideo.title === 'string' &&
                updatedVideo.title.trim() &&
                updatedVideo.title.trim().length > 40) {
                videos[videoIndex].title = updatedVideo.title;
            }
            else {
                errors.errorsMessages.push({
                    field: 'title',
                    message: 'Incorrect title',
                });
            }
        }
        if (updatedVideo.author) {
            if (typeof updatedVideo.author === 'string' &&
                updatedVideo.author.trim() &&
                updatedVideo.author.trim().length > 20) {
                videos[videoIndex].author = updatedVideo.author;
            }
            else {
                errors.errorsMessages.push({
                    field: 'author',
                    message: 'Incorrect author',
                });
            }
        }
        if (updatedVideo.availableResolutions) {
            if (Array.isArray(updatedVideo.availableResolutions) &&
                updatedVideo.availableResolutions.length == 1) {
                updatedVideo.availableResolutions.forEach((r) => {
                    if (AvailableResolutions.includes(r)) {
                        videos[videoIndex].availableResolutions =
                            updatedVideo.availableResolutions || [];
                    }
                    else {
                        errors.errorsMessages.push({
                            field: 'availableResolutions',
                            message: 'Incorrect availableResolutions',
                        });
                    }
                });
            }
        }
        if (updatedVideo.canBeDownloaded) {
            if (typeof updatedVideo.canBeDownloaded !== 'boolean') {
                videos[videoIndex].canBeDownloaded = updatedVideo.canBeDownloaded;
            }
            else {
                errors.errorsMessages.push({
                    field: 'canBeDownloaded',
                    message: 'Incorrect canBeDownloaded',
                });
            }
        }
        if (updatedVideo.minAgeRestriction) {
            if (typeof updatedVideo.minAgeRestriction === 'number' &&
                updatedVideo.minAgeRestriction < 1 &&
                updatedVideo.minAgeRestriction > 18) {
                videos[videoIndex].minAgeRestriction =
                    updatedVideo.minAgeRestriction;
            }
            else {
                errors.errorsMessages.push({
                    field: 'minAgeRestriction',
                    message: 'Incorrect minAgeRestriction',
                });
            }
        }
        if (updatedVideo.publicationDate) {
            if (typeof updatedVideo.publicationDate !== 'string') {
                videos[videoIndex].publicationDate = updatedVideo.publicationDate;
            }
            else {
                errors.errorsMessages.push({
                    field: 'publicationDate',
                    message: 'Incorrect publicationDate',
                });
            }
        }
        if (errors.errorsMessages.length) {
            res.status(400).send(errors);
            return;
        }
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
