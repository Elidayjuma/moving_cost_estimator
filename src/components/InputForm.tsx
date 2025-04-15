"use client";

import React, { useState } from "react";
import { calculateEstimate } from "@/actions/calculate_estimate";
import CostEstimateCard, { EstimateObject } from "./CostEstimateCard"; // adjust the path accordingly


const InputForm: React.FC = () => {
    const [moveType, setMoveType] = useState<string>(""); // House, Office, or Luggage
    const [distance, setDistance] = useState<string>(""); // Distance in km
    const [weight, setWeight] = useState<string>(""); // Weight in kg (for luggage)
    const [roomCount, setRoomCount] = useState<string>(""); // Rooms for house or office move
    const [bulkItems, setBulkItems] = useState<string>(""); // Bulk items for house or office move
    const [packaging, setPackaging] = useState<boolean>(false); // Packaging required
    const [itemType, setItemType] = useState<string>(""); // Household or Appliance (if luggage)
    const [currency, setCurrency] = useState<string>("");
    const [fuelCost, setFuelCost] = useState<number>(165);
    const [vehicleFuelConsumption, setVehicleFuelConsumption] = useState<string>("");
    const [vehicleType, setVehicleType] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [estimateObject, setEstimateObject] = useState<object | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (Number(distance) <= 0 || (moveType === "luggage" && Number(weight) <= 0) || (moveType !== "luggage" && Number(roomCount) <= 0)) {
            setError("Please fill all the fields with valid values.");
            setLoading(false);
            return;
        }
        const costEstimate = await calculateEstimate({
            bulkItems,
            distance: Number(distance),
            itemType,
            moveType,
            packaging,
            roomCount: Number(roomCount),
            weight: Number(weight),
            currency,
            fuelCost,
            vehicleFuelConsumption: Number(vehicleFuelConsumption),
            vehicleType
        })

        if (!costEstimate) {
            setError("Failed to generate estimate. Try again.");
        }
        setEstimateObject(costEstimate)
        setLoading(false);
        console.log({
            bulkItems,
            distance,
            itemType,
            moveType,
            packaging,
            roomCount,
            weight,
            currency,
            fuelCost,
            vehicleFuelConsumption
        }, estimateObject)
    };

    return (
        <div className="mx-auto">
            {!estimateObject ? (
                <>
                    {/* Move Type Selection */}
                    < form onSubmit={handleSubmit} className="mb-4 max-w-md mx-auto">
                        <div className="relative mb-4">
                            <label htmlFor="move-type" className="block text-sm font-medium text-gray-700">
                                What are you moving?
                            </label>
                            <select
                                id="move-type"
                                value={moveType}
                                onChange={(e) => setMoveType(e.target.value)}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                required
                            >
                                <option value="">Select Move Type</option>
                                <option value="house">House</option>
                                <option value="office">Office</option>
                                <option value="luggage">Luggage</option>
                            </select>
                        </div>


                        {/* Luggage Item Type (only if moving luggage) */}
                        {moveType === "luggage" && (
                            <>
                                <div className="relative mb-4">
                                    <label htmlFor="item-type" className="block text-sm font-medium text-gray-700">
                                        Item Type
                                    </label>
                                    <select
                                        id="item-type"
                                        value={itemType}
                                        onChange={(e) => setItemType(e.target.value)}
                                        className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                        required
                                    >
                                        <option value="">Select Item Type</option>
                                        <option value="household">Household Item</option>
                                        <option value="appliance">Appliance</option>
                                        <option value="appliance">Other</option>
                                    </select>
                                </div>

                                <div className="relative mb-4">
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                        placeholder="Enter Weight"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {/* House or Office Move (Room count and Bulk items) */}
                        {moveType === "house" || moveType === "office" ? (
                            <>
                                <div className="relative mb-4">
                                    <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
                                        Number of Rooms
                                    </label>
                                    <input
                                        type="number"
                                        id="rooms"
                                        value={roomCount}
                                        onChange={(e) => setRoomCount(e.target.value)}
                                        className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                        placeholder="Enter Number of Rooms"
                                        required
                                    />
                                </div>

                                <div className="relative mb-4">
                                    <label htmlFor="bulk-items" className="block text-sm font-medium text-gray-700">
                                        List of Bulk Items (Optional)
                                    </label>
                                    <textarea
                                        id="bulk-items"
                                        value={bulkItems}
                                        onChange={(e) => setBulkItems(e.target.value)}
                                        className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                        placeholder="Enter bulk items (e.g., Furniture, Electronics)"
                                    />
                                </div>
                            </>
                        ) : null}

                        {/* Distance */}
                        <div className="relative mb-4">
                            <label htmlFor="distance" className="block text-sm font-medium text-gray-700">
                                Distance (km)
                            </label>
                            <input
                                type="number"
                                id="distance"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                placeholder="Enter Distance"
                                required
                            />
                        </div>

                        {/* Fuel Cost */}
                        <div className="relative mb-4">
                            <label htmlFor="fuel-cost" className="block text-sm font-medium text-gray-700">
                                Fuel Cost per Liter ({/* you can show currency here if you add a currency field later */})
                            </label>
                            <input
                                type="number"
                                id="fuel-cost"
                                value={fuelCost}
                                onChange={(e) => setFuelCost(Number(e.target.value))}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                placeholder="Enter Fuel Cost"
                                required
                            />
                        </div>

                        {/* Fuel Consumption per liter*/}
                        <div className="relative mb-4">
                            <label htmlFor="fuel-consumption" className="block text-sm font-medium text-gray-700">
                                Vehicle Fuel Consumption (km per liter)
                            </label>
                            <input
                                type="number"
                                id="fuel-consumption"
                                value={vehicleFuelConsumption}
                                onChange={(e) => setVehicleFuelConsumption(e.target.value)}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                placeholder="e.g., 10 "
                                required
                            />
                        </div>

                        {/* Vehicle Type */}
                        <div className="relative mb-4">
                            <label htmlFor="vehicle-type" className="block text-sm font-medium text-gray-700">
                                Select Vehicle Type
                            </label>
                            <select
                                id="vehicle-type"
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                required
                            >
                                <option value="">Choose a vehicle</option>
                                <option value="pickup">Pickup</option>
                                <option value="medium">Medium Lorry</option>
                                <option value="big">Big Lorry</option>
                            </select>
                        </div>

                        {/* Currency Selection */}
                        <div className="relative mb-4">
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                Select Currency
                            </label>
                            <select
                                id="currency"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg"
                                required
                            >
                                <option value="">Choose currency</option>
                                <option value="KES">KES - Kenyan Shilling</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                                {/* Add more if needed */}
                            </select>
                        </div>


                        {/* Packaging Required */}
                        <div className="relative mb-4">
                            <label htmlFor="packaging" className="flex items-center text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    id="packaging"
                                    checked={packaging}
                                    onChange={(e) => setPackaging(e.target.checked)}
                                    className="mr-2"
                                />
                                Packaging Required (Plus Extra Care)
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        >
                            {loading ? "Getting Estimate..." : "Get Estimate"}
                        </button>
                    </form>


                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </>
            ) : (

                <CostEstimateCard
                    estimate={estimateObject as EstimateObject}
                    onBack={() => setEstimateObject(null)} />
            )}

        </div >
    );
};

export default InputForm;
