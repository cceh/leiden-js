#!/usr/bin/env node
import fs from "fs";
import path from "path";


function countFailFiles(directory) {
    let count = 0;
    
    function traverse(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    traverse(fullPath);
                } else if (entry.isFile() && entry.name.endsWith(".fail")) {
                    count++;
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error.message);
        }
    }
    
    traverse(directory);
    return count;
}

function countTotalFiles(directory) {
    let count = 0;
    
    function traverse(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                
                if (entry.isDirectory()) {
                    traverse(fullPath);
                } else if (entry.isFile() && entry.name.endsWith(".txt")) {
                    count++;
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error.message);
        }
    }
    
    traverse(directory);
    return count;
}

function countSkippedFiles(reportPath) {
    try {
        if (!fs.existsSync(reportPath)) {
            console.error(`Report file not found: ${reportPath}`);
            return 0;
        }
        
        const reportData = JSON.parse(fs.readFileSync(reportPath, "utf8"));
        return Object.keys(reportData.skippedFiles || {}).length;
    } catch (error) {
        console.error(`Error reading report ${reportPath}:`, error.message);
        return 0;
    }
}

function getIdpDataCommit() {
    try {
        // Try to read from edition state file first
        const editionStateFile = "test/leiden-js-idp-test-data/.idp-roundtrips-state-edition.json";
        if (fs.existsSync(editionStateFile)) {
            const stateData = JSON.parse(fs.readFileSync(editionStateFile, "utf8"));
            return stateData.lastProcessedCommit || "unknown";
        }
        
        // Fallback to translation state file
        const translationStateFile = "test/leiden-js-idp-test-data/.idp-roundtrips-state-translation.json";
        if (fs.existsSync(translationStateFile)) {
            const stateData = JSON.parse(fs.readFileSync(translationStateFile, "utf8"));
            return stateData.lastProcessedCommit || "unknown";
        }
        
        return "unknown";
    } catch (error) {
        console.error("Error reading state files:", error.message);
        return "unknown";
    }
}

const idpCommit = getIdpDataCommit();

console.log("=== IDP Compatibility Statistics ===");
console.log(`IDP Data Commit: ${idpCommit}\n`);

// Edition statistics
const editionDir = "test/leiden-js-idp-test-data/roundtrips/DDB_EpiDoc_XML";
const editionTotal = countTotalFiles(editionDir);
const editionFails = countFailFiles(editionDir);
const editionSkips = countSkippedFiles("test/reports/idp-skip-report-edition.json");
const editionExcluded = editionFails + editionSkips;
const editionCompatible = editionTotal - editionExcluded;
const editionPercent = ((editionCompatible / editionTotal) * 100).toFixed(1);

console.log("Edition Data (DDB_EpiDoc_XML):");
console.log(`  Total files: ${editionTotal.toLocaleString()}`);
console.log(`  Conversion failures (.fail): ${editionFails.toLocaleString()}`);
console.log(`  Invalid outputs (skipped): ${editionSkips.toLocaleString()}`);
console.log(`  Total excluded: ${editionExcluded.toLocaleString()}`);
console.log(`  Compatible files: ${editionCompatible.toLocaleString()}`);
console.log(`  Compatibility rate: ${editionPercent}%\n`);

// Translation statistics
const translationDir = "test/leiden-js-idp-test-data/roundtrips/HGV_trans_EpiDoc";
const translationTotal = countTotalFiles(translationDir);
const translationFails = countFailFiles(translationDir);
const translationSkips = countSkippedFiles("test/reports/idp-skip-report-translation.json");
const translationExcluded = translationFails + translationSkips;
const translationCompatible = translationTotal - translationExcluded;
const translationPercent = ((translationCompatible / translationTotal) * 100).toFixed(1);

console.log("Translation Data (HGV_trans_EpiDoc):");
console.log(`  Total files: ${translationTotal.toLocaleString()}`);
console.log(`  Conversion failures (.fail): ${translationFails.toLocaleString()}`);
console.log(`  Invalid outputs (skipped): ${translationSkips.toLocaleString()}`);
console.log(`  Total excluded: ${translationExcluded.toLocaleString()}`);
console.log(`  Compatible files: ${translationCompatible.toLocaleString()}`);
console.log(`  Compatibility rate: ${translationPercent}%\n`);