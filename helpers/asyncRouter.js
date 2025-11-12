const express = require('express')
const asyncHandler = require('../middlewares/asyncHandler')

function asyncRouter (options = {}) {
    const router = express.Router(options)

    const methods = ['get', 'post', 'put', 'patch', 'delete']
    methods.forEach((method) => {
    const original = router[method]
    router[method] = (path, ...handlers) => {
      original.call(
        router,
        path,
        ...handlers.map((fn) =>
          typeof fn === 'function' && fn.constructor.name === 'AsyncFunction'
            ? asyncHandler(fn)
            : fn
        )
      )
    }
  })

    return router
}

module.exports = asyncRouter