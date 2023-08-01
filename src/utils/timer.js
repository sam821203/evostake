/**顯示剩餘時間 */
export const displayTimeLeft = (secondsLeft) => {
  const hours = zeroPadded(Math.floor(secondsLeft / 3600));
  const minutes = zeroPadded(Math.floor((secondsLeft % 3600) / 60));
  const seconds = zeroPadded(secondsLeft % 60);
  /**剩餘時間 */
  let timeLeft = "00:00:00";
  timeLeft = `${hours}:${minutes}:${seconds}`;
  return timeLeft;
};

/**數字轉換 4 --> 04 */
export const zeroPadded = (num) => {
  return num < 10 ? `0${num}` : num;
};
