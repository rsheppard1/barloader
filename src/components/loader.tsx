"use client"

import React, { useState } from 'react';

// Define plate types and their weights
const plates = {
  kg: [
    { weight: 25, color: 'bg-red-600' },
    { weight: 20, color: 'bg-blue-600' },
    { weight: 15, color: 'bg-yellow-500' },
    { weight: 10, color: 'bg-green-600' },
    { weight: 5, color: 'bg-zinc-100 border-2' },
    { weight: 2.5, color: 'bg-zinc-900' },
    { weight: 1.25, color: 'bg-zinc-500' },
  ],
  lb: [
    { weight: 45, color: 'bg-red-600' },
    { weight: 35, color: 'bg-blue-600' },
    { weight: 25, color: 'bg-yellow-500' },
    { weight: 10, color: 'bg-green-600' },
    { weight: 5, color: 'bg-zinc-100 border-2' },
    { weight: 2.5, color: 'bg-zinc-900' },
  ]
};

const barWeights = {
  kg: [15, 20],
  lb: [35, 45]
};

const Loader = () => {
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [barWeight, setBarWeight] = useState(20);
  const [useCollars, setUseCollars] = useState(false);
  const [targetWeight, setTargetWeight] = useState('');
  const [loadedPlates, setLoadedPlates] = useState<number[]>([]);

  const calculatePlates = (weight: number) => {
    const targetPlateWeight = weight - barWeight - (useCollars ? (unit === 'kg' ? 5 : 11) : 0);
    if (targetPlateWeight < 0) return [];
    
    const plateWeights = plates[unit].map(p => p.weight);
    const result: number[] = [];
    let remainingWeight = targetPlateWeight / 2; // divide by 2 since we need plates for both sides

    plateWeights.forEach(plate => {
      while (remainingWeight >= plate) {
        result.push(plate);
        remainingWeight -= plate;
      }
    });

    return result;
  };

  const handleWeightInput = (value: string) => {
    setTargetWeight(value);
    const numWeight = parseFloat(value);
    if (!isNaN(numWeight)) {
      setLoadedPlates(calculatePlates(numWeight));
    }
  };

  const addPlate = (weight: number) => {
    setLoadedPlates([...loadedPlates, weight]);
    const totalWeight = barWeight + 
      (useCollars ? (unit === 'kg' ? 5 : 11) : 0) + 
      (loadedPlates.concat(weight).reduce((a, b) => a + b, 0) * 2);
    setTargetWeight(totalWeight.toString());
  };

  const clearPlates = () => {
    setLoadedPlates([]);
    setTargetWeight('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Powerlifting Plate Calculator</h2>
      
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          {/* Unit Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">KG</span>
            <button
              onClick={() => setUnit(unit === 'kg' ? 'lb' : 'kg')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                unit === 'lb' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  unit === 'lb' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">LB</span>
          </div>

          {/* Bar Weight Selector */}
          <div className="relative">
            <select
              value={barWeight}
              onChange={(e) => setBarWeight(Number(e.target.value))}
              className="block w-32 rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {barWeights[unit].map((weight) => (
                <option key={weight} value={weight}>
                  {weight} {unit}
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
            <span className="text-sm font-medium text-gray-700">Competition Collars</span>
          </div>
        </div>

        {/* Weight Input */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => handleWeightInput(e.target.value)}
            className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={`Weight in ${unit}`}
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
          {plates[unit].map((plate) => (
            <button
              key={plate.weight}
              onClick={() => addPlate(plate.weight)}
              className={`h-20 w-12 rounded ${plate.color} text-white font-bold shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {plate.weight}
            </button>
          ))}
        </div>

        {/* Visual Representation */}
        <div className="flex items-center justify-center space-x-2 bg-gray-50 p-4 rounded-lg">
          <div className="h-2 w-20 bg-gray-400 rounded" /> {/* Bar end */}
          {loadedPlates.map((weight, index) => {
            const plate = plates[unit].find(p => p.weight === weight);
            return (
              <div
                key={index}
                className={`h-${20 + Math.floor(weight)} w-4 ${plate?.color} rounded flex items-center justify-center text-xs text-white font-bold`}
              >
                {weight}
              </div>
            );
          })}
          <div className="h-2 w-40 bg-gray-400 rounded" /> {/* Bar center */}
          {loadedPlates.slice().reverse().map((weight, index) => {
            const plate = plates[unit].find(p => p.weight === weight);
            return (
              <div
                key={index}
                className={`h-${20 + Math.floor(weight)} w-4 ${plate?.color} rounded flex items-center justify-center text-xs text-white font-bold`}
              >
                {weight}
              </div>
            );
          })}
          <div className="h-2 w-20 bg-gray-400 rounded" /> {/* Bar end */}
        </div>

        {/* Total Weight Display */}
        {targetWeight && (
          <div className="text-center text-lg font-bold text-gray-900">
            Total: {targetWeight} {unit}
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;