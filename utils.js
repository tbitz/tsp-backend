function isEmpty(obj) {
  return !(() => {
    for (const i in obj) {
      return true;
    }
    return false;
  })();
}

const getTimeFromString = (str) => new Date(str).getTime();
const getDateFromString = (str) => new Date(str).toLocaleDateString();

function dateDiffMinutes(str1, str2) {
  const start = getTimeFromString(str1);
  const end = getTimeFromString(str2);
  console.log(str1, str2);
  return Math.round((end - start) / (1000 * 60));
}

module.exports = { isEmpty, dateDiffMinutes, getDateFromString };
