import { app } from './settings';
const port: 3000 = 3000;

app.listen(port, (): void => {
   console.log(`App listen on port ${port}`);
});
