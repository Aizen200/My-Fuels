const User = require("../schema/user");

const rbac = async (req, res, next) => {
    try {
        let role = req.user.role;
        if (!role && req.user.id) {
            const user = await User.findById(req.user.id);
            if (user) role = user.roles;
        }
        if (role !== "admin") {
            return res.status(403).json("Access denied");
        }
        next();
    } catch (err) {
        return res.status(500).json("Server error in RBAC");
    }
};

module.exports = rbac;