export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Нийтлэл авах API ажиллаж байна! 🎉',
      articles: []
    })
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      message: 'Нийтлэл хүлээж авлаа! 🎉',
      article: req.body
    })
  }

  return res.status(405).json({
    message: 'Энэ хүсэлтийг дэмжихгүй'
  })
}