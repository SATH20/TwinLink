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
}
