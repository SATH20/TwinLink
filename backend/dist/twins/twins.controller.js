"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinsController = void 0;
const common_1 = require("@nestjs/common");
const twins_service_1 = require("./twins.service");
const create_twin_dto_1 = require("./dto/create-twin.dto");
let TwinsController = class TwinsController {
    twinsService;
    constructor(twinsService) {
        this.twinsService = twinsService;
    }
    findAll() {
        return this.twinsService.findAll();
    }
    createTwin(createTwinDto) {
        return this.twinsService.createTwin(createTwinDto);
    }
    getTopMatches(id) {
        return this.twinsService.getTopMatches(id);
    }
    getUserByUserId(userId) {
        return this.twinsService.getUserByUserId(userId);
    }
};
exports.TwinsController = TwinsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwinsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_twin_dto_1.CreateTwinDto]),
    __metadata("design:returntype", void 0)
], TwinsController.prototype, "createTwin", null);
__decorate([
    (0, common_1.Get)('matches/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TwinsController.prototype, "getTopMatches", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TwinsController.prototype, "getUserByUserId", null);
exports.TwinsController = TwinsController = __decorate([
    (0, common_1.Controller)('twin'),
    __metadata("design:paramtypes", [twins_service_1.TwinsService])
], TwinsController);
//# sourceMappingURL=twins.controller.js.map