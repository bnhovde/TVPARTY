const generateGameCode = function generateGameCode() {
  const list = 'ABCDEFGHIJKLMNPQRSTUVWXY';
  let res = '';
  for (let i = 0; i < 4; i += 1) {
    const random = Math.floor(Math.random() * list.length);
    res += list.charAt(random);
  }
  return res;
};

/**
 * @param   {object} Object to process
 * @returns {string} First key of object
 */
const firstObjKey = function firstObjKey(object) {
  return Object.keys(object)[0];
};

/**
 * @desc    Checks if object is empty
 * @param   {object} Object to process
 * @returns {bool} true if empty
 */
const checkObjEmpty = function checkObjEmpty(object) {
  return Object.keys(object).length === 0 && object.constructor === Object;
};

const delay = time => new Promise(res => setTimeout(() => res(), time));

export { generateGameCode, firstObjKey, checkObjEmpty, delay };
