const moment = require("moment");

module.exports = {
  format_date: (date) => {
    return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
  },

  commentDateFormat: (date, options) => {
    const formatToUse = (arguments[1] && arguments[1].hash && arguments[1].hash.format) || "MM/DD/YYYY"
    return moment(date).format(formatToUse);
  },
};
