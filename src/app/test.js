// "use client";
// import { useState, useEffect } from "react";
// import {
//   Shield,
//   CheckCircle,
//   XCircle,
//   Loader2,
//   Copy,
//   Info,
//   AlertTriangle,
//   Cpu,
//   Lock,
//   FileText,
//   Clock,
//   Eye,
//   Download,
// } from "lucide-react";
// import styles from "./page.module.css";
// import { fetchAttestation, verifyAttestation } from "@/utils/attestation";

// export default function HealthPage() {
//   const [status, setStatus] = useState("loading");
//   const [logs, setLogs] = useState([]);
//   const [attestationData, setAttestationData] = useState(null);
//   const [rawAttestationReport, setRawAttestationReport] = useState(null);
//   const [activeSection, setActiveSection] = useState("overview");
//   const [copiedButtons, setCopiedButtons] = useState(new Set());
//   const [lastChecked, setLastChecked] = useState(null);

//   const addLog = (message, type = "info") => {
//     const log = {
//       id: Date.now() + Math.random(),
//       timestamp: new Date().toISOString(),
//       message,
//       type,
//     };
//     setLogs((prev) => [...prev, log]);
//   };

//   const getCpuName = () => {
//     return "AMD EPYC Processor with SEV-SNP";
//   };

//   // Start the flow immediately when component mounts
//   useEffect(() => {
//     const performHealthCheck = async () => {
//       try {
//         setStatus("loading");
//         setLastChecked(new Date().toLocaleString());
//         addLog("Starting health check verification...", "info");

//         // Fetch attestation report
//         addLog("Connecting to attestation endpoint...", "info");
//         const attestationReport = await fetchAttestation();

//         if (!attestationReport) {
//           throw new Error("No attestation report received");
//         }

//         // Store raw attestation for copying
//         setRawAttestationReport(attestationReport);
//         addLog("Attestation report received", "success");
//         addLog("Verifying cryptographic signatures...", "info");

//         // Verify the attestation
//         const verificationResult = await verifyAttestation(attestationReport);
//         addLog("Attestation verification completed successfully", "success");
//         addLog("System integrity verified", "success");

//         // Parse the verification result and store it
//         // Note: The actual structure depends on what verifyAttestation returns
//         console.log(verificationResult);
//         setAttestationData(verificationResult);
//         setStatus("verified");
//       } catch (error) {
//         console.error("Health check failed:", error);
//         addLog(`Verification failed: ${error.message}`, "error");
//         setStatus("error");
//       }
//     };

//     // Start immediately
//     performHealthCheck();
//   }, []); // Empty dependency array means this runs once on mount

//   const copyToClipboard = async (text, label = "data", buttonId) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       addLog(`${label} copied to clipboard`, "success");

//       if (buttonId) {
//         setCopiedButtons((prev) => new Set([...prev, buttonId]));
//         setTimeout(() => {
//           setCopiedButtons((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(buttonId);
//             return newSet;
//           });
//         }, 2000);
//       }
//     } catch (err) {
//       addLog(`Failed to copy ${label} to clipboard`, "error");
//     }
//   };

//   const renderCopyButton = (
//     text,
//     label,
//     buttonId,
//     className = styles.copyBtn
//   ) => {
//     const isCopied = copiedButtons.has(buttonId);
//     return (
//       <button
//         className={`${className} ${isCopied ? styles.copied : ""}`}
//         onClick={() => copyToClipboard(text, label, buttonId)}
//       >
//         {isCopied ? (
//           <>
//             <CheckCircle size={14} />
//             Copied!
//           </>
//         ) : (
//           <>
//             <Copy size={14} />
//             Copy
//           </>
//         )}
//       </button>
//     );
//   };

//   const formatBytes = (bytes) => {
//     if (!bytes) return "N/A";
//     if (typeof bytes === "string") return bytes;
//     if (Array.isArray(bytes)) {
//       return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
//     }
//     if (bytes.length !== undefined) {
//       return Array.from(bytes)
//         .map((b) => b.toString(16).padStart(2, "0"))
//         .join("");
//     }
//     return "N/A";
//   };

//   const formatCertificate = (cert) => {
//     if (!cert) return "N/A";
//     return cert.replace(/(.{64})/g, "$1\n");
//   };

//   const getStatusInfo = () => {
//     switch (status) {
//       case "loading":
//         return {
//           icon: <Loader2 className={styles.spinningIcon} />,
//           text: "Verifying System Integrity...",
//           className: styles.statusLoading,
//         };
//       case "verified":
//         return {
//           icon: <CheckCircle />,
//           text: "System Verified & Secure",
//           className: styles.statusVerified,
//         };
//       case "error":
//         return {
//           icon: <XCircle />,
//           text: "Verification Failed",
//           className: styles.statusError,
//         };
//       default:
//         return {
//           icon: <AlertTriangle />,
//           text: "Unknown Status",
//           className: styles.statusDefault,
//         };
//     }
//   };

//   const statusInfo = getStatusInfo();

//   return (
//     <div className={styles.container}>
//       {/* Header Section */}
//       <div className={styles.header}>
//         <div className={styles.headerContent}>
//           <div className={styles.titleSection}>
//             <div className={styles.titleWithIcon}>
//               <Shield className={styles.titleIcon} />
//               <h1 className={styles.title}>Trust Center</h1>
//             </div>
//             <p className={styles.subtitle}>
//               Cryptographic verification of system integrity using AMD SEV-SNP
//               attestation
//             </p>
//           </div>
//           <div className={styles.statusCard}>
//             <div className={`${styles.statusIcon} ${statusInfo.className}`}>
//               {statusInfo.icon}
//             </div>
//             <div className={styles.statusInfo}>
//               <div className={`${styles.statusText} ${statusInfo.className}`}>
//                 {statusInfo.text}
//               </div>
//               <div className={styles.statusTime}>
//                 <Clock size={14} />
//                 Last checked: {lastChecked || "Not checked yet"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className={styles.content}>
//         {/* Navigation Tabs */}
//         <div className={styles.tabNavigation}>
//           <button
//             className={`${styles.tab} ${
//               activeSection === "overview" ? styles.activeTab : ""
//             }`}
//             onClick={() => setActiveSection("overview")}
//           >
//             <Eye size={16} />
//             Overview
//           </button>
//           <button
//             className={`${styles.tab} ${
//               activeSection === "attestation" ? styles.activeTab : ""
//             }`}
//             onClick={() => setActiveSection("attestation")}
//             disabled={!attestationData}
//           >
//             <FileText size={16} />
//             Attestation Details
//           </button>
//           <button
//             className={`${styles.tab} ${
//               activeSection === "certificates" ? styles.activeTab : ""
//             }`}
//             onClick={() => setActiveSection("certificates")}
//             disabled={!attestationData}
//           >
//             <Lock size={16} />
//             Certificates
//           </button>
//           <button
//             className={`${styles.tab} ${
//               activeSection === "logs" ? styles.activeTab : ""
//             }`}
//             onClick={() => setActiveSection("logs")}
//           >
//             <Info size={16} />
//             Verification Logs
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className={styles.tabContent}>
//           {/* Overview Tab */}
//           {activeSection === "overview" && (
//             <div className={styles.overviewSection}>
//               <div className={styles.explanationSection}>
//                 <div className={styles.explanationCard}>
//                   <h2>What This Page Verifies</h2>
//                   <p>
//                     This page provides cryptographic proof that our service is
//                     running inside a secure, hardware-protected environment. It
//                     verifies the integrity of our system using AMD SEV-SNP
//                     technology, which creates an isolated "confidential
//                     computing" environment that even we cannot access or tamper
//                     with once deployed.
//                   </p>
//                   <div className={styles.endpointInfo}>
//                     <strong>Verification Endpoint:</strong>
//                     <code className={styles.endpointUrl}>
//                       https://lucid-verification-demo.lunal.dev/health
//                     </code>
//                   </div>
//                 </div>
//               </div>

//               {/* Raw Attestation Export */}
//               {rawAttestationReport && (
//                 <div className={styles.attestationExport}>
//                   <div className={styles.exportCard}>
//                     <div className={styles.exportHeader}>
//                       <div className={styles.exportTitle}>
//                         <Download size={20} />
//                         <h3>Raw Attestation Report</h3>
//                       </div>
//                       <div className={styles.exportActions}>
//                         {renderCopyButton(
//                           rawAttestationReport,
//                           "Raw attestation report",
//                           "raw-attestation"
//                         )}
//                       </div>
//                     </div>
//                     <div className={styles.exportDescription}>
//                       This is the complete, unmodified attestation report from
//                       the AMD SEV-SNP hardware. You can independently verify
//                       this report using AMD's attestation tools or third-party
//                       verification services.
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className={styles.summaryCards}>
//                 {attestationData && (
//                   <>
//                     <div className={styles.summaryCard}>
//                       <div className={styles.cardHeader}>
//                         <Cpu size={20} />
//                         <h3>CPU Info</h3>
//                       </div>
//                       <div className={styles.securityInfo}>
//                         <div className={styles.securityItem}>
//                           <span className={styles.securityLabel}>
//                             Processor:
//                           </span>
//                           <span className={styles.securityValue}>
//                             {getCpuName()}
//                           </span>
//                         </div>
//                         <div className={styles.securityItem}>
//                           <span className={styles.securityLabel}>
//                             Technology:
//                           </span>
//                           <span className={styles.securityValue}>
//                             AMD SEV-SNP
//                           </span>
//                         </div>
//                         {attestationData.report?.committed_tcb?.snp && (
//                           <div className={styles.securityItem}>
//                             <span className={styles.securityLabel}>
//                               TCB Version:
//                             </span>
//                             <span className={styles.securityValue}>
//                               {attestationData.report.committed_tcb.snp}
//                             </span>
//                           </div>
//                         )}
//                         {attestationData.report?.vmpl && (
//                           <div className={styles.securityItem}>
//                             <span className={styles.securityLabel}>
//                               VMPL Level:
//                             </span>
//                             <span className={styles.securityValue}>
//                               {attestationData.report.vmpl}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                       <div className={styles.cardDescription}>
//                         Hardware-enforced memory encryption with cryptographic
//                         attestation
//                       </div>
//                     </div>

//                     <div className={styles.summaryCard}>
//                       <div className={styles.cardHeader}>
//                         <FileText size={20} />
//                         <h3>Attestation Report</h3>
//                       </div>
//                       <div className={styles.attestationInfo}>
//                         {attestationData.report?.version && (
//                           <div className={styles.attestationItem}>
//                             <span className={styles.attestationLabel}>
//                               Report Version:
//                             </span>
//                             <span className={styles.attestationValue}>
//                               {attestationData.report.version}
//                             </span>
//                           </div>
//                         )}
//                         {attestationData.report?.policy && (
//                           <div className={styles.attestationItem}>
//                             <span className={styles.attestationLabel}>
//                               Security Policy:
//                             </span>
//                             <span className={styles.attestationValue}>
//                               0x{attestationData.report.policy.toString(16)}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                       <div className={styles.cardDescription}>
//                         Cryptographically signed report proving system integrity
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>

//               {attestationData && (
//                 <div className={styles.keyMeasurements}>
//                   <h2>System Measurements & Identity</h2>
//                   <div className={styles.measurementGrid}>
//                     {attestationData.report?.measurement && (
//                       <div className={styles.measurementCard}>
//                         <div className={styles.measurementHeader}>
//                           <div className={styles.measurementTitle}>
//                             <Lock size={18} />
//                             <h4>Launch Measurement</h4>
//                           </div>
//                           {renderCopyButton(
//                             formatBytes(attestationData.report.measurement),
//                             "Launch measurement",
//                             "launch-measurement"
//                           )}
//                         </div>
//                         <div className={styles.measurementDescription}>
//                           Cryptographic hash of the initial system state,
//                           including bootloader, kernel, and initial memory
//                           contents. This measurement uniquely identifies the
//                           exact software configuration running in this secure
//                           enclave.
//                         </div>
//                         <div className={styles.hashValue}>
//                           {formatBytes(attestationData.report.measurement)}
//                         </div>
//                       </div>
//                     )}

//                     {attestationData.report?.chip_id && (
//                       <div className={styles.measurementCard}>
//                         <div className={styles.measurementHeader}>
//                           <div className={styles.measurementTitle}>
//                             <Cpu size={18} />
//                             <h4>Hardware Identity</h4>
//                           </div>
//                           {renderCopyButton(
//                             formatBytes(attestationData.report.chip_id),
//                             "Chip ID",
//                             "chip-id"
//                           )}
//                         </div>
//                         <div className={styles.measurementDescription}>
//                           Unique hardware identifier for this specific AMD
//                           processor. This proves the attestation comes from
//                           genuine AMD SEV-SNP hardware and not a software
//                           simulation.
//                         </div>
//                         <div className={styles.hashValue}>
//                           {formatBytes(attestationData.report.chip_id)}
//                         </div>
//                       </div>
//                     )}

//                     {attestationData.report_data && (
//                       <div className={styles.measurementCard}>
//                         <div className={styles.measurementHeader}>
//                           <div className={styles.measurementTitle}>
//                             <FileText size={18} />
//                             <h4>Application Data</h4>
//                           </div>
//                           {renderCopyButton(
//                             attestationData.report_data,
//                             "Report data",
//                             "report-data"
//                           )}
//                         </div>
//                         <div className={styles.measurementDescription}>
//                           Custom data included by the application in the
//                           attestation report. This can contain additional
//                           context or commitments specific to this service.
//                         </div>
//                         <div className={styles.hashValue}>
//                           {attestationData.report_data}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Attestation Details Tab */}
//           {activeSection === "attestation" && attestationData && (
//             <div className={styles.attestationSection}>
//               <div className={styles.detailsContainer}>
//                 <div className={styles.detailGroup}>
//                   <h3>Hardware Information</h3>
//                   <div className={styles.detailItem}>
//                     <label>CPU:</label>
//                     <span>{getCpuName()}</span>
//                   </div>
//                   {attestationData.report?.chip_id && (
//                     <div className={styles.detailItem}>
//                       <label>Chip ID:</label>
//                       <div className={styles.valueContainer}>
//                         <code className={styles.hexValue}>
//                           {formatBytes(attestationData.report.chip_id)}
//                         </code>
//                         {renderCopyButton(
//                           formatBytes(attestationData.report.chip_id),
//                           "Chip ID",
//                           "detail-chip-id",
//                           styles.valueContainer + " button"
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   {attestationData.report?.measurement && (
//                     <div className={styles.detailItem}>
//                       <label>System Measurement:</label>
//                       <div className={styles.valueContainer}>
//                         <code className={styles.hexValue}>
//                           {formatBytes(attestationData.report.measurement)}
//                         </code>
//                         {renderCopyButton(
//                           formatBytes(attestationData.report.measurement),
//                           "System measurement",
//                           "detail-measurement",
//                           styles.valueContainer + " button"
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {attestationData.report?.committed_tcb && (
//                   <div className={styles.detailGroup}>
//                     <h3>TCB (Trusted Computing Base)</h3>
//                     <div className={styles.tcbGrid}>
//                       {attestationData.report.committed_tcb.bootloader && (
//                         <div className={styles.tcbItem}>
//                           <label>Bootloader:</label>
//                           <span>
//                             {attestationData.report.committed_tcb.bootloader}
//                           </span>
//                         </div>
//                       )}
//                       {attestationData.report.committed_tcb.microcode && (
//                         <div className={styles.tcbItem}>
//                           <label>Microcode:</label>
//                           <span>
//                             {attestationData.report.committed_tcb.microcode}
//                           </span>
//                         </div>
//                       )}
//                       {attestationData.report.committed_tcb.snp && (
//                         <div className={styles.tcbItem}>
//                           <label>SNP:</label>
//                           <span>
//                             {attestationData.report.committed_tcb.snp}
//                           </span>
//                         </div>
//                       )}
//                       {attestationData.report.committed_tcb.tee && (
//                         <div className={styles.tcbItem}>
//                           <label>TEE:</label>
//                           <span>
//                             {attestationData.report.committed_tcb.tee}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className={styles.detailGroup}>
//                   <h3>Report Information</h3>
//                   <div className={styles.reportGrid}>
//                     {attestationData.report?.version && (
//                       <div className={styles.reportItem}>
//                         <label>Version:</label>
//                         <span>{attestationData.report.version}</span>
//                       </div>
//                     )}
//                     {attestationData.report?.policy && (
//                       <div className={styles.reportItem}>
//                         <label>Policy:</label>
//                         <span>
//                           0x{attestationData.report.policy.toString(16)}
//                         </span>
//                       </div>
//                     )}
//                     {attestationData.report?.vmpl && (
//                       <div className={styles.reportItem}>
//                         <label>VMPL:</label>
//                         <span>{attestationData.report.vmpl}</span>
//                       </div>
//                     )}
//                     {attestationData.report?.guest_svn && (
//                       <div className={styles.reportItem}>
//                         <label>Guest SVN:</label>
//                         <span>{attestationData.report.guest_svn}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {attestationData.report_data && (
//                   <div className={styles.detailGroup}>
//                     <h3>Report Data</h3>
//                     <div className={styles.detailItem}>
//                       <div className={styles.valueContainer}>
//                         <code className={styles.hexValue}>
//                           {attestationData.report_data}
//                         </code>
//                         {renderCopyButton(
//                           attestationData.report_data,
//                           "Report data",
//                           "detail-report-data",
//                           styles.valueContainer + " button"
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Certificates Tab */}
//           {activeSection === "certificates" && attestationData && (
//             <div className={styles.certificatesSection}>
//               <div className={styles.certContainer}>
//                 <div className={styles.certGroup}>
//                   <h3>VCEK Certificate</h3>
//                   <div className={styles.certInfo}>
//                     <div className={styles.certStatus}>
//                       <CheckCircle
//                         size={16}
//                         className={styles.statusIndicator}
//                       />
//                       Certificate verified and valid
//                     </div>
//                     {attestationData.certs &&
//                       attestationData.certs.vcekCert && (
//                         <div className={styles.certData}>
//                           <pre className={styles.certContent}>
//                             {formatCertificate(attestationData.certs.vcekCert)}
//                           </pre>
//                           {renderCopyButton(
//                             attestationData.certs.vcekCert,
//                             "VCEK Certificate",
//                             "vcek-cert"
//                           )}
//                         </div>
//                       )}
//                   </div>
//                 </div>

//                 {attestationData.certs &&
//                   attestationData.certs.certificateChain && (
//                     <div className={styles.certGroup}>
//                       <h3>Certificate Chain</h3>
//                       <div className={styles.certInfo}>
//                         <div className={styles.certStatus}>
//                           <CheckCircle
//                             size={16}
//                             className={styles.statusIndicator}
//                           />
//                           Chain validation successful
//                         </div>
//                         <div className={styles.certData}>
//                           <pre className={styles.certContent}>
//                             {formatCertificate(
//                               attestationData.certs.certificateChain
//                             )}
//                           </pre>
//                           {renderCopyButton(
//                             attestationData.certs.certificateChain,
//                             "Certificate Chain",
//                             "cert-chain"
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </div>
//           )}

//           {/* Logs Tab */}
//           {activeSection === "logs" && (
//             <div className={styles.logsSection}>
//               <div className={styles.logsHeader}>
//                 <h2>Verification Process</h2>
//                 <p>Real-time log of attestation verification steps</p>
//               </div>
//               <div className={styles.logsContainer}>
//                 {logs.map((log) => (
//                   <div
//                     key={log.id}
//                     className={`${styles.logEntry} ${
//                       styles[
//                         `log${
//                           log.type.charAt(0).toUpperCase() + log.type.slice(1)
//                         }`
//                       ]
//                     }`}
//                   >
//                     <div className={styles.logIcon}>
//                       {log.type === "info" && <Info size={16} />}
//                       {log.type === "success" && <CheckCircle size={16} />}
//                       {log.type === "error" && <XCircle size={16} />}
//                     </div>
//                     <div className={styles.logContent}>
//                       <div className={styles.logMessage}>{log.message}</div>
//                       <div className={styles.logTime}>
//                         {new Date(log.timestamp).toLocaleTimeString()}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
