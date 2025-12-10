import express, { Request, Response } from 'express'

export const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('HW 01.01 API is working')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
