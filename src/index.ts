import { app } from './settings';
const port: number = 3000;

app.listen(port, (): void => {
   console.log(`App listen on port ${port}`);
});
