import { app } from './settings';

const PORT = process.env.PORT || 5001;

// запуск приложения локально
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});