import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const GrowthRateSlider = ({ country, growthRate, onChange }) => {
  return (
    <div className="mt-4">
      <p className="text-white text-sm mb-2">{country}'s Average GDP Growth Rate: <span className='font-bold text-lg'>{growthRate.toFixed(1)}%</span></p>
      <Slider
        min={-1}
        max={15}
        step={0.1}
        value={growthRate}
        onChange={onChange}
        railStyle={{ backgroundColor: '#4B5563', height: 4 }}
        trackStyle={{ backgroundColor: '#10B981', height: 4 }}
        handleStyle={{
          borderColor: '#10B981',
          height: 16,
          width: 16,
          marginTop: -6,
          backgroundColor: '#fff',
        }}
      />
    </div>
  );
};

export default GrowthRateSlider;