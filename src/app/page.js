"use client";

import { useState, useEffect } from "react";
import { fetchAttestation, verifyAttestation } from "../utils/attestation";
import { fetchLocationData, extractNonce } from "../utils/lucid-verification";
import styles from "./page.module.css";

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addLog = (message) => {
    setLogs((prev) => [
      ...prev,
      { message, timestamp: new Date().toISOString() },
    ]);
    console.log(message);
  };

  const runAttestationFlow = async () => {
    try {
      setStatus("running");
      setLogs([]);
      setError(null);
      setResult(null);

      // Step 1: Fetch attestation
      addLog("Step 1: Fetching attestation...");
      const attestationData = await fetchAttestation();

      if (!attestationData) {
        throw new Error("No attestation data received");
      }
      addLog(
        `Attestation data received: ${attestationData.substring(0, 100)}...`
      );

      // Step 2: Verify attestation
      addLog("Step 2: Verifying attestation...");
      const verificationResult = await verifyAttestation(attestationData);
      addLog("Attestation verified successfully");
      console.log("Verification result:", verificationResult);

      // Step 3: Extract nonce
      addLog("Step 3: Extracting nonce from report...");
      const nonce = await extractNonce(verificationResult);

      if (!nonce) {
        throw new Error("Failed to extract nonce from attestation report");
      }
      addLog(`Nonce extracted: ${nonce}`);

      // Step 4: Fetch location data
      addLog("Step 4: Fetching location data with nonce...");
      const locationData = await fetchLocationData(nonce);

      addLog("Step 5: Location data retrieved successfully!");
      setResult(locationData);
      setStatus("success");
    } catch (err) {
      const errorMessage = err.message || "Unknown error occurred";
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
      setStatus("error");
      console.error("Attestation flow error:", err);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setResult(null);
    setError(null);
    setStatus("idle");
  };

  // Auto-start verification on mount
  useEffect(() => {
    runAttestationFlow();
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Lucid Attestation Demo</h1>

        <div className={styles.buttonContainer}>
          <button
            onClick={runAttestationFlow}
            disabled={status === "running"}
            className={`${styles.button} ${styles.primaryButton} ${
              status === "running" ? styles.disabledButton : ""
            }`}
          >
            {status === "running" ? "Running..." : "Start Attestation Flow"}
          </button>

          <button
            onClick={clearLogs}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            Clear Logs
          </button>
        </div>

        {/* Status indicator */}
        <div className={styles.statusContainer}>
          Status:
          <span
            className={`${styles.statusBadge} ${
              styles[
                `status${status.charAt(0).toUpperCase() + status.slice(1)}`
              ]
            }`}
          >
            {status.toUpperCase()}
          </span>
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className={styles.logsSection}>
            <h3 className={styles.sectionTitle}>Execution Log:</h3>
            <div className={styles.logsContainer}>
              {logs.map((log, index) => (
                <div key={index} className={styles.logEntry}>
                  <span className={styles.timestamp}>
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className={styles.resultSection}>
            <h3 className={styles.sectionTitle}>Location Data Result:</h3>
            <pre className={styles.codeBlock}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className={styles.errorContainer}>
            <strong>Error:</strong> {error}
          </div>
        )}
      </main>
    </div>
  );
}
