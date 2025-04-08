import { FaTruck, FaBoxes, FaCalculator } from "react-icons/fa";

const FeatureCards = () => {
    const features = [
        {
            icon: <FaTruck className="text-blue-600 text-xl" />,
            title: "Accurate Estimates",
            description: "Get a detailed estimate based on distance, vehicle type, and item size."
        },
        {
            icon: <FaBoxes className="text-green-600 text-xl" />,
            title: "Itemized Breakdown",
            description: "See a clear breakdown of fuel, labor, and packaging costs."
        },
        {
            icon: <FaCalculator className="text-red-600 text-xl" />,
            title: "Smart Estimator",
            description: "Our tool factors in multiple variables to give you reliable pricing."
        },
    ];


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-10">
            {features.map((feature, index) => (
                <div key={index} className="p-4 bg-white shadow-md rounded-lg flex flex-col items-center">
                    <div className="flex items-center gap-2">
                        {feature.icon}
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-2 text-center">{feature.description}</p>
                </div>
            ))}
        </div>
    );
};

export default FeatureCards;
