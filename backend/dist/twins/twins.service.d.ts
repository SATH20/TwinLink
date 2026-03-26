import { HttpService } from '@nestjs/axios';
import { CreateTwinDto } from './dto/create-twin.dto';
export declare class TwinsService {
    private readonly httpService;
    constructor(httpService: HttpService);
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
    getTopMatches(currentTwinId: string): Promise<{
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
