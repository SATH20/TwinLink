"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const terminus_1 = require("@nestjs/terminus");
const core_1 = require("@nestjs/core");
const config_2 = require("./config");
const common_module_1 = require("./common/common.module");
const firebase_module_1 = require("./firebase/firebase.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const twins_module_1 = require("./modules/twins/twins.module");
const ai_module_1 = require("./modules/ai/ai.module");
const matching_module_1 = require("./modules/matching/matching.module");
const conversation_module_1 = require("./modules/conversation/conversation.module");
const compatibility_module_1 = require("./modules/compatibility/compatibility.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const health_controller_1 = require("./health.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [config_2.appConfig, config_2.firebaseConfig, config_2.redisConfig, config_2.aiServiceConfig, config_2.clerkConfig],
                envFilePath: ['.env', '.env.local'],
                expandVariables: true,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ([{
                        ttl: config.get('app.throttle.ttl', 60000),
                        limit: config.get('app.throttle.limit', 60),
                    }]),
            }),
            terminus_1.TerminusModule,
            common_module_1.CommonModule,
            firebase_module_1.FirebaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            ai_module_1.AiModule,
            twins_module_1.TwinsModule,
            matching_module_1.MatchingModule,
            conversation_module_1.ConversationModule,
            compatibility_module_1.CompatibilityModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map