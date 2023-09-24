"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../controllers");
const { updateFitState, createFit, filterFits } = controllers_1.FitController;
const fitRouter = (0, express_1.Router)();
exports.default = (app) => {
    app.use('/fit', fitRouter);
    //create fit
    fitRouter.route('/create').post(createFit);
    //filter fits
    fitRouter.route('/filter/:status').get(filterFits);
    //update fit state
    fitRouter.route('/update-state').put(updateFitState);
    return app;
};
//# sourceMappingURL=index.js.map