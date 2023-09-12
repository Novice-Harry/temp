const timeout = 1000 * 10
let baseURL = ''
if (import.meta.env.MODE === 'development') {
  // baseURL = 'http://localhost:10086'
  baseURL = 'http://hylyoueryuan.v1.idcfengye.com'
} else if (import.meta.env.MODE === 'production') {
  baseURL = ''
}
export { timeout, baseURL }
