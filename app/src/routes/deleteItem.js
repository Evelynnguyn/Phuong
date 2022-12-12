const db = require('../persistence');

module.exports = async (req, res) => {
    await db.removeItem(req.params.code);
    res.sendStatus(200);
};
