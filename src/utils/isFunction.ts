
import isObject from './isObject';
import getTag from './getTag';

const isFunction = (value: any): value is Function => {
  if (!isObject(value)) {
    return false;
  }

  const tag = getTag(value);
  return (
    tag === '[object Function]'
    || tag === '[object AsyncFunction]'
    || tag === '[object GeneratorFunction]'
    || tag === '[object Proxy]'
  )
}

export default isFunction;
