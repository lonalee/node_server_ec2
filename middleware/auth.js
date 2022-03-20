module.exports = {
    ensureAuth: (req, res, next) => {
        // return next()
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect('/')
        }
    },
    ensureGuest: (req, res, next) => {
        // res.redirect('/dashboard')
        if(req.isAuthenticated()) {
            res.redirect('/dashboard')
        } else {
            return next()
        }
    }
}