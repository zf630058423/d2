const proxyOrgin = {
  ws: true,
  changeOrigin: true,  //是否开启跨域
  logLevel: 'debug',
};

const pathRewriteFun = (api, val) => {
  return {
    [`^/${api}`]: val || ''
  }
}

module.exports = {
  proxy: {
    "^/api": {
      target: "http://192.168.2.175:8080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('api', ''),
    },
    "^/ggm": {
      target: "http://192.168.10.49:18080", //张琪ip
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('ggm'),
    },
    "^/fyl": {
      target: "http://192.168.10.163:18080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('fyl'),
    },
    "^/yl": {
      target: "http://192.168.10.176:18080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('yl'),
    },
    "^/jm": {
      target: "http://192.168.12.48:18080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('jm'),
    },
    "^/zq": {
      target: "http://192.168.10.210:18080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('zq'),
    },
    "^/lf": {
      target: "http://192.168.10.203:18080",
      ...proxyOrgin,
      pathRewrite: pathRewriteFun('lf'),
    }
  }
}
