import { getWasmModule } from "./wasm-loader";

export async function fetchAttestation() {
  const response = await fetch(
    "https://lucid-verification-demo.lunal.dev/health"
  );
  const attestationReport = response.headers.get("attestation-report");
  return attestationReport;
}

export async function verifyAttestation(attestationData) {
  const wasmModule = await getWasmModule();
  const result = await wasmModule.verify_attestation_evidence(
    "",
    attestationData,
    false
  );
  return result;
}
