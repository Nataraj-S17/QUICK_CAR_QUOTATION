/**
 * Rule-Based Requirement Understanding AI
 * 
 * This module converts vague human input into structured data
 * using explainable rule-based logic (no ML/NLP).
 * 
 * Input: Customer requirements from database
 * Output: Structured data for car matching
 */

/**
 * Interprets usage type and returns preferred characteristics
 * @param {string} usageType - CITY, FAMILY, LONG_DRIVE, BUSINESS
 * @returns {object} - preferred body types and characteristics
 */
function interpretUsageType(usageType) {
    const usageMap = {
        FAMILY: {
            preferred_body: ['SUV', 'MUV', 'SEDAN'],
            characteristics: ['spacious', 'safe', 'comfortable'],
            priority: ['safety', 'space', 'comfort'],
            description: 'Family-oriented vehicle with spacious interiors and safety features'
        },
        CITY: {
            preferred_body: ['HATCHBACK', 'COMPACT_SUV', 'SEDAN'],
            characteristics: ['compact', 'fuel_efficient', 'easy_parking'],
            priority: ['fuel_efficiency', 'maneuverability', 'compact_size'],
            description: 'City-friendly compact vehicle with excellent fuel efficiency'
        },
        LONG_DRIVE: {
            preferred_body: ['SEDAN', 'SUV', 'LUXURY_SEDAN'],
            characteristics: ['comfortable', 'stable', 'powerful'],
            priority: ['comfort', 'stability', 'highway_performance'],
            description: 'Highway-ready vehicle with superior comfort and stability'
        },
        BUSINESS: {
            preferred_body: ['SEDAN', 'LUXURY_SEDAN', 'SUV'],
            characteristics: ['premium_look', 'comfortable', 'professional'],
            priority: ['brand_image', 'aesthetics', 'comfort'],
            description: 'Professional-grade vehicle with premium aesthetics'
        }
    };

    return usageMap[usageType] || usageMap.CITY; // Default to CITY if invalid
}

/**
 * Interprets mileage priority and returns minimum mileage filter
 * @param {string} mileagePriority - LOW, MEDIUM, HIGH
 * @returns {object} - mileage filter criteria
 */
function interpretMileage(mileagePriority) {
    const mileageMap = {
        HIGH: {
            min_mileage: 18,
            description: 'High fuel efficiency requirement (18+ km/l)',
            importance: 'critical'
        },
        MEDIUM: {
            min_mileage: 14,
            description: 'Moderate fuel efficiency requirement (14+ km/l)',
            importance: 'preferred'
        },
        LOW: {
            min_mileage: null,
            description: 'No specific fuel efficiency requirement',
            importance: 'optional'
        }
    };

    return mileageMap[mileagePriority] || mileageMap.LOW; // Default to LOW if invalid
}

/**
 * Interprets maintenance priority and returns brand/reliability preferences
 * @param {string} maintenancePriority - LOW, MEDIUM, ANY
 * @returns {object} - maintenance preferences
 */
function interpretMaintenance(maintenancePriority) {
    const maintenanceMap = {
        LOW: {
            maintenance_score: 'LOW_MAINTENANCE',
            preferred_brands: ['Maruti', 'Hyundai', 'Honda', 'Toyota'],
            avoid_brands: ['Jeep', 'Fiat'],
            description: 'Prefer highly reliable brands with low maintenance costs',
            importance: 'critical'
        },
        MEDIUM: {
            maintenance_score: 'BALANCED',
            preferred_brands: ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra', 'Kia'],
            avoid_brands: [],
            description: 'Balanced approach to maintenance and reliability',
            importance: 'moderate'
        },
        ANY: {
            maintenance_score: 'NO_RESTRICTION',
            preferred_brands: [],
            avoid_brands: [],
            description: 'No maintenance restrictions',
            importance: 'none'
        }
    };

    return maintenanceMap[maintenancePriority] || maintenanceMap.ANY; // Default to ANY if invalid
}

/**
 * Categorizes budget into segments
 * @param {number} budget - Budget in rupees
 * @returns {object} - budget category and constraints
 */
function categorizeBudget(budget) {
    if (budget < 400000) {
        return {
            budget_category: 'ENTRY',
            price_range: { min: 0, max: 400000 },
            description: 'Entry-level budget segment (< 4L)',
            typical_cars: ['Alto', 'Kwid', 'Santro', 'Wagon R']
        };
    } else if (budget >= 400000 && budget <= 700000) {
        return {
            budget_category: 'MID',
            price_range: { min: 400000, max: 700000 },
            description: 'Mid-range budget segment (4L - 7L)',
            typical_cars: ['Swift', 'i20', 'Baleno', 'Venue', 'Nexon']
        };
    } else {
        return {
            budget_category: 'PREMIUM',
            price_range: { min: 700000, max: budget },
            description: 'Premium budget segment (> 7L)',
            typical_cars: ['Creta', 'Seltos', 'Verna', 'City', 'XUV700']
        };
    }
}

/**
 * Generates priority list based on all inputs
 * @param {object} usageData - Usage type interpretation
 * @param {object} mileageData - Mileage interpretation
 * @param {object} maintenanceData - Maintenance interpretation
 * @returns {array} - Ordered priority list
 */
function generatePriorities(usageData, mileageData, maintenanceData) {
    const priorities = [];

    // Add usage-based priorities
    if (usageData.priority) {
        priorities.push(...usageData.priority);
    }

    // Add mileage priority if important
    if (mileageData.importance === 'critical') {
        priorities.unshift('fuel_efficiency'); // Add to top
    } else if (mileageData.importance === 'preferred' && !priorities.includes('fuel_efficiency')) {
        priorities.push('fuel_efficiency');
    }

    // Add maintenance priority if important
    if (maintenanceData.importance === 'critical') {
        priorities.push('low_maintenance', 'reliability');
    }

    // Remove duplicates while preserving order
    return [...new Set(priorities)];
}

/**
 * Main interpretation function
 * Converts customer requirements into structured AI output
 * 
 * @param {object} requirementData - Raw customer requirement data
 * @param {number} requirementData.budget - Budget in rupees
 * @param {string} requirementData.usage_type - CITY, FAMILY, LONG_DRIVE, BUSINESS
 * @param {string} requirementData.mileage_priority - LOW, MEDIUM, HIGH
 * @param {string} requirementData.maintenance_priority - LOW, MEDIUM, ANY
 * @returns {object} - Structured AI interpretation
 */
function interpretRequirement(requirementData) {
    // Validate input
    if (!requirementData) {
        throw new Error('Requirement data is required');
    }

    const { budget, usage_type, mileage_priority, maintenance_priority } = requirementData;

    // Normalization Helper
    const normalizeUsage = (input) => {
        if (!input) return 'CITY';
        const upper = input.toUpperCase();
        if (upper.includes('HIGHWAY') || upper.includes('LONG')) return 'LONG_DRIVE';
        if (upper.includes('CITY') || upper.includes('COMMUTE')) return 'CITY';
        if (upper.includes('FAMILY')) return 'FAMILY';
        if (upper.includes('OFF') || upper.includes('ROAD')) return 'LONG_DRIVE'; // Map Off-road to Long Drive/SUV for now
        if (upper.includes('BUSINESS')) return 'BUSINESS';
        return upper; // Fallback to raw upper string if direct match
    };

    const normalizePriority = (input) => {
        if (!input) return 'LOW'; // Default to lowest priority if missing
        return input.toUpperCase();
    };

    // Apply rule-based interpretation
    const normalizedUsage = normalizeUsage(usage_type);
    const normalizedMileage = normalizePriority(mileage_priority);

    // Maintenance "Any" vs "High" handling
    // DB has High/Medium/Low for maintenance. 
    // Logic expects LOW/MEDIUM/ANY. 
    // If DB says "High" maintenance priority, it likely means "High Importance" -> Low Maintenance? 
    // ACTUALLY: The prompt said "Maintenance Priority: LOW, MEDIUM, ANY". 
    // The DB schema says "CHECK (maintenance_priority IN ('Low', 'Medium', 'High'))".
    // This is ambiguous. "High Maintenance Priority" usually means "I care a lot about maintenance (want it low)".
    // So "High" priority -> Low maintenance cost.

    const normalizeMaintenance = (input) => {
        if (!input) return 'ANY';
        const upper = input.toUpperCase();
        // Prompt says: LOW -> Japanese brands (Low Maintenance).
        // DB has: Low, Medium, High.
        // Interpretation:
        // Low -> Low Maintenance (Strict)
        // Medium -> Balanced
        // High -> No restriction (Any)

        if (upper === 'LOW') return 'LOW';
        if (upper === 'MEDIUM') return 'MEDIUM';
        if (upper === 'HIGH') return 'ANY';
        return 'ANY'; // Default
    };

    const normalizedMaintenance = normalizeMaintenance(maintenance_priority);

    const usageInterpretation = interpretUsageType(normalizedUsage);
    const mileageInterpretation = interpretMileage(normalizedMileage);
    const maintenanceInterpretation = interpretMaintenance(normalizedMaintenance);
    const budgetInterpretation = categorizeBudget(budget);

    // Generate combined priorities
    const priorities = generatePriorities(
        usageInterpretation,
        mileageInterpretation,
        maintenanceInterpretation
    );

    // Build structured output
    const structuredOutput = {
        // Core matching criteria
        preferred_body: usageInterpretation.preferred_body,
        min_mileage: mileageInterpretation.min_mileage,
        maintenance_score: maintenanceInterpretation.maintenance_score,
        usage_pattern: normalizedUsage,
        budget_category: budgetInterpretation.budget_category,

        // Priority ordering for matching algorithm
        priority: priorities,

        // Detailed interpretations for transparency
        interpretations: {
            usage: {
                type: normalizedUsage,
                characteristics: usageInterpretation.characteristics,
                description: usageInterpretation.description
            },
            mileage: {
                priority: normalizedMileage,
                min_value: mileageInterpretation.min_mileage,
                description: mileageInterpretation.description,
                importance: mileageInterpretation.importance
            },
            maintenance: {
                priority: normalizedMaintenance,
                score: maintenanceInterpretation.maintenance_score,
                preferred_brands: maintenanceInterpretation.preferred_brands,
                avoid_brands: maintenanceInterpretation.avoid_brands,
                description: maintenanceInterpretation.description
            },
            budget: {
                amount: budget,
                category: budgetInterpretation.budget_category,
                range: budgetInterpretation.price_range,
                description: budgetInterpretation.description,
                typical_cars: budgetInterpretation.typical_cars
            }
        },

        // Metadata
        ai_version: '1.0.0',
        ai_type: 'rule_based',
        timestamp: new Date().toISOString()
    };

    return structuredOutput;
}

module.exports = {
    interpretRequirement,
    interpretUsageType,
    interpretMileage,
    interpretMaintenance,
    categorizeBudget
};
