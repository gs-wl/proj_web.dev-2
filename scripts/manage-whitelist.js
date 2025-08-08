#!/usr/bin/env node

/**
 * Whitelist Management Script
 * 
 * Usage:
 * node scripts/manage-whitelist.js add 0x1234567890123456789012345678901234567890
 * node scripts/manage-whitelist.js remove 0x1234567890123456789012345678901234567890
 * node scripts/manage-whitelist.js list
 * node scripts/manage-whitelist.js validate
 */

const fs = require('fs');
const path = require('path');

const WHITELIST_PATH = path.join(__dirname, '../src/data/whitelist.json');

function loadWhitelist() {
  try {
    const data = fs.readFileSync(WHITELIST_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading whitelist:', error.message);
    process.exit(1);
  }
}

function saveWhitelist(whitelist) {
  try {
    whitelist.lastUpdated = new Date().toISOString();
    fs.writeFileSync(WHITELIST_PATH, JSON.stringify(whitelist, null, 2));
    console.log('✅ Whitelist saved successfully');
  } catch (error) {
    console.error('Error saving whitelist:', error.message);
    process.exit(1);
  }
}

function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function addAddress(address) {
  if (!isValidAddress(address)) {
    console.error('❌ Invalid Ethereum address format');
    process.exit(1);
  }

  const whitelist = loadWhitelist();
  const lowerAddress = address.toLowerCase();
  
  if (whitelist.whitelistedAddresses.some(addr => addr.toLowerCase() === lowerAddress)) {
    console.log('⚠️  Address already exists in whitelist');
    return;
  }

  whitelist.whitelistedAddresses.push(address);
  saveWhitelist(whitelist);
  console.log(`✅ Added ${address} to whitelist`);
}

function removeAddress(address) {
  if (!isValidAddress(address)) {
    console.error('❌ Invalid Ethereum address format');
    process.exit(1);
  }

  const whitelist = loadWhitelist();
  const lowerAddress = address.toLowerCase();
  const originalLength = whitelist.whitelistedAddresses.length;
  
  whitelist.whitelistedAddresses = whitelist.whitelistedAddresses.filter(
    addr => addr.toLowerCase() !== lowerAddress
  );

  if (whitelist.whitelistedAddresses.length === originalLength) {
    console.log('⚠️  Address not found in whitelist');
    return;
  }

  saveWhitelist(whitelist);
  console.log(`✅ Removed ${address} from whitelist`);
}

function listAddresses() {
  const whitelist = loadWhitelist();
  
  console.log('\n📋 Whitelist Status:');
  console.log(`📅 Last Updated: ${whitelist.lastUpdated}`);
  console.log(`🔢 Version: ${whitelist.version}`);
  console.log(`👥 Total Addresses: ${whitelist.whitelistedAddresses.length}\n`);
  
  if (whitelist.whitelistedAddresses.length === 0) {
    console.log('📭 No addresses in whitelist');
    return;
  }

  console.log('🏠 Whitelisted Addresses:');
  whitelist.whitelistedAddresses.forEach((address, index) => {
    console.log(`  ${index + 1}. ${address}`);
  });
  console.log('');
}

function validateWhitelist() {
  const whitelist = loadWhitelist();
  const issues = [];

  // Check for duplicate addresses
  const seen = new Set();
  const duplicates = [];
  
  whitelist.whitelistedAddresses.forEach(address => {
    const lower = address.toLowerCase();
    if (seen.has(lower)) {
      duplicates.push(address);
    } else {
      seen.add(lower);
    }
  });

  if (duplicates.length > 0) {
    issues.push(`Duplicate addresses found: ${duplicates.join(', ')}`);
  }

  // Check for invalid addresses
  const invalid = whitelist.whitelistedAddresses.filter(addr => !isValidAddress(addr));
  if (invalid.length > 0) {
    issues.push(`Invalid addresses found: ${invalid.join(', ')}`);
  }

  // Check structure
  if (!Array.isArray(whitelist.whitelistedAddresses)) {
    issues.push('whitelistedAddresses should be an array');
  }

  if (typeof whitelist.lastUpdated !== 'string') {
    issues.push('lastUpdated should be a string');
  }

  if (typeof whitelist.version !== 'string') {
    issues.push('version should be a string');
  }

  console.log('\n🔍 Whitelist Validation Results:');
  if (issues.length === 0) {
    console.log('✅ Whitelist is valid - no issues found');
  } else {
    console.log('❌ Issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }
  console.log('');
}

function showHelp() {
  console.log(`
🏠 W3-Energy Whitelist Management Tool

Usage:
  node scripts/manage-whitelist.js <command> [address]

Commands:
  add <address>     Add an Ethereum address to the whitelist
  remove <address>  Remove an Ethereum address from the whitelist
  list             Show all whitelisted addresses
  validate         Validate the whitelist for errors
  help             Show this help message

Examples:
  node scripts/manage-whitelist.js add 0x742d35Cc6634C0532925a3b8D3Ac1C25d6b94F98
  node scripts/manage-whitelist.js remove 0x742d35Cc6634C0532925a3b8D3Ac1C25d6b94F98
  node scripts/manage-whitelist.js list
  node scripts/manage-whitelist.js validate

Note: Addresses must be valid Ethereum addresses (42 characters starting with 0x)
`);
}

// Main execution
const command = process.argv[2];
const address = process.argv[3];

switch (command) {
  case 'add':
    if (!address) {
      console.error('❌ Please provide an address to add');
      process.exit(1);
    }
    addAddress(address);
    break;
    
  case 'remove':
    if (!address) {
      console.error('❌ Please provide an address to remove');
      process.exit(1);
    }
    removeAddress(address);
    break;
    
  case 'list':
    listAddresses();
    break;
    
  case 'validate':
    validateWhitelist();
    break;
    
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
    
  default:
    console.error('❌ Unknown command. Use "help" for usage information.');
    process.exit(1);
}