const jwt = require('../modules/jwt');

const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const authUtil = {
    checkToken: async (req, res, next) => {
        var token = req.headers.token;
        // 토큰 없음
        if (!token)
            return res.json("token does not exist");
        // decode
        const user = await jwt.verify(token);
        // 유효기간 만료
        if (user === TOKEN_EXPIRED)
            return res.json("tocken was expired");
        // 유효하지 않는 토큰
        if (user === TOKEN_INVALID)
            return res.json("token is not invalid");
        if (user.idx === undefined)
            return res.json("token is not invalid");
        req.idx = user.idx;
        next();
    }
}

module.exports = authUtil;