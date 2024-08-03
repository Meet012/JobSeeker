function restrictToLoginUserOnly(req,res,next){
    if(!req.user){
        return res.redirect('/login');
    }

    if(req.user.role === "Jober"){
        return next();
    }
    return res.redirect('/');
} 

function restrictToUser(req,res,next){
    if(!req.user){
        return res.redirect('/login');
    }

    if(req.user.role === "User"){
        return next();
    }
    return res.redirect('/');
}

module.exports={restrictToLoginUserOnly,restrictToUser};