import React from 'react';

const CarCard = ({ car }) => {
    return (
        <div className="group glass rounded-3xl overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:translate-y-[-8px]">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={car.image}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                    {car.year}
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400/20 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-yellow-500">
                    ★ {car.rating}
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-xl font-bold font-outfit">{car.make} {car.model}</h3>
                    <p className="text-sm text-slate-500">{car.fuelType} • {car.transmission} • {car.mileage.toLocaleString()} mi</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="text-2xl font-black gradient-text">
                        ${car.price.toLocaleString()}
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-colors group/btn border-none cursor-pointer">
                        <svg className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
