import express, { Express, Request, Response } from 'express';

export const app: Express = express();

app.use(express.json()); // вместо body-parser

const AvailableResolutions: string[] = [
   'P144',
   'P240',
   'P360',
   'P480',
   'P720',
   'P1080',
   'P1440',
   'P2160',
];

// enum AvailableResolutions {
//    P144 = 'P144',
//    P240 = 'P240',
//    P360 = 'P360',
//    P480 = 'P480',
//    P720 = 'P720',
//    P1080 = 'P1080',
//    P1440 = 'P1440',
//    P2160 = 'P2160',
// }

type VideoType = {
   id: number; ////
   title: string;
   author: string;
   canBeDownloaded: boolean;
   minAgeRestriction: number | null;
   createdAt: string;
   publicationDate: string;
   availableResolutions: typeof AvailableResolutions;
   //   availableResolutions: AvailableResolutions[];
};

const videos: VideoType[] = [
   // {
   //    id: 0,
   //    title: 'string',
   //    author: 'string',
   //    canBeDownloaded: true,
   //    minAgeRestriction: null,
   //    createdAt: '2024-01-04T16:54:56.572Z',
   //    publicationDate: '2024-01-04T16:54:56.572Z',
   //    availableResolutions: ['P144'], // не знаю как через Enum
   // },
];

type RequestWithBody<B> = Request<unknown, unknown, B, unknown>;

type Param = {
   id: string;
};

type CreateVideoType = {
   title: string;
   author: string;
   //   availableResolutions: AvailableResolutions[]
   availableResolutions?: typeof AvailableResolutions;
};

type ErrorType = {
   errorsMessages: ErrrorMessageType[];
};

type ErrrorMessageType = {
   field: string;
   message: string;
};

app.get('/videos', (req: Request, res: Response): void => {
   res.status(200).send(videos);
});

app.get('/videos/:id', (req: Request<Param>, res: Response): void => {
   const id: number = +req.params.id;

   const video: VideoType | undefined = videos.find((v) => v.id === id);

   if (!video) {
      res.sendStatus(404);
      return;
   }

   res.send(video);
});

app.post(
   '/videos',
   (req: RequestWithBody<CreateVideoType>, res: Response): void => {
      const errors: ErrorType = {
         errorsMessages: [],
      };

      let {
         title,
         author,
         availableResolutions,
      }: { title: string; author: string; availableResolutions?: string[] } =
         req.body;

      if (
         !title ||
         typeof title != 'string' ||
         !title.trim() || // Конструкция ! перед выражением преобразует его в логическое значение. Метод .trim() удаляет пробельные символы с начала и конца строки. Таким образом, выражение !title.trim() сначала удаляет пробельные символы из строки title, затем преобразует результат в логическое значение. Если после удаления пробельных символов строка оказывается пустой, выражение становится true. Если строка содержит хотя бы один символ, выражение становится false.
         title.trim().length > 40
      ) {
         errors.errorsMessages.push({
            field: 'title',
            message: 'Incorrect title',
         });
      }

      if (
         !author ||
         typeof author != 'string' ||
         !author.trim() ||
         author.trim().length > 20
      ) {
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
      } else {
         availableResolutions = [];
      }

      if (errors.errorsMessages.length) {
         res.status(400).send(errors);
         return;
      }

      const createdAt: Date = new Date();
      const publicationDate: Date = new Date();

      publicationDate.setDate(createdAt.getDate() + 1);

      const newVideo: VideoType = {
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
   }
);

app.delete('/testing/all-data', (req: Request, res: Response): void => {
   videos.length = 0;

   console.log('All data is deleted');
   res.sendStatus(204);
});

app.delete('/videos/:id', (req: Request<Param>, res: Response): void => {
   const id: number = +req.params.id;

   const video: VideoType | undefined = videos.find((v) => v.id === id);

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

app.put('/videos/:id', (req: Request<Param>, res: Response): void => {
   const id: number = +req.params.id;
   const videoIndex = videos.findIndex((video) => video.id === id);

   const errors: ErrorType = {
      errorsMessages: [],
   };

   if (videoIndex !== -1) {
      const updatedVideo: Partial<VideoType> = req.body;

      if (updatedVideo.title) {
         if (
            typeof updatedVideo.title === 'string' &&
            updatedVideo.title.trim() &&
            updatedVideo.title.trim().length < 40
         ) {
            videos[videoIndex].title = updatedVideo.title;
         } else {
            errors.errorsMessages.push({
               message: 'Incorrect title',
               field: 'title',
            });
            // res.status(400).send(errors);
            // return;
         }
      } else {
         errors.errorsMessages.push({
            message: 'Incorrect title',
            field: 'title',
         });
         // res.status(400).send(errors);
         // return;
      }

      if (updatedVideo.author) {
         if (
            typeof updatedVideo.author === 'string' &&
            updatedVideo.author.trim() &&
            updatedVideo.author.trim().length < 20
         ) {
            videos[videoIndex].author = updatedVideo.author;
         } else {
            errors.errorsMessages.push({
               message: 'Incorrect author',
               field: 'author',
            });
         }
      } else {
         errors.errorsMessages.push({
            message: 'Incorrect author',
            field: 'author',
         });
      }

      if (updatedVideo.availableResolutions) {
         if (
            Array.isArray(updatedVideo.availableResolutions) &&
            updatedVideo.availableResolutions.length > 0
         ) {
            updatedVideo.availableResolutions.forEach((r) => {
               if (AvailableResolutions.includes(r)) {
                  videos[videoIndex].availableResolutions =
                     updatedVideo.availableResolutions || [];
               } else {
                  errors.errorsMessages.push({
                     message: 'Incorrect availableResolutions',
                     field: 'availableResolutions',
                  });
               }
            });
         }
      }

      if (updatedVideo.canBeDownloaded) {
         if (typeof updatedVideo.canBeDownloaded === 'boolean') {
            videos[videoIndex].canBeDownloaded = updatedVideo.canBeDownloaded;
         } else {
            errors.errorsMessages.push({
               message: 'Incorrect canBeDownloaded',
               field: 'canBeDownloaded',
            });
         }
      }

      if (updatedVideo.minAgeRestriction) {
         if (
            typeof updatedVideo.minAgeRestriction === 'number' &&
            updatedVideo.minAgeRestriction > 1 &&
            updatedVideo.minAgeRestriction < 18
         ) {
            videos[videoIndex].minAgeRestriction =
               updatedVideo.minAgeRestriction;
         } else {
            errors.errorsMessages.push({
               message: 'Incorrect minAgeRestriction',
               field: 'minAgeRestriction',
            });
         }
      }

      if (updatedVideo.publicationDate) {
         if (typeof updatedVideo.publicationDate === 'string') {
            videos[videoIndex].publicationDate = updatedVideo.publicationDate;
         } else {
            errors.errorsMessages.push({
               message: 'Incorrect publicationDate',
               field: 'publicationDate',
            });
         }
      }

      if (errors.errorsMessages.length) {
         res.status(400).send(errors);
         return;
      }

      res.sendStatus(204);
   } else {
      res.sendStatus(404);
   }
});
