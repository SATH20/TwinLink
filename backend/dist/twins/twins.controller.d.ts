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
        data: any;
        error?: undefined;
    } | {
        message: string;
        error: any;
        data?: undefined;
    }>;
}
