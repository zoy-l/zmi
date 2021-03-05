var formatTime = function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return "".concat([year, month, day].map(formatNumber).join('/'), " ").concat([hour, minute, second].map(formatNumber).join(':'));
};

var formatNumber = function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0".concat(n);
};

module.exports = {
  formatTime: formatTime
};