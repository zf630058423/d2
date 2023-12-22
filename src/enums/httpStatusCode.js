// 1xx （临时响应）
// 表示临时响应并需要请求者继续执行操作的状态代码。

// 代码   说明
// 100   （继续） 请求者应当继续提出请求。 服务器返回此代码表示已收到请求的第一部分，正在等待其余部分。
// 101   （切换协议） 请求者已要求服务器切换协议，服务器已确认并准备切换。

// 2xx （成功）
// 表示成功处理了请求的状态代码。

// 代码   说明
// 200   （成功）  服务器已成功处理了请求。 通常，这表示服务器提供了请求的网页。
// 201   （已创建）  请求成功并且服务器创建了新的资源。
// 202   （已接受）  服务器已接受请求，但尚未处理。
// 203   （非授权信息）  服务器已成功处理了请求，但返回的信息可能来自另一来源。
// 204   （无内容）  服务器成功处理了请求，但没有返回任何内容。
// 205   （重置内容） 服务器成功处理了请求，但没有返回任何内容。
// 206   （部分内容）  服务器成功处理了部分 GET 请求。

// 3xx （重定向）
// 表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向。

// 代码   说明
// 300   （多种选择）  针对请求，服务器可执行多种操作。 服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择。
// 301   （永久移动）  请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。
// 302   （临时移动）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。
// 303   （查看其他位置） 请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。
// 304   （未修改） 自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。
// 305   （使用代理） 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。
// 307   （临时重定向）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。

// 4xx（请求错误）
// 这些状态代码表示请求可能出错，妨碍了服务器的处理。

// 代码   说明
// 400   （错误请求） 服务器不理解请求的语法。
// 401   （未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。
// 403   （禁止） 服务器拒绝请求。
// 404   （未找到） 服务器找不到请求的网页。
// 405   （方法禁用） 禁用请求中指定的方法。
// 406   （不接受） 无法使用请求的内容特性响应请求的网页。
// 407   （需要代理授权） 此状态代码与 401（未授权）类似，但指定请求者应当授权使用代理。
// 408   （请求超时）  服务器等候请求时发生超时。
// 409   （冲突）  服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息。
// 410   （已删除）  如果请求的资源已永久删除，服务器就会返回此响应。
// 411   （需要有效长度） 服务器不接受不含有效内容长度标头字段的请求。
// 412   （未满足前提条件） 服务器未满足请求者在请求中设置的其中一个前提条件。
// 413   （请求实体过大） 服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。
// 414   （请求的 URI 过长） 请求的 URI（通常为网址）过长，服务器无法处理。
// 415   （不支持的媒体类型） 请求的格式不受请求页面的支持。
// 416   （请求范围不符合要求） 如果页面无法提供请求的范围，则服务器会返回此状态代码。
// 417   （未满足期望值） 服务器未满足”期望”请求标头字段的要求。

// 5xx（服务器错误）
// 这些状态代码表示服务器在尝试处理请求时发生内部错误。 这些错误可能是服务器本身的错误，而不是请求出错。

// 代码   说明
// 500   （服务器内部错误）  服务器遇到错误，无法完成请求。
// 501   （尚未实施） 服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。
// 502   （错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。
// 503   （服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。
// 504   （网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求。
// 505   （HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。
const HTTP_STATUS_CODE = {
  CONTINUE: 100,
  SWITCHING_PROTOCOLS: 101,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NO_CONTENT: 204,
  RESET_CONTENT: 205,
  PARTIAL_CONTENT: 206,
  AMBIGUOUS: 300,
  MOVED: 301,
  REDIRECT: 302,
  REDIRECT_METHOD: 303,
  NOTMODIFIED: 304,
  USE_PROXY: 305,
  REDIRECT_KEEPVERB: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  REQUEST_ENTITY_TOO_LARGE: 413,
  REQUEST_URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
};

/**
 * 接口响应数据中的 code 对应的含义
 */
const RESPONSE_CODE = {
  SUCCESS: 200, // 请求成功
  UPGRADE: 100, // 升级
  UPGRADE_SET: 101, // 更新设置
  REDIRECT: 300, // 重定向
  NOT_LOGIN: 1000, // 认筹未登录
  ERROR: 1001, // 该请求无效，请稍后再试
  SERVICE_PAUSE: 1002, // 服务暂停
  SERVICE_BUSY: 1003, // 服务器忙
  INTERFACE_ERROR: 1004, // 接口不存在
  INTERFACE_TIMEOUT: 1005, // 接口超时
  ERR_CHECK_TEXT: 1006, // 文本不合法
  ERR_INVALID_REQUEST: 1007, // 请求无效
  AUTH_INFO_EMPTY: 1008, // 未获取到当前用户相关授权信息
  RATE_LIMIT: 1009, // 请求过于频繁，请稍后重试
  CAPTCHA_INTERVAL_EXPIRATION_TIME_ERROR: 1010, // 验证码发送频率过快
  RC_LOGIN_ERROR: 1010, // 您不在认筹名单内，无法登陆
  CAPTCHA_VALIDATION_ERROR: 1011, // 验证码有误
  OPENING_ACTIVITY_HAS_NOT_STARTED_ERROR: 1012, // 开盘活动未开始
  OPENING_OFFICIAL_RE_LOGIN: 1013, // 活动已经正式开始，请重新登陆签到
  OPENING_ACTIVITY_HAS_NOT_PUBLISH: 1014, // 开盘活动未发布
  OPENING_BETA_END_RE_LOGIN: 1015, // 公测结束，请重新登陆签到
  OPENING_NOT_SIGN_IN: 1016, // 您不需要签到
  OPENING_SIGN_IN_UNSUPPORTED: 1017, // 签到方式不支持
  OPENING_SIGN_IN_TRUE: 1018, // 您已经签到了
  OPENING_ACTIVITY_HAS_PUBLISH: 1019, // 操作限制，开盘已发布

  WRONG_ARGUMENT: 2002, // 参数错误
  EMPTY_PARAM: 2003, // 参数为空
  INSERT_ERROR: 2019, // 插入数据失败
  UPDATE_ERROR: 2020, // 更新数据失败
  DELETE_ERROR: 2021, // 删除数据失败
  REQUEST_FAIL: 2022, // 请求数据失败
  WRONG_EXCEL: 2002, // Excel导入错误
  EXT_SEND_SMS_ERROR: 3001, // 发送短信失败:%s
};

export { HTTP_STATUS_CODE, RESPONSE_CODE };
