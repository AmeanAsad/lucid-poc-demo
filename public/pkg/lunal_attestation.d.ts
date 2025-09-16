/* tslint:disable */
/* eslint-disable */
export function verify_attestation_evidence(custom_data: string, compressed_evidence: string, check_custom_data?: boolean | null): Promise<any>;
export class VerificationResult {
  private constructor();
  free(): void;
  readonly success: boolean;
  readonly message: string;
  readonly report: string | undefined;
  readonly certs: string | undefined;
  readonly report_data: string | undefined;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_verificationresult_free: (a: number, b: number) => void;
  readonly verificationresult_success: (a: number) => number;
  readonly verificationresult_message: (a: number) => [number, number];
  readonly verificationresult_report: (a: number) => [number, number];
  readonly verificationresult_certs: (a: number) => [number, number];
  readonly verificationresult_report_data: (a: number) => [number, number];
  readonly verify_attestation_evidence: (a: number, b: number, c: number, d: number, e: number) => any;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_5: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly wasm_bindgen__convert__closures_____invoke__ha969125ccd2d7761: (a: number, b: number) => void;
  readonly closure281_externref_shim: (a: number, b: number, c: any) => void;
  readonly closure500_externref_shim: (a: number, b: number, c: any, d: any) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
