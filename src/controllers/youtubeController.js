const { Innertube } = require("youtubei.js");

// Se crea una sola vez y se reutiliza entre requests (crear una sesión por
// cada búsqueda es lento e innecesario).
let ytClient = null;
async function getClient() {
  if (!ytClient) {
    ytClient = await Innertube.create();
  }
  return ytClient;
}

// Los campos de youtubei.js a veces vienen como string y a veces como
// objeto { text: "..." }, esto normaliza cualquiera de los dos casos.
function text(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "text" in value) return value.text;
  return String(value);
}

async function searchYoutube(req, res) {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      status: false,
      message: "Falta el parámetro 'q'"
    });
  }

  try {
    const yt = await getClient();
    const search = await yt.search(query, { type: "video" });

    const videos = (search.videos || [])
      .filter((v) => v.type === "Video")
      .slice(0, 15)
      .map((v) => ({
        title: text(v.title),
        videoId: v.id,
        url: `https://youtube.com/watch?v=${v.id}`,
        duration: text(v.duration),
        views: text(v.view_count) || text(v.short_view_count),
        author: text(v.author?.name),
        thumbnail: v.thumbnails?.[v.thumbnails.length - 1]?.url || v.thumbnails?.[0]?.url || null,
        published: text(v.published)
      }));

    return res.json({
      status: true,
      creator: "Starline | API by Edward",
      query,
      total: videos.length,
      results: videos
    });
  } catch (err) {
    console.error("[Starline] Error en búsqueda de YouTube:", err.message);
    // Si la sesión de Innertube se corrompió, se descarta para que el
    // siguiente intento cree una nueva.
    ytClient = null;
    return res.status(500).json({
      status: false,
      message: "No se pudo completar la búsqueda",
      error: err.message
    });
  }
}

module.exports = { searchYoutube };