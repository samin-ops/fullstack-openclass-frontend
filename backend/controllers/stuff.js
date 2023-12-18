
const Thing = require('../Models/Thing')
const fs = require('fs')


exports.createThing = (req, res, _next) => {
    const thingObject = JSON.parse(req.body.thing)//
    delete thingObject._id
    delete thingObject._userId
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    thing.save()
        .then(() => res.status(201).json({ msg: "Objet cree avec success." }))
        .catch(error => res.status(400).json({ error }))
};


exports.modifiedThing = (req, res, _next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete thingObject._userId
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({
                    msg: "Non authorize"
                })
            } else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => { res.status(200).json({ msg: "Objet modifie avec succes" }) })
                    .catch(error => { res.status(401).json({ error }) })
            }
        })
        .catch(error => res.status(400).json({ error: error }))
};



exports.deleteThing = (req, res, _next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: "non autorise" })
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ msg: "Objet supprime." }) })
                        .catch(error => { res.status(401).json({ error }) })
                })
            }
        })
        .catch(error => { res.status(400).json({ error }) })
}


exports.getOnThingById = (req, res, _next) => {
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(400).json({ error }))
};


exports.GetAllThings = (_req, res, _next) => {
    Thing.find()
        .then((things) => res.status(201).json(things))
        .catch(error => res.status(400).json({ error }))
}