let wasmModule = null;
let loadingPromise = null;

export async function getWasmModule() {
  if (wasmModule) {
    return wasmModule;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      if (typeof window === "undefined") {
        throw new Error("WASM can only be loaded on client side");
      }

      // Load WASM and JS separately
      const [wasmResponse, jsResponse] = await Promise.all([
        fetch("/pkg/lunal_attestation_bg.wasm"),
        fetch("/pkg/lunal_attestation.js"),
      ]);

      if (!wasmResponse.ok || !jsResponse.ok) {
        throw new Error("Failed to fetch WASM files");
      }

      const wasmBytes = await wasmResponse.arrayBuffer();
      const jsCode = await jsResponse.text();

      // Create a blob URL for the JS code and import it
      const jsBlob = new Blob([jsCode], { type: "application/javascript" });
      const jsUrl = URL.createObjectURL(jsBlob);

      try {
        const jsModule = await import(/* webpackIgnore: true */ jsUrl);

        // Initialize the WASM module
        await jsModule.default(wasmBytes);

        wasmModule = jsModule;
        console.log("WASM Module Loaded successfully");
        return jsModule;
      } finally {
        URL.revokeObjectURL(jsUrl);
      }
    } catch (error) {
      console.error("Failed to load WASM module:", error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}
