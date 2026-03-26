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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/generate-twin', {
                interests: createTwinDto.interests,
                communicationStyle: createTwinDto.communicationStyle,
                goals: createTwinDto.goals,
                personality: createTwinDto.personality,
            }));
            console.log('FastAPI response:', response.data);
            const twinDocument = {
                userId: createTwinDto.userId,
                category: createTwinDto.category,
                userInput: {
                    interests: createTwinDto.interests,
                    communicationStyle: createTwinDto.communicationStyle,
                    goals: createTwinDto.goals,
                    personality: createTwinDto.personality,
                },
                twinProfile: response.data.twinProfile,
                createdAt: new Date(),
            };
            const twinRef = await firebase_config_1.db.collection('twins').add(twinDocument);
            const twinId = twinRef.id;
            console.log('Saved twin to Firestore with ID:', twinId);
            const userDoc = await firebase_config_1.db.collection('users').doc(createTwinDto.userId).get();
            if (userDoc.exists) {
                await firebase_config_1.db.collection('users').doc(createTwinDto.userId).update({
                    twinId: twinId,
                    category: createTwinDto.category,
                    updatedAt: new Date(),
                });
                console.log('Updated existing user:', createTwinDto.userId);
            }
            else {
                await firebase_config_1.db.collection('users').doc(createTwinDto.userId).set({
                    userId: createTwinDto.userId,
                    email: createTwinDto.email,
                    twinId: twinId,
                    category: createTwinDto.category,
                    createdAt: new Date(),
                });
                console.log('Created new user:', createTwinDto.userId);
            }
            return {
                message: 'Twin created & stored successfully',
                twinId: twinId,
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
    async getTopMatches(currentTwinId) {
        console.log('Finding matches for twin:', currentTwinId);
        try {
            const currentTwinDoc = await firebase_config_1.db.collection('twins').doc(currentTwinId).get();
            if (!currentTwinDoc.exists) {
                return {
                    message: 'Twin not found',
                    error: 'The specified twin ID does not exist',
                };
            }
            const currentTwin = {
                id: currentTwinDoc.id,
                ...currentTwinDoc.data(),
            };
            const snapshot = await firebase_config_1.db
                .collection('twins')
                .where('category', '==', currentTwin.category)
                .get();
            if (snapshot.empty) {
                return {
                    message: 'No twins found in database',
                    matches: [],
                };
            }
            const otherTwins = snapshot.docs
                .map(doc => ({
                id: doc.id,
                ...doc.data(),
            }))
                .filter(twin => twin.id !== currentTwinId);
            if (otherTwins.length === 0) {
                return {
                    message: 'No other twins available for matching',
                    matches: [],
                };
            }
            const matchRequest = {
                twin1: currentTwin.twinProfile,
                twins: otherTwins.map(twin => ({
                    id: twin.id,
                    ...twin.twinProfile,
                })),
            };
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post('http://localhost:8000/match-twins', matchRequest));
            console.log('Matching results:', response.data);
            const topMatches = response.data.matches.slice(0, 5);
            return {
                message: 'Top matches found successfully',
                currentTwinId: currentTwinId,
                matches: topMatches,
            };
        }
        catch (error) {
            console.error('Matching error:', error.message);
            if (error.code === 'ECONNREFUSED') {
                return {
                    message: 'AI service unavailable',
                    error: 'FastAPI service is not running',
                };
            }
            return {
                message: 'Failed to find matches',
                error: error.message,
            };
        }
    }
    async getUserByUserId(userId) {
        console.log('Checking user:', userId);
        try {
            const userDoc = await firebase_config_1.db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                return {
                    message: 'User not found',
                    twinId: null,
                };
            }
            const userData = userDoc.data();
            return {
                message: 'User found',
                twinId: userData?.twinId || null,
                category: userData?.category || null,
                email: userData?.email || null,
            };
        }
        catch (error) {
            console.error('Error fetching user:', error.message);
            return {
                message: 'Failed to fetch user',
                error: error.message,
                twinId: null,
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