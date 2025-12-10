import express, { Request, Response } from 'express'

export const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('HW 01.01 API is working!')
})

// сюда позже добавим /hometask_01/api/videos, /testing/all-data и т.д.
