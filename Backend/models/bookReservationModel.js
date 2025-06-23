const { sql } = require('../dbConnection');

// Gauti galimas datas ekskursijai
exports.getTourDates = async (tour_id) => {
  const dates = await sql`
    SELECT * FROM tour_dates WHERE tour_id = ${tour_id} ORDER BY tour_date ASC
  `;
  return dates;
};
