import { getWasmModule } from "./wasm-loader.js";

/**
 * Fetch location data from the Lucid verification API
 * @param {string} nonce - The nonce extracted from report data
 * @param {string} bearerToken - Bearer token for API authentication
 * @returns {Promise<Object>} Location data from the API
 */
export async function fetchLocationData(nonce) {
  const baseUrl = "https://lucid-verification-demo.lunal.dev";
  const token = "test-temp-token";
  try {
    const response = await fetch(`${baseUrl}/api/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nonce: nonce,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const locationData = await response.json();

    // Print the location data to console
    console.log("Location Data Retrieved:");
    console.log(JSON.stringify(locationData, null, 2));

    return locationData;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
}

/**
 * Decode hex-encoded report data to extract the nonce
 * @param {string} hexString - Hex-encoded report data
 * @returns {string|null} Decoded nonce or null if decoding fails
 */
export function decodeReportData(hexString) {
  try {
    // Convert hex string back to bytes
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
      bytes.push(parseInt(hexString.substring(i, i + 2), 16));
    }

    // Convert bytes to string and remove null byte padding
    let nonce = String.fromCharCode(...bytes);

    // Remove trailing null bytes (padding)
    nonce = nonce.replace(/\0+$/, "");

    return nonce;
  } catch (error) {
    console.error("Error decoding report data:", error);
    return null;
  }
}

export async function extractNonce(attestationReport) {
  if (attestationReport.success && attestationReport.report_data) {
    const decodedNonce = decodeReportData(attestationReport.report_data);
    return decodedNonce;
  }
  return null;
}
