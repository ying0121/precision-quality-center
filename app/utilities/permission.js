
const sequelize = require("sequelize")
const Permission = require("../models/settings/Permission")
const RolePermission = require("../models/settings/RolePermission")

exports.checkPermission = async (role_id, name, permission_type) => {
    // get permission id
    const permission = await Permission.findOne({ where: { name: name } })
    if (permission == undefined || permission == null) {
        return false
    } else {
        // get permission for the role
        const role_permission = await RolePermission.findOne({ where: { role_id: role_id, permission_id: permission.id } })

        // check permission
        if (role_permission == undefined || role_permission == null) {
            return false
        } else {
            const value = role_permission.value

            if (value == null || value == undefined || value == 1) {
                return false
            } else {
                if (value % permission_type == 0) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
}

exports.getRolePermissionByRoleId = async role_id => {
    try {
        const role_permission = await RolePermission.findAll({
            include: [{
                model: Permission,
                required: false,
                attributes: ['name']
            }]
        })

        let rp = []
        role_permission.forEach(item => {
            if (item.permission) {
                rp[item.permission.name] = []
                rp[item.permission.name]['c'] = item.value % 2 === 0
                rp[item.permission.name]['r'] = item.value % 3 === 0
                rp[item.permission.name]['u'] = item.value % 5 === 0
                rp[item.permission.name]['d'] = item.value % 7 === 0
            }
        })

        return rp
    } catch (error) {
        console.log(error)
        return []
    }
}
