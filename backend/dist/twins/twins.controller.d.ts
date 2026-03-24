import { TwinsService } from './twins.service';
export declare class TwinsController {
    private readonly twinsService;
    constructor(twinsService: TwinsService);
    findAll(): {
        message: string;
    };
}
