const db = require('../persistence');

module.exports = async (req, res) => {
    await db.updateItem(req.params.code, {
        quantity: req.body.quantity,
    });
    const item = await db.getItem(req.params.code);
    res.send(item);
};
