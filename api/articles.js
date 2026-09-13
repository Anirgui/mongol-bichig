export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

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