const { validateToken } = require("../services/auth");

function checkCookie(token){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[token];
        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayLoad = validateToken(tokenCookieValue);
            req.user = userPayLoad
        } catch (error) {}
        return next();
    }
}

module.exports = {checkCookie};