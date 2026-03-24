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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwinsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const firebase_config_1 = require("../config/firebase.config");
let TwinsService = class TwinsService {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    findAll() {
        return { message: 'This will return all digital twins' };
    }
    async createTwin(createTwinDto) {
        console.log('Received twin data:', createTwinDto);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/generate-twin', createTwinDto));
            console.log('FastAPI response:', response.data);
            const twinDocument = {
                userInput: {
                    interests: createTwinDto.interests,
                    communicationStyle: createTwinDto.communicationStyle,
                    goals: createTwinDto.goals,
                    personality: createTwinDto.personality,
                },
                twinProfile: response.data.twinProfile,
                createdAt: new Date(),
            };
            const docRef = await firebase_config_1.db.collection('twins').add(twinDocument);
            console.log('Saved to Firestore with ID:', docRef.id);
            return {
                message: 'Twin created & stored successfully',
                twinId: docRef.id,
                data: response.data.twinProfile,
            };
        }
        catch (error) {
            console.error('Error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                return {
                    message: 'AI service unavailable',
                    error: 'FastAPI service is not running',
                };
            }
            return {
                message: 'Failed to create twin',
                error: error.message,
            };
        }
    }
};
exports.TwinsService = TwinsService;
exports.TwinsService = TwinsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], TwinsService);
//# sourceMappingURL=twins.service.js.map