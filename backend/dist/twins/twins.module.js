"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinsModule = void 0;
const common_1 = require("@nestjs/common");
const twins_controller_1 = require("./twins.controller");
const twins_service_1 = require("./twins.service");
let TwinsModule = class TwinsModule {
};
exports.TwinsModule = TwinsModule;
exports.TwinsModule = TwinsModule = __decorate([
    (0, common_1.Module)({
        controllers: [twins_controller_1.TwinsController],
        providers: [twins_service_1.TwinsService]
    })
], TwinsModule);
//# sourceMappingURL=twins.module.js.map