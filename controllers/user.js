const User = require('../models/user'); // DB

const follow = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } }); // 유저 정보 받기
        if (user) {
            await user.addFollowing(parseInt(req.params.id, 10)); // req.params.id로 유저 찾고 Follow
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = {
    follow
};