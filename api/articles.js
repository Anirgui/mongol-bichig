import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    if (req.method === 'GET') {
      const articles = await sql`
        SELECT * FROM articles
        ORDER BY id DESC
      `

      return res.status(200).json({
        message: 'Нийтлэлүүдийг амжилттай авлаа! 🎉',
        articles
      })
    }

    if (req.method === 'POST') {
      const article = req.body

      await sql`
        INSERT INTO articles
        (id, title, author, category, content, status, date)
        VALUES (
          ${article.id},
          ${article.title},
          ${article.author},
          ${article.category},
          ${article.content},
          ${article.status},
          ${article.date}
        )
      `

      return res.status(200).json({
        message: 'Нийтлэл Neon database-д хадгалагдлаа! 🎉',
        article
      })
    }

    return res.status(405).json({
      message: 'Энэ хүсэлтийг дэмжихгүй'
    })

  } catch (error) {
    console.error(error)

    return res.status(500).json({
      message: 'Database алдаа гарлаа',
      error: error.message
    })
  }
}