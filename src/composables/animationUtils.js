// file: src/animationUitls.js
export const randomDelay = () => {
  const maxDelay = 500; // 最大延迟，可以根据需要进行调整
  return Math.floor(Math.random() * maxDelay);
};
