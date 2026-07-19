const yts = require("yt-search");

async function searchYoutube(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Missing 'q' query parameter"
    });
  }

  try {
    const result = await yts(query);
    const videos = result.videos.slice(0, 15).map((v) => ({
      title: v.title,
      videoId: v.videoId,
      url: v.url,
      duration: v.timestamp,
      views: v.views,
      author: v.author.name,
      thumbnail: v.thumbnail,
      ago: v.ago
    }));

    return res.json({
      status: true,
      creator: "Starline | API by Edward",
      query,
      results: videos
    });
  } catch (err) {
    console.error("[Starline] YouTube search error:", err.message);
    return res.status(500).json({ status: false, message: "Search failed" });
  }
}

module.exports = { searchYoutube };