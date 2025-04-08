export type EstimateObject = {
    cost: number,
    breakdown: Record<string, number>;
    currency: string;
};

export const calculateEstimate = async ({
    bulkItems,
    distance,
    itemType,
    moveType,
    packaging,
    roomCount,
    weight,
    currency,
    fuelCost,
    vehicleFuelConsumption,
    vehicleType,
}: {
    bulkItems?: string;
    distance: number;
    itemType?: string;
    moveType: string;
    packaging: boolean;
    roomCount?: number;
    weight?: number;
    currency: string;
    fuelCost: number;
    vehicleFuelConsumption: number;
    vehicleType: string;
}): Promise<EstimateObject> => {
    // Determine vehicle rate per km
    let vehicleRate = 0;
    switch (vehicleType) {
        case "pickup":
            vehicleRate = 70;
            break;
        case "medium":
            vehicleRate = 150;
            break;
        case "big":
            vehicleRate = 200;
            break;
        default:
            vehicleRate = 50;
    }

    // Vehicle transport cost (one way)
    const vehicleCost = distance * vehicleRate;

    // Fuel cost (round trip)
    const roundTripDistance = distance * 2;
    const fuelNeeded = roundTripDistance / vehicleFuelConsumption;
    const fuelTotalCost = fuelNeeded * fuelCost;

    // Labor cost estimation
    let laborers = 1;
    if (moveType === "house" || moveType === "office") {
        laborers = roomCount ? roomCount : 1;
    } else if (moveType === "luggage" && weight) {
        laborers = weight > 49 ? 2 : 1;
    }

    const laborCostPerPerson = packaging ? 1500 : 1000;
    const laborCost = laborers * laborCostPerPerson;

    // Optional: Packaging cost (flat rate or percentage)
    const packagingCost = packaging ? 500 : 0;

    const breakdown: Record<string, number> = {
        VehicleTransport: vehicleCost,
        Fuel: Math.round(fuelTotalCost),
        Labor: laborCost,
    };

    if (packagingCost > 0) breakdown["Packaging"] = packagingCost;

    const totalCost = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return {
        cost: totalCost,
        currency,
        breakdown,
    };
};
