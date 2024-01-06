import { app } from './settings.js';
const port: number = 3000;

app.listen(port, (): void => {
   console.log(`App listen on port ${port}`);
});
