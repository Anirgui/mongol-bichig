import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const sql = neon(process.env.DATABASE_URL)

  try {

    // =========================
    // GET - Нийтлэлүүд авах
    // =========================

    if (req.method === 'GET') {

      const articles = await sql`
        SELECT *
        FROM articles
        ORDER BY id DESC
      `

      return res.status(200).json({
        message: 'Нийтлэлүүдийг амжилттай авлаа! 🎉',
        articles
      })
    }


    // =========================
    // POST - Шинэ нийтлэл
    // =========================

    if (req.method === 'POST') {

      const article = req.body

      await sql`
        INSERT INTO articles
        (
          id,
          title,
          author,
          category,
          content,
          status,
          date
        )
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


    // =========================
    // PUT - Нийтлэл засах
    // =========================

    if (req.method === 'PUT') {

      const article = req.body

      if (!article.id) {
        return res.status(400).json({
          message: 'Нийтлэлийн ID байхгүй байна'
        })
      }

      await sql`
        UPDATE articles
        SET
          title = ${article.title},
          author = ${article.author},
          category = ${article.category},
          content = ${article.content},
          status = ${article.status},
          date = ${article.date}
        WHERE id = ${article.id}
      `

      return res.status(200).json({
        message: 'Нийтлэл амжилттай засагдлаа! 🎉',
        article
      })
    }


    // =========================
    // DELETE - Нийтлэл устгах
    // =========================

    if (req.method === 'DELETE') {

      const id = req.body?.id

      if (!id) {
        return res.status(400).json({
          message: 'Нийтлэлийн ID байхгүй байна'
        })
      }

      await sql`
        DELETE FROM articles
        WHERE id = ${id}
      `

      return res.status(200).json({
        message: 'Нийтлэл амжилттай устгагдлаа! 🗑️'
      })
    }


    // =========================
    // БУСАД METHOD
    // =========================

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