import jwt from "jsonwebtoken";

export async function fetchLocationData(receivedToken) {
  const baseUrl = "https://lucid-verification-dev.lunal.dev";
  const token = "test-temp-token";
  try {
    const response = await fetch(`${baseUrl}/api/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hashed_token: receivedToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const locationData = await response.json();
    const locationToken = locationData?.token;

    if (locationToken) {
      const verifiedData = await verifyToken(locationToken, receivedToken);
      console.log("Verified token data:", verifiedData);
      return verifiedData;
    }

    // Print the location data to console
    console.log("Location Data Retrieved:");
    console.log(locationData);

    return locationData;
  } catch (error) {
    console.error("Error fetching location data:", error);
    throw error;
  }
}

export async function verifyToken(token, receivedToken) {
  // Compute SHA256 hash of the token
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedToken = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  console.log("Token SHA256 hash:", hashedToken);

  // Verify the hashed token matches the received token
  if (hashedToken !== receivedToken) {
    throw new Error(
      "Token verification failed: hashed token does not match received token"
    );
  }

  console.log("Token hash verification successful");

  const decodedToken = jwt.decode(token);
  console.log("Decoded JWT:", decodedToken);

  return decodedToken;
}

export async function extractNonce(attestationReport) {
  if (attestationReport.success && attestationReport.report_data) {
    const decodedNonce = attestationReport.report_data;
    return decodedNonce;
  }
  return null;
}
