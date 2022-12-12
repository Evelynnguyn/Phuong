const db = require('../persistence');
const {v4 : uuid} = require('uuid');

module.exports = async (req, res) => {
    const item = {
        name: req.body.name,
        code: req.body.code,
        quantity: req.body.quantity
    };

    await db.storeItem(item);
    res.send(item);
};
