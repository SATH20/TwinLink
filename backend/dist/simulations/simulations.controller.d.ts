import { SimulationsService } from './simulations.service';
export declare class SimulationsController {
    private readonly simulationsService;
    constructor(simulationsService: SimulationsService);
    getSimulations(): {
        message: string;
    };
}
