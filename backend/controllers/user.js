const bcrypt = require('bcrypt')
const User = require('../Models/user.js')
const jwt = require('jsonwebtoken')

exports.signup = (req, res, _next) =>{
    bcrypt.hash(req.body.password, 10)// on hash le password d'abord
    .then(hash=>{
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save()
        .then(()=>res.status(201).json({msg:"Utilisateur cree"}))
        .catch(error=>res.status(400).json({error}))
    })
    .catch(error=>res.status(500).json({error}))

}

exports.login = (req, res, _next)=>{
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user==null){
            res.status(401).json({msg: "Email ou Mot de passe incorect."})
        }else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid=>{
                if(!valid){
                    res.status(401).json({msg: "Email ou Mot de passe incorect."})
                }else{
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_SECRET_TOKEN',
                            {expiresIn:'24h'}
                        )
                    })
                }
            })
            .catch(error=>res.status(500).json({error}))
        }
    })
    .catch(error=>res.status(500).json({error}))

}