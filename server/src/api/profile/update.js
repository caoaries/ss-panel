const _ = require('lodash')
const config = require('config')

const errors = require('../../lib/errors')
const userService = require('../../service/user')

const { minPort, maxPort } = config.get('ss')

module.exports = async (ctx) => {
  let { userId } = ctx.session.user

  let filter = ['port', 'password']
  let data = _.pick(ctx.request.body, filter)

  if (data.port && (data.port < minPort || data.port > maxPort)) {
    throw new errors.BadRequest(`端口号需在 ${minPort} - ${maxPort} 范围内`)
  }

  try {
    ctx.body = await userService.updateAsync(userId, data)
  } catch (err) {
    throw new errors.BadRequest('修改失败，可能端口已存在')
  }
}
