const MovieStats = require("../models/movieStats.models");

async function getStats(req, res) {
  try {
    const stats = await MovieStats.getMovieStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thống kê phim" });
  }
}
module.exports = {
  getStats,
};
