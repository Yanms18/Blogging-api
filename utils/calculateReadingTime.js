const calculateReadingTime = (text) => {
  const wordsPerMinute = 200; // Average case.
  const noOfWords = text.split(/\s/g).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return readTime;
};

export default calculateReadingTime;