"use client"

import React, { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { FaInfoCircle } from 'react-icons/fa'

// Define plate types with weights, colors, and pixel heights
const plates = [
  { weight: 25, color: 'bg-red-600', height: 140 },
  { weight: 20, color: 'bg-blue-600', height: 140 },
  { weight: 15, color: 'bg-yellow-500', height: 124 },
  { weight: 10, color: 'bg-green-600', height: 101 },
  { weight: 5, color: 'bg-white border-2 text-zinc-900', height: 71 },
  { weight: 2.5, color: 'bg-zinc-900', height: 59 },
  { weight: 1.25, color: 'bg-zinc-400', height: 50 },
  { weight: 0.5, color: 'bg-zinc-400', height: 42 },
  { weight: 0.25, color: 'bg-zinc-400', height: 35 },
];

const barWeights = [15, 20];

const PlateCalculator = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [barWeight, setBarWeight] = useState(20);
  const [useCollars, setUseCollars] = useState(false);
  const [targetWeight, setTargetWeight] = useState('');
  const [loadedPlates, setLoadedPlates] = useState<number[]>([]);

  // Recalculate plates when bar weight changes
  useEffect(() => {
    if (targetWeight) {
      const numWeight = parseFloat(targetWeight);
      if (!isNaN(numWeight)) {
        setLoadedPlates(calculatePlates(numWeight));
      }
    }
  }, [barWeight, useCollars]);

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
    const newPlates = [...loadedPlates, weight].sort((a, b) => b - a);
    setLoadedPlates(newPlates);
    const totalWeight = calculateTotalWeight(newPlates);
    setTargetWeight(totalWeight.toString());
  };

  const removePlate = (index: number) => {
    const newPlates = loadedPlates.filter((_, i) => i !== index);
    setLoadedPlates(newPlates);
    const totalWeight = calculateTotalWeight(newPlates);
    setTargetWeight(totalWeight ? totalWeight.toString() : '');
  };

  const calculateTotalWeight = (platesArray: number[]) => {
    return barWeight + 
      (useCollars ? 5 : 0) +
      (platesArray.reduce((a, b) => a + b, 0) * 2);
  };

  const clearPlates = () => {
    setLoadedPlates([]);
    setTargetWeight('');
  };

  const renderPlatesAndCollars = () => {
    const plateElements = loadedPlates.map((weight, index) => {
      const plate = plates.find(p => p.weight === weight);
      return (
        <button
          key={index}
          onClick={() => removePlate(index)}
          className={`w-4 ${plate?.color} rounded flex items-center justify-center text-[0.6rem] text-white font-bold hover:opacity-90 transition-opacity`}
          style={{ height: `${plate?.height}px` }}
          title="Tap to remove"
        >
          {weight}
        </button>
      );
    });

    if (useCollars) {
      plateElements.push(
        <div
          key="collar"
          className="w-4 h-8 bg-gradient-to-b from-gray-200 to-gray-500 border-2 border-gray-400 rounded flex items-center justify-center"
          title="Comp. Collar"
        />
      );
    }

    return plateElements;
  };

  return (
    <div className={`p-2`}>
      <div className={`w-full max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
      <Popover>
        <PopoverButton className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <FaInfoCircle size={18} />
        </PopoverButton>
        <PopoverPanel className="absolute z-10 top-10 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            1. Choose the barbell weight.
            <br /><br />
            2. Specify whether competition collars are being used.
            <br /><br />
            3. Click plates to add them to the barbell visualisation. Tap to remove.
            <br /><br />
            Or, enter a target weight and the app will determine the necessary plates.
          </div>
        </PopoverPanel>
      </Popover>
        <h2 className={`text-2xl font-bold text-center ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Barbell Plate Calculator
        </h2>
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="relative">
              <select
                value={barWeight}
                id = "barWeight"
                aria-label="Bar weight"
                onChange={(e) => setBarWeight(Number(e.target.value))}
                className={`block rounded-lg py-2 px-2 text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                } focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 `}
              >
                {barWeights.map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}kg bar
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                aria-label="Use collars"
                id = "useCollars"
                checked={useCollars}
                onChange={(e) => {
                  setUseCollars(e.target.checked);
                  if (targetWeight) {
                    const currentWeight = parseFloat(targetWeight);
                    if (!isNaN(currentWeight)) {
                      setTargetWeight((currentWeight + (e.target.checked ? 5 : -5)).toString());
                    }
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Comp. Collars</span>
            </div>
          </div>

          {/* Weight Input and Total */}
          <div className="flex pt-4 items-center justify-center space-x-2">
            <input
              type="number"
              value={targetWeight}
              min="0"
              id = "targetWeight"
              onChange={(e) => handleWeightInput(e.target.value)}
              className={`flex items-center justify-center w-24 rounded-lg text-center py-2 text-lg font-semibold ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white border-gray-300'
              } focus:border-blue-500 focus:ring-blue-500`}
              placeholder="Weight"
            />
            <div className={`text-lg font-semibold pr-5 ${isDarkMode ? 'text-white' : ''}`}>kg</div>
            <button
              onClick={clearPlates}
              aria-label="Clear plates"
              className={`p-2 rounded-lg text-lg font-semibold ${
                isDarkMode 
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Plate Selection */}
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {plates.map((plate) => (
              <button
                key={plate.weight}
                onClick={() => addPlate(plate.weight)}
                className={`w-4 ${plate.color} rounded text-white text-[0.6rem] font-bold shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                style={{ height: `${plate.height}px` }}
              >
                {plate.weight}
              </button>
            ))}
          </div>

          {/* Visual Representation */}
          <div className={`flex items-center justify-center space-x-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            {/* Bar end */}
            <div className={`h-2 w-10 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
            {/* Plates and Collar */}
            <div className="flex space-x-2 items-center">
              {renderPlatesAndCollars()}
            </div>
            {/* Bar end */}
            <div className={`h-2 w-4 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-r`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlateCalculator;