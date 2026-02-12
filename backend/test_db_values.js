const { interpretRequirement } = require('./src/ai/requirementInterpreter');

const dbValueInput = {
    budget: 2000000,
    usage_type: "Highway Travel",   // DB has "Highway Travel", Interpreter expects "LONG_DRIVE"
    mileage_priority: "High",       // DB has "High", Interpreter expects "HIGH"
    maintenance_priority: "Low"     // DB has "Low", Interpreter expects "LOW"
};

console.log('Testing with DB values:');
console.log(JSON.stringify(dbValueInput, null, 2));

try {
    const output = interpretRequirement(dbValueInput);
    console.log('\nResult:');
    console.log(JSON.stringify(output, null, 2));

    // Check if fallback happened (it defaults to CITY/LOW/ANY if no match)
    if (output.usage_pattern === 'CITY' && dbValueInput.usage_type !== 'CITY') {
        console.log('\n❌ Usage Type Mismatch: "Highway Travel" fell back to Default (CITY)');
    } else {
        console.log('\n✅ Usage Type matched or preserved');
    }

} catch (e) {
    console.error(e);
}
