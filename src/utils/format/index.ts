// 一些格式化函数
// 格式化时间
const timeFormater = (val: string) => {
  const now = new Date(val)
  const year = now.getFullYear()
  const month = now.getMonth() + 1

  const day = now.getDate()

  return (
    year +
    '-' +
    (month < 10 ? '0' + month : month + '') +
    '-' +
    (day < 10 ? '0' + day : day + '')
  )
}

export { timeFormater }
