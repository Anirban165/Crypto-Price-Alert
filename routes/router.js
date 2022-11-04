const router = require("express").Router();
const Controller = require("../controller/main");

router.get("/coin-prices", Controller.coinPrices);

router.get("/alerts", Controller.getAlerts);

router.post("/create-alert", Controller.createAlert);

router.delete("/delete-alerts/:id", Controller.deleteAlerts);


module.exports = router;
