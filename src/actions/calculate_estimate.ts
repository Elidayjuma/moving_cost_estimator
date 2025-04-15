export type EstimateObject = {
    cost: number;
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
    fuelCost: number; // This is assumed to be already in the user's selected currency
    vehicleFuelConsumption: number;
    vehicleType: string;
}): Promise<EstimateObject> => {
    // Currency conversion rates (from KES to target)
    const conversionRates: Record<string, number> = {
        KES: 1,
        USD: 1 / 130,
        EUR: 1 / 140,
    };

    const rate = conversionRates[currency] ?? 1;

    // Vehicle rates in KES, converted to user's currency
    const vehicleRatesKES: Record<string, number> = {
        pickup: 70,
        medium: 150,
        big: 200,
        default: 50,
    };

    const vehicleRateKES = vehicleRatesKES[vehicleType] ?? vehicleRatesKES["default"];
    const vehicleRate = vehicleRateKES * rate;

    // Vehicle transport cost (with tiered discount logic after 100km)
let vehicleCost = 0;
let remainingDistance = distance;
let segmentIndex = 0;

while (remainingDistance > 0) {
    const segmentDistance = Math.min(100, remainingDistance);
    const segmentRate = vehicleRate * Math.pow(0.6, segmentIndex);
    vehicleCost += segmentDistance * segmentRate;
    remainingDistance -= segmentDistance;
    segmentIndex++;
}


    // Apply minimum vehicle cost per type (in KES, convert to target currency)
    const minVehicleCostKES: Record<string, number> = {
        pickup: 1500,
        medium: 2000,
        big: 3000,
    };
    const minCostKES = minVehicleCostKES[vehicleType];
    const minCost = minCostKES ? minCostKES * rate : 0;

    if (vehicleCost < minCost) {
        vehicleCost = minCost;
    }

    // Fuel cost (round trip) — fuelCost is already in the correct currency
    const roundTripDistance = distance * 2;
    const fuelNeeded = roundTripDistance / vehicleFuelConsumption;
    const flatExtraFuelCost = 200 * rate; // convert KES 200 to target currency
    const fuelTotalCost = flatExtraFuelCost + fuelNeeded * fuelCost;

    // Labor calculation
    let laborers = 1;
    if (moveType === "house" || moveType === "office") {
        laborers = roomCount || 1;
    } else if (moveType === "luggage" && weight) {
        laborers = weight > 49 ? 2 : 1;
    }

    const laborCostPerPerson = (packaging ? 1500 : 1000) * rate;
    const laborCost = laborers * laborCostPerPerson;

    // Packaging cost
    const packagingCost = packaging ? 1000 * laborers * rate : 0;

    // Breakdown
    const breakdown: Record<string, number> = {
        VehicleTransport: Math.round(vehicleCost),
        Fuel: Math.round(fuelTotalCost),
        Labor: Math.round(laborCost),
    };

    if (packagingCost > 0) breakdown["Packaging"] = Math.round(packagingCost);

    const totalCost = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

    return {
        cost: Math.round(totalCost),
        currency,
        breakdown,
    };
};
