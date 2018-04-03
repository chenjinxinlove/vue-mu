
export const shuffle = ([...arr]) => {
  let _arr = arr.slice()
  let m = _arr.length
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [_arr[m], _arr[i]] = [_arr[i], _arr[m]]
  }
  return _arr
}

export function debounce(func, delay) {
  let timer = ''
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, ...args)
    }, delay)
  }
}