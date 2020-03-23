import request from '../utils/request'

const test = () => {
  return request('https://www.baidu.com', { method: 'GET' }, { withToken: false })
}

export default {
  test
}