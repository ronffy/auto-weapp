
function isObject(value: any): value is object
function isObject(value: any): value is Function
function isObject(value: any) {
  const type = typeof value;
  return value !== null && (type === 'object' || type === 'function')
}

export default isObject;
