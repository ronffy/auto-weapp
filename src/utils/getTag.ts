
const getTag = (value: any): string => {
  return Object.prototype.toString.call(value)
}

export default getTag;
