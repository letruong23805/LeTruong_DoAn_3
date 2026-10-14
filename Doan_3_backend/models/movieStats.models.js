const db = require("../common/ketnoimysql");

async function getMovieStats() {
  const [rows] = await db.query("SELECT * FROM MovieStats LIMIT 1");

  // Nếu chưa có record, trả về mặc định
  if (rows.length === 0) {
    return { id: 0, released: 0, upcoming: 0, total: 0 };
  }

  return rows[0];
}

module.exports = {
  getMovieStats,
};
