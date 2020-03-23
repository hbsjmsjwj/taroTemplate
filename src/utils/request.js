import Taro from '@tarojs/taro'
import { stringify } from 'query-string'

const CODE_MESSAGE = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
}

const defaultOptions = {
  method: 'POST',
  credentials: 'same-origin',
  headers: {},
  codeMessage: CODE_MESSAGE,
  fallbackErrorText: '未知错误',
}

export default function(url, options = {}, opts = {}) {
  const { withToken = true, showError = true } = opts
  const newOptions = {
    ...options,
    headers: { ...options.headers }
  }

  if (withToken) {
    // const auth = await (getAuthorizationSync() || getAuthorization())
    // if (auth) newOptions.headers.Authorization = auth
  }

  return request(url, newOptions)
    .catch(error => {
      showError && console.error('[request error]')
      showError && console.error(error)
      throw error
    })

}

function request(url, options = defaultOptions) {
  const mixedOptions = { ...defaultOptions, ...options }
  mixedOptions.headers = {
    ...options.headers,
    'Accept': 'application/json'
  }

  if (mixedOptions.method && ['POST', 'PUT', 'DELETE'].includes(mixedOptions.method)) {
    if('FormData' in window && mixedOptions.body instanceof FormData) {
      mixedOptions.headers['Content-Type'] = 'multipart/form-data'
    } else if (mixedOptions.useFormUrlencoded === true) {
      mixedOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
      mixedOptions.body = mixedOptions.body ? stringify(mixedOptions.body) : ''
    } else {
      mixedOptions.headers['Content-Type'] = 'application/json; charset=utf-8'
      mixedOptions.body = mixedOptions.body ? JSON.stringify(mixedOptions.body) : null
    }
  } else if(mixedOptions.method === 'GET') {
    url += (mixedOptions.body && Object.keys(mixedOptions.body).length) ? `?${stringify(mixedOptions.body)}` : ''
    delete mixedOptions.body
  }

  return Taro.request({
    url,
    data: mixedOptions.body,
    header: mixedOptions.headers,
    method: mixedOptions.method,
    dataType: 'json',
  })
    .then(res => checkStatus(res, mixedOptions)) // res = { data, statusCode, header }
    .then(res => checkRes(res.data))
}

function checkStatus(res, options)  {
  const { statusCode } = res
  if (statusCode >= 200 && statusCode < 300) {
    return res
  }

  const { codeMessage, fallbackErrorText } = options
  const errortext = codeMessage ? codeMessage[statusCode] : fallbackErrorText
  const error = new Error(errortext)

  error.name = statusCode.toString()
  error.response = res
  throw error
}

function checkRes(result) {
  if (typeof result !== 'object') return result

  if (!('success' in result)) return result
  if (!result.success) {
    throw new Error(result.message)
  }
  if (result.json) {
    return JSON.parse(result.json)
  } else if (result.__abp) {
    return result.result
  } else if (result.data) {
    return result.data
  } else {
    return result
  }
}


