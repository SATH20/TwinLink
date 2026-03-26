import { TwinsService } from './twins.service';
import { CreateTwinDto } from './dto/create-twin.dto';
export declare class TwinsController {
    private readonly twinsService;
    constructor(twinsService: TwinsService);
    findAll(): {
        message: string;
    };
    createTwin(createTwinDto: CreateTwinDto): Promise<{
        message: string;
        twinId: string;
        data: any;
        error?: undefined;
    } | {
        message: string;
        error: any;
        twinId?: undefined;
        data?: undefined;
    }>;
    getTopMatches(id: string): Promise<{
        message: string;
        matches: never[];
        currentTwinId?: undefined;
        error?: undefined;
    } | {
        message: string;
        currentTwinId: string;
        matches: any;
        error?: undefined;
    } | {
        message: string;
        error: any;
        matches?: undefined;
        currentTwinId?: undefined;
    }>;
    getUserByUserId(userId: string): Promise<{
        message: string;
        twinId: null;
        category?: undefined;
        email?: undefined;
        error?: undefined;
    } | {
        message: string;
        twinId: any;
        category: any;
        email: any;
        error?: undefined;
    } | {
        message: string;
        error: any;
        twinId: null;
        category?: undefined;
        email?: undefined;
    }>;
}
