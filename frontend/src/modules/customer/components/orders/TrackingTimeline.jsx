import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '../../../../utils/cn';

const TrackingTimeline = ({ states, currentIndex }) => {
    return (
        <div className="relative pt-4 pb-8">
            <div className="absolute top-[34px] left-8 right-8 h-0.5 bg-gray-100 -z-0">
                <div 
                    className="h-full bg-green-500 transition-all duration-1000 ease-in-out" 
                    style={{ width: `${(Math.min(currentIndex, states.length - 1) / (states.length - 1)) * 100}%` }}
                />
            </div>
            
            <div className="flex justify-between relative z-10 px-2">
                {states.map((state, index) => {
                    const isCompleted = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    
                    return (
                        <div key={index} className="flex flex-col items-center group w-1/5 text-center">
                            {/* Dot */}
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 bg-white border-2",
                                isCompleted ? "border-green-500 text-green-500 shadow-sm" : "border-gray-200 text-gray-300",
                                isCurrent && "ring-4 ring-green-100 scale-110 z-20"
                            )}>
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={3} className="animate-in zoom-in duration-300" />
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-current" />
                                )}
                            </div>

                            {/* Label */}
                            <div className="mt-4 px-1">
                                <h4 className={cn(
                                    "text-[9px] font-black uppercase tracking-tighter leading-tight mb-1 transition-colors duration-500",
                                    isCompleted ? "text-gray-900" : "text-gray-400"
                                )}>
                                    {state.label.split(' ')[0]}
                                </h4>
                                <p className={cn(
                                    "text-[7px] font-bold transition-opacity duration-500 line-clamp-2",
                                    isCompleted ? "text-gray-500 opacity-100" : "opacity-0"
                                )}>
                                    {state.time || 'Pending'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackingTimeline;
