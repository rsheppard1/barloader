"use client"

import React, { useState } from 'react';

// Define plate types with weights, colors, and relative sizes
const plates = [
  { weight: 25, color: 'bg-red-600', size: 100 },
  { weight: 20, color: 'bg-blue-600', size: 95 },
  { weight: 15, color: 'bg-yellow-500', size: 90 },
  { weight: 10, color: 'bg-green-600', size: 85 },
  { weight: 5, color: 'bg-zinc-100 border-2', size: 80 },
  { weight: 2.5, color: 'bg-zinc-900', size: 75 },
  { weight: 1.25, color: 'bg-zinc-500', size: 70 },
];

const barWeights = [15, 20];

const Loader = () => {
  const [barWeight, setBarWeight] = useState(20);
  const [useCollars, setUseCollars] = useState(false);
  const [targetWeight, setTargetWeight] = useState('');
  const [loadedPlates, setLoadedPlates] = useState<number[]>([]);

  const calculatePlates = (weight: number) => {
    const targetPlateWeight = weight - barWeight - (useCollars ? 5 : 0);
    if (targetPlateWeight < 0) return [];
    
    const result: number[] = [];
    let remainingWeight = targetPlateWeight / 2; // divide by 2 since we need plates for both sides

    plates.forEach(plate => {
      while (remainingWeight >= plate.weight) {
        result.push(plate.weight);
        remainingWeight -= plate.weight;
      }
    });

    return result.sort((a, b) => b - a); // Sort plates largest to smallest
  };

  const handleWeightInput = (value: string) => {
    setTargetWeight(value);
    const numWeight = parseFloat(value);
    if (!isNaN(numWeight)) {
      setLoadedPlates(calculatePlates(numWeight));
    }
  };

  const addPlate = (weight: number) => {
    const newPlates = [...loadedPlates, weight].sort((a, b) => b - a); // Sort plates largest to smallest
    setLoadedPlates(newPlates);
    const totalWeight = barWeight + 
      (useCollars ? 5 : 0) + 
      (newPlates.reduce((a, b) => a + b, 0) * 2);
    setTargetWeight(totalWeight.toString());
  };

  const removePlate = (index: number) => {
    const newPlates = loadedPlates.filter((_, i) => i !== index);
    setLoadedPlates(newPlates);
    const totalWeight = barWeight + 
      (useCollars ? 5 : 0) + 
      (newPlates.reduce((a, b) => a + b, 0) * 2);
    setTargetWeight(totalWeight ? totalWeight.toString() : '');
  };

  const clearPlates = () => {
    setLoadedPlates([]);
    setTargetWeight('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plate Calculator (kg)</h2>
      
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          {/* Bar Weight Selector */}
          <div className="relative">
            <select
              value={barWeight}
              onChange={(e) => setBarWeight(Number(e.target.value))}
              className="block w-32 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {barWeights.map((weight) => (
                <option key={weight} value={weight}>
                  {weight} kg bar
                </option>
              ))}
            </select>
          </div>

          {/* Collar Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useCollars}
              onChange={(e) => setUseCollars(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Competition Collars (2.5kg each)</span>
          </div>
        </div>

        {/* Weight Input */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => handleWeightInput(e.target.value)}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Weight in kg"
          />
          <button
            onClick={clearPlates}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Clear
          </button>
        </div>

        {/* Plate Selection */}
        <div className="flex flex-wrap gap-2">
          {plates.map((plate) => (
            <button
              key={plate.weight}
              onClick={() => addPlate(plate.weight)}
              className={`h-${plate.size} w-12 rounded ${plate.color} text-white font-bold shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {plate.weight}
            </button>
          ))}
        </div>

        {/* Visual Representation */}
        <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
          {/* Bar end */}
          <div className="h-2 w-8 bg-gray-400 rounded-l" />
          
          {/* Collar if enabled */}
          {useCollars && (
            <div className="h-16 w-2 bg-zinc-800 rounded flex items-center justify-center text-xs text-white font-bold">
              2.5
            </div>
          )}
          
          {/* Plates */}
          {loadedPlates.map((weight, index) => {
            const plate = plates.find(p => p.weight === weight);
            return (
              <button
                key={index}
                onClick={() => removePlate(index)}
                className={`h-${plate?.size} w-4 ${plate?.color} rounded flex items-center justify-center text-xs text-white font-bold hover:opacity-90 transition-opacity`}
                title="Click to remove plate"
              >
                {weight}
              </button>
            );
          })}
        </div>

        {/* Total Weight Display */}
        {targetWeight && (
          <div className="text-center text-lg font-bold text-gray-900">
            Total: {targetWeight} kg
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;