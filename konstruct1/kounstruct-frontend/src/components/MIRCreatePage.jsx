// // src/pages/MIR/MIRCreatePage.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// import SignaturePadField from "../components/SignaturePadField";

// import {
//   createMIR,
//   getProjectsForCurrentUser,
//   getProjectUsersForMir,
//   getUserDetailsById,
//   forwardMIR,
//   getUsersByCreator,
//   getUsersByProject,
//   signMIRStore,
//   signMIRQc,
//   signMIRProjectIncharge,
//   uploadMIRMaterialImages, // 👈 photos
//   uploadMIRAttachments,    // 👈 NEW: attachments
// } from "../api";

// const EMPTY_EXTRA_FIELD = { key: "", value: "" };

// export default function MIRCreatePage() {
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(false);
//   const [projectsLoading, setProjectsLoading] = useState(true);
//   const [projects, setProjects] = useState([]);

//   // --- SIGNATURE STATES ---
//   const [storeSignFile, setStoreSignFile] = useState(null);
//   const [storeSignName, setStoreSignName] = useState("");
//   const [storeSignDate, setStoreSignDate] = useState("");

//   const [qcSignFile, setQcSignFile] = useState(null);
//   const [qcSignName, setQcSignName] = useState("");
//   const [qcSignDate, setQcSignDate] = useState("");

//   const [piSignFile, setPiSignFile] = useState(null); // project incharge
//   const [piSignName, setPiSignName] = useState("");
//   const [piSignDate, setPiSignDate] = useState("");

//   // --- MATERIAL PHOTOS (multi) ---
//   const [materialPhotos, setMaterialPhotos] = useState([]); // Array<File>

//   // --- ATTACHMENTS (DOCS / FILES) ---
//   const [attachments, setAttachments] = useState([]); // Array<File>
//   const [attachmentName, setAttachmentName] = useState("");
//   const [attachmentDescription, setAttachmentDescription] = useState("");

//   // MIR normal form
//   const [form, setForm] = useState({
//     project_id: "",
//     mir_number: "",
//     date: "",
//     location: "",
//     source_type: "CONTRACTOR", // INHOUSE / CONTRACTOR

//     manufacturer_name: "",
//     certificate_no: "",
//     certificate_date: "",
//     material_id: "",
//     material_name: "",
//     material_specification: "",
//     material_description: "",
//     material_unique_id: "",
//     supplier_qc_report_no: "",
//     supplier_qc_report_date: "",
//     details_of_inspection: "",
//     total_qty: "",
//     accepted_qty: "",
//     rejected_qty: "",
//     rejection_reason: "",
//     visual_test_result: "",
//     criteria_test_result: "",
//   });

//   const [extraFields, setExtraFields] = useState([EMPTY_EXTRA_FIELD]);

//   // project users + selected users
//   const [projectUsers, setProjectUsers] = useState([]);
//   const [usersLoading, setUsersLoading] = useState(false);
//   const [selectedUserIds, setSelectedUserIds] = useState([]); // multi select
//   const [forwardComment, setForwardComment] = useState("");

//   // ---- load projects for dropdown ----
//   useEffect(() => {
//     async function loadProjects() {
//       try {
//         setProjectsLoading(true);
//         const res = await getProjectsForCurrentUser();
//         const rows = res?.data || [];
//         setProjects(rows);
//       } catch (err) {
//         console.error("Failed to load projects", err);
//         toast.error("Projects load nahi ho paaye.");
//       } finally {
//         setProjectsLoading(false);
//       }
//     }
//     loadProjects();
//   }, []);

//   // ---- project change -> users load karo ----
//   useEffect(() => {
//     async function loadUsers() {
//       const projectId = form.project_id;

//       if (!projectId) {
//         setProjectUsers([]);
//         setSelectedUserIds([]);
//         return;
//       }

//       setUsersLoading(true);
//       try {
//         const res = await getUsersByProject(projectId);
//         const users = res?.data || [];

//         const options = users.map((u) => ({
//           id: u.id,
//           label:
//             u.display_name ||
//             [u.first_name, u.last_name].filter(Boolean).join(" ") ||
//             u.username ||
//             u.email ||
//             `User #${u.id}`,
//         }));

//         setProjectUsers(options);
//       } catch (err) {
//         console.error("Failed to load project users", err);
//         toast.error("Project ke users load nahi ho paaye.");
//       } finally {
//         setUsersLoading(false);
//       }
//     }

//     loadUsers();
//   }, [form.project_id]);

//   // ---- helpers ----
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleExtraChange = (index, field, value) => {
//     setExtraFields((prev) => {
//       const copy = [...prev];
//       copy[index] = { ...copy[index], [field]: value };
//       return copy;
//     });
//   };

//   const addExtraRow = () => {
//     setExtraFields((prev) => [...prev, { ...EMPTY_EXTRA_FIELD }]);
//   };

//   const removeExtraRow = (index) => {
//     setExtraFields((prev) => prev.filter((_, i) => i !== index));
//   };

//   const buildExtraData = () => {
//     const extra = {};
//     extraFields.forEach((row) => {
//       const key = (row.key || "").trim();
//       if (!key) return;
//       extra[key] = row.value ?? "";
//     });
//     return extra;
//   };

//   const parseNumber = (val) => {
//     if (val === "" || val === null || val === undefined) return null;
//     const num = Number(val);
//     return Number.isNaN(num) ? null : num;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.project_id) {
//       toast.error("Project select karo.");
//       return;
//     }

//     if (!selectedUserIds.length) {
//       toast.error("Kam se kam ek user select karo jise MIR forward hoga.");
//       return;
//     }

//     const payload = {
//       project_id: Number(form.project_id),
//       mir_number: form.mir_number || "",
//       location: form.location || "",
//       source_type: form.source_type,

//       manufacturer_name: form.manufacturer_name || "",
//       certificate_no: form.certificate_no || "",
//       certificate_date: form.certificate_date || null,

//       material_id: form.material_id || "",
//       material_name: form.material_name || "",
//       material_specification: form.material_specification || "",
//       material_description: form.material_description || "",
//       material_unique_id: form.material_unique_id || "",

//       supplier_qc_report_no: form.supplier_qc_report_no || "",
//       supplier_qc_report_date: form.supplier_qc_report_date || null,
//       details_of_inspection: form.details_of_inspection || "",

//       total_qty: parseNumber(form.total_qty),
//       accepted_qty: parseNumber(form.accepted_qty),
//       rejected_qty: parseNumber(form.rejected_qty),
//       rejection_reason: form.rejection_reason || "",
//       visual_test_result: form.visual_test_result || "",
//       criteria_test_result: form.criteria_test_result || "",

//       extra_data: buildExtraData(),
//     };

//     try {
//       setLoading(true);

//       // 1) MIR create (JSON payload)
//       const res = await createMIR(payload);
//       const data = res.data || res;
//       const mirId = data.id;

//       if (!mirId) {
//         throw new Error("MIR create response me id nahi mila.");
//       }

//       // 2) selected har user ko forward (multi)
//       for (const uid of selectedUserIds) {
//         try {
//           await forwardMIR(mirId, {
//             to_user_id: Number(uid),
//             comment: forwardComment || "",
//           });
//         } catch (errFwd) {
//           console.error("Forward failed for user", uid, errFwd);
//         }
//       }

//       // 3) OPTIONAL SIGNATURES: agar file diya hai tabhi hit karna
//       try {
//         if (storeSignFile) {
//           await signMIRStore(mirId, {
//             name: storeSignName || undefined,
//             sign_date: storeSignDate || undefined,
//             file: storeSignFile,
//           });
//         }

//         if (qcSignFile) {
//           await signMIRQc(mirId, {
//             name: qcSignName || undefined,
//             sign_date: qcSignDate || undefined,
//             file: qcSignFile,
//           });
//         }

//         if (piSignFile) {
//           await signMIRProjectIncharge(mirId, {
//             name: piSignName || undefined,
//             sign_date: piSignDate || undefined,
//             file: piSignFile,
//           });
//         }
//       } catch (signErr) {
//         console.error("Signature API me error", signErr);
//         // toast.warn("Kuch signatures save nahi ho paaye.");
//       }

//       // 4) OPTIONAL MATERIAL IMAGES: naya endpoint
//       try {
//         if (materialPhotos.length > 0) {
//           const fd = new FormData();
//           materialPhotos.forEach((file) => {
//             fd.append("images", file); // backend: request.FILES.getlist("images")
//           });
//           await uploadMIRMaterialImages(mirId, fd);
//         }
//       } catch (imgErr) {
//         console.error("Material images upload me error", imgErr);
//         // toast.warn("Material photos upload nahi ho paayi.");
//       }

//       // 5) OPTIONAL ATTACHMENTS: docs / files
//       try {
//         if (attachments.length > 0) {
//           const fd = new FormData();
//           attachments.forEach((file) => {
//             fd.append("files", file); // backend: request.FILES.getlist("files")
//           });
//           if (attachmentName) {
//             fd.append("name", attachmentName);
//           }
//           if (attachmentDescription) {
//             fd.append("description", attachmentDescription);
//           }
//           await uploadMIRAttachments(mirId, fd);
//         }
//       } catch (attErr) {
//         console.error("Attachments upload me error", attErr);
//         // toast.warn("Kuch attachments upload nahi ho paaye.");
//       }

//       toast.success(
//         "MIR create + material photos + attachments + selected users ko forward + signatures (agar diye) ho gaye."
//       );

//       // optional: reset kuch fields
//       setForm((prev) => ({
//         ...prev,
//         mir_number: "",
//         location: "",
//         manufacturer_name: "",
//         material_id: "",
//         material_name: "",
//         material_specification: "",
//         material_description: "",
//         material_unique_id: "",
//         supplier_qc_report_no: "",
//         supplier_qc_report_date: "",
//         details_of_inspection: "",
//         total_qty: "",
//         accepted_qty: "",
//         rejected_qty: "",
//         rejection_reason: "",
//         visual_test_result: "",
//         criteria_test_result: "",
//       }));
//       setExtraFields([EMPTY_EXTRA_FIELD]);
//       setForwardComment("");
//       setMaterialPhotos([]);
//       setAttachments([]);
//       setAttachmentName("");
//       setAttachmentDescription("");

//       // signatures reset
//       setStoreSignFile(null);
//       setStoreSignName("");
//       setStoreSignDate("");
//       setQcSignFile(null);
//       setQcSignName("");
//       setQcSignDate("");
//       setPiSignFile(null);
//       setPiSignName("");
//       setPiSignDate("");

//       // optionally navigate somewhere:
//       // navigate(`/mir/${mirId}`);
//     } catch (err) {
//       console.error("Failed to create/forward MIR", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "MIR create/forward karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container" style={{ padding: "20px" }}>
//       <h2 style={{ marginBottom: "16px" }}>
//         Create Material Inspection Request (MIR)
//       </h2>

//       <form onSubmit={handleSubmit}>
//         {/* PROJECT + TOGGLE */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <label>Project *</label>
//             <select
//               name="project_id"
//               value={form.project_id}
//               onChange={handleChange}
//               required
//               style={{ width: "100%", padding: "8px" }}
//             >
//               <option value="">Select Project</option>
//               {projectsLoading ? (
//                 <option value="">Loading...</option>
//               ) : (
//                 projects.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name || p.project_name || `Project #${p.id}`}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>

//           <div>
//             <label>Source Type</label>
//             <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
//               <label>
//                 <input
//                   type="radio"
//                   name="source_type"
//                   value="INHOUSE"
//                   checked={form.source_type === "INHOUSE"}
//                   onChange={handleChange}
//                 />{" "}
//                 In-house
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="source_type"
//                   value="CONTRACTOR"
//                   checked={form.source_type === "CONTRACTOR"}
//                   onChange={handleChange}
//                 />{" "}
//                 Contractor
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* MULTI USER SELECT + COMMENT */}
//         <div style={{ marginBottom: "20px" }}>
//           <label>Forward MIR To (multi users allowed)</label>
//           <select
//             multiple
//             value={selectedUserIds}
//             onChange={(e) => {
//               const opts = Array.from(e.target.selectedOptions);
//               setSelectedUserIds(opts.map((o) => o.value));
//             }}
//             disabled={!form.project_id || usersLoading}
//             style={{
//               width: "100%",
//               minHeight: "80px",
//               padding: "8px",
//             }}
//           >
//             {!form.project_id && (
//               <option value="" disabled>
//                 Pehle project select karo
//               </option>
//             )}
//             {form.project_id && usersLoading && (
//               <option value="" disabled>
//                 Users loading...
//               </option>
//             )}
//             {form.project_id &&
//               !usersLoading &&
//               projectUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.label}
//                 </option>
//               ))}
//           </select>
//           <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
//             * Windows pe <b>Ctrl</b> + click / Mac pe <b>Cmd</b> + click se
//             multiple users select kar sakte ho.
//           </div>
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label>Forward Comment (optional)</label>
//           <textarea
//             value={forwardComment}
//             onChange={(e) => setForwardComment(e.target.value)}
//             rows={2}
//             style={{ width: "100%", padding: "8px" }}
//             placeholder="e.g. Please verify TC & QC docs before unloading."
//           />
//         </div>

//         {/* BASIC DETAILS */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <label>MIR No (optional)</label>
//             <input
//               type="text"
//               name="mir_number"
//               value={form.mir_number}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>

//           <div>
//             <label>Location</label>
//             <input
//               type="text"
//               name="location"
//               value={form.location}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         {/* MANUFACTURER / CERTIFICATE */}
//         <h4>Manufacturer & Certificate</h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr 1fr",
//             gap: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <label>Manufacturer Name</label>
//             <input
//               type="text"
//               name="manufacturer_name"
//               value={form.manufacturer_name}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Certificate No</label>
//             <input
//               type="text"
//               name="certificate_no"
//               value={form.certificate_no}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Certificate Date</label>
//             <input
//               type="date"
//               name="certificate_date"
//               value={form.certificate_date}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         {/* MATERIAL DETAILS */}
//         <h4>Material Details</h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "16px",
//           }}
//         >
//           <div>
//             <label>Material ID</label>
//             <input
//               type="text"
//               name="material_id"
//               value={form.material_id}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Material Name</label>
//             <input
//               type="text"
//               name="material_name"
//               value={form.material_name}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>Specification</label>
//           <textarea
//             name="material_specification"
//             value={form.material_specification}
//             onChange={handleChange}
//             rows={2}
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>Description</label>
//           <textarea
//             name="material_description"
//             value={form.material_description}
//             onChange={handleChange}
//             rows={2}
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <div style={{ marginBottom: "20px" }}>
//           <label>Unique ID / Serial / Type</label>
//           <input
//             type="text"
//             name="material_unique_id"
//             value={form.material_unique_id}
//             onChange={handleChange}
//             style={{ width: "100%", padding: "8px", width: "100%" }}
//           />
//         </div>

//         {/* ✅ MATERIAL PHOTOS */}
//         <h4>Material Photos</h4>
//         <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
//           Yaha pe material ki 1 ya multiple photos attach kar sakte ho (PNG / JPG).
//         </p>
//         <div style={{ marginBottom: 16 }}>
//           <input
//             type="file"
//             accept="image/*"
//             multiple
//             onChange={(e) =>
//               setMaterialPhotos(Array.from(e.target.files || []))
//             }
//           />
//           {materialPhotos.length > 0 && (
//             <ul style={{ marginTop: 8, fontSize: 12 }}>
//               {materialPhotos.map((file, idx) => (
//                 <li key={idx}>{file.name}</li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* ✅ ATTACHMENTS (DOCS / FILES) */}
//         <h4>Attachments (Docs / Files)</h4>
//         <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
//           Yaha pe MIR ke saath koi bhi supporting document (PDF, DOC, XLS, image,
//           etc.) attach kar sakte ho.
//         </p>
//         <div style={{ marginBottom: 16 }}>
//           <input
//             type="file"
//             multiple
//             onChange={(e) =>
//               setAttachments(Array.from(e.target.files || []))
//             }
//           />
//           {attachments.length > 0 && (
//             <ul style={{ marginTop: 8, fontSize: 12 }}>
//               {attachments.map((file, idx) => (
//                 <li key={idx}>{file.name}</li>
//               ))}
//             </ul>
//           )}

//           <div style={{ marginTop: 8 }}>
//             <label style={{ fontSize: 12 }}>Display Name (optional)</label>
//             <input
//               type="text"
//               value={attachmentName}
//               onChange={(e) => setAttachmentName(e.target.value)}
//               style={{ width: "100%", padding: 6 }}
//               placeholder="e.g. Mill Test Certificate, Gate Pass, etc."
//             />
//           </div>

//           <div style={{ marginTop: 8 }}>
//             <label style={{ fontSize: 12 }}>Description (optional)</label>
//             <textarea
//               rows={2}
//               value={attachmentDescription}
//               onChange={(e) => setAttachmentDescription(e.target.value)}
//               style={{ width: "100%", padding: 6 }}
//               placeholder="Short note about these attachments..."
//             />
//           </div>
//         </div>

//         {/* SUPPLIER QC REPORT */}
//         <h4>Supplier QC Report</h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <label>QC Report No</label>
//             <input
//               type="text"
//               name="supplier_qc_report_no"
//               value={form.supplier_qc_report_no}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>QC Report Date</label>
//             <input
//               type="date"
//               name="supplier_qc_report_date"
//               value={form.supplier_qc_report_date}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         {/* INSPECTION & QUANTITIES */}
//         <div style={{ marginBottom: "16px" }}>
//           <label>Details of Inspection</label>
//           <textarea
//             name="details_of_inspection"
//             value={form.details_of_inspection}
//             onChange={handleChange}
//             rows={3}
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <h4>Quantity & Result</h4>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr 1fr",
//             gap: "16px",
//             marginBottom: "16px",
//           }}
//         >
//           <div>
//             <label>Total Qty</label>
//             <input
//               type="number"
//               step="0.01"
//               name="total_qty"
//               value={form.total_qty}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Accepted Qty</label>
//             <input
//               type="number"
//               step="0.01"
//               name="accepted_qty"
//               value={form.accepted_qty}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Rejected Qty</label>
//             <input
//               type="number"
//               step="0.01"
//               name="rejected_qty"
//               value={form.rejected_qty}
//               onChange={handleChange}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         <div style={{ marginBottom: "16px" }}>
//           <label>Rejection Reason</label>
//           <textarea
//             name="rejection_reason"
//             value={form.rejection_reason}
//             onChange={handleChange}
//             rows={2}
//             style={{ width: "100%", padding: "8px" }}
//           />
//         </div>

//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <div>
//             <label>Visual Test Result</label>
//             <textarea
//               name="visual_test_result"
//               value={form.visual_test_result}
//               onChange={handleChange}
//               rows={2}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//           <div>
//             <label>Criteria Test Result</label>
//             <textarea
//               name="criteria_test_result"
//               value={form.criteria_test_result}
//               onChange={handleChange}
//               rows={2}
//               style={{ width: "100%", padding: "8px" }}
//             />
//           </div>
//         </div>

//         {/* EXTRA / MODULAR FIELDS */}
//         <h4>Extra Fields (modular)</h4>
//         <p style={{ fontSize: "12px", color: "#777" }}>
//           Yaha koi bhi naya frontend field add kar sakte ho (gate_entry_no,
//           truck_no, LR_no, etc.). Ye sab backend me <code>extra_data</code> JSON
//           me store hoga.
//         </p>
//         {extraFields.map((row, idx) => (
//           <div
//             key={idx}
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 2fr auto",
//               gap: "8px",
//               marginBottom: "8px",
//             }}
//           >
//             <input
//               type="text"
//               placeholder="Field key (e.g. gate_entry_no)"
//               value={row.key}
//               onChange={(e) => handleExtraChange(idx, "key", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <input
//               type="text"
//               placeholder="Value"
//               value={row.value}
//               onChange={(e) => handleExtraChange(idx, "value", e.target.value)}
//               style={{ padding: "8px" }}
//             />
//             <button
//               type="button"
//               onClick={() => removeExtraRow(idx)}
//               disabled={extraFields.length === 1}
//             >
//               X
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addExtraRow}
//           style={{ marginBottom: "20px" }}
//         >
//           + Add Extra Field
//         </button>

//         {/* ========== DIGITAL SIGNATURES SECTION ========== */}
//         <h3 style={{ marginTop: "24px" }}>Digital Signatures (Optional)</h3>
//         <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
//           Yaha pe directly screen pe sign kar sakte ho <b>ya</b> existing
//           signature image upload kar sakte ho. Dono me se jo use karega, wahi
//           backend me PNG/JPG ke form me save hoga.
//         </p>

//         {/* Store Team Signature */}
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 12,
//           }}
//         >
//           <h4>Store Team Signature</h4>
//           <div style={{ marginBottom: 8 }}>
//             <label>Store Team Name (optional)</label>
//             <input
//               type="text"
//               value={storeSignName}
//               onChange={(e) => setStoreSignName(e.target.value)}
//               style={{ width: "100%", padding: 8 }}
//               placeholder="e.g. Store Incharge Name"
//             />
//           </div>
//           <div style={{ marginBottom: 8 }}>
//             <label>Sign Date (optional)</label>
//             <input
//               type="date"
//               value={storeSignDate}
//               onChange={(e) => setStoreSignDate(e.target.value)}
//               style={{ padding: 8 }}
//             />
//           </div>

//           <SignaturePadField
//             label="Store Team Signature"
//             fileValue={storeSignFile}
//             onChangeFile={setStoreSignFile}
//           />
//         </div>

//         {/* QC Team Signature */}
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 12,
//           }}
//         >
//           <h4>QC Team Signature</h4>
//           <div style={{ marginBottom: 8 }}>
//             <label>QC Team Name (optional)</label>
//             <input
//               type="text"
//               value={qcSignName}
//               onChange={(e) => setQcSignName(e.target.value)}
//               style={{ width: "100%", padding: 8 }}
//               placeholder="e.g. QC Engineer Name"
//             />
//           </div>
//           <div style={{ marginBottom: 8 }}>
//             <label>Sign Date (optional)</label>
//             <input
//               type="date"
//               value={qcSignDate}
//               onChange={(e) => setQcSignDate(e.target.value)}
//               style={{ padding: 8 }}
//             />
//           </div>

//           <SignaturePadField
//             label="QC Team Signature"
//             fileValue={qcSignFile}
//             onChangeFile={setQcSignFile}
//           />
//         </div>

//         {/* Project Incharge Signature */}
//         <div
//           style={{
//             border: "1px solid #ddd",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 20,
//           }}
//         >
//           <h4>Project Incharge Signature</h4>
//           <div style={{ marginBottom: 8 }}>
//             <label>Project Incharge Name (optional)</label>
//             <input
//               type="text"
//               value={piSignName}
//               onChange={(e) => setPiSignName(e.target.value)}
//               style={{ width: "100%", padding: 8 }}
//               placeholder="e.g. Project Manager Name"
//             />
//           </div>
//           <div style={{ marginBottom: 8 }}>
//             <label>Sign Date (optional)</label>
//             <input
//               type="date"
//               value={piSignDate}
//               onChange={(e) => setPiSignDate(e.target.value)}
//               style={{ padding: 8 }}
//             />
//           </div>

//           <SignaturePadField
//             label="Project Incharge Signature"
//             fileValue={piSignFile}
//             onChangeFile={setPiSignFile}
//           />
//         </div>

//         {/* SUBMIT */}
//         <div>
//           <button type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Create & Forward MIR"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



// src/pages/MIR/MIRCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// src/pages/MIR/MIRCreatePage.jsx
import { useTheme } from "../ThemeContext"; // ⬅️ update path if needed

import SignaturePadField from "../components/SignaturePadField";

import {
  createMIR,
  getProjectsForCurrentUser,
  getProjectUsersForMir,
  getUserDetailsById,
  forwardMIR,
  getUsersByCreator,
  getUsersByProject,
  signMIRStore,
  signMIRQc,
  signMIRProjectIncharge,
  uploadMIRMaterialImages,
  uploadMIRAttachments,
  uploadMIRLogo,
} from "../api";

const EMPTY_EXTRA_FIELD = { key: "", value: "" };

/* ---------------- THEME PALETTE ---------------- */

/* ---------------- THEME PALETTE ---------------- */

const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";


/* ---------------- TABLE CELL STYLES ---------------- */

const styles = {
  labelCell: {
    border: "1px solid #000",
    padding: "8px",
    fontWeight: "bold",
    background: BG_OFFWHITE, // was #f5f5f5
    fontSize: "12px",
  },
  inputCell: {
    border: "1px solid #000",
    padding: "6px",
    background: "#fff",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "4px",
    fontSize: "13px",
    background: "transparent",
  },
  textarea: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "4px",
    fontSize: "13px",
    resize: "vertical",
    background: "transparent",
    fontFamily: "Arial, sans-serif",
  },
  smallInput: {
    width: "100%",
    border: "none",
    outline: "none",
    padding: "2px",
    fontSize: "12px",
    background: "transparent",
    textAlign: "center",
  },
};

export default function MIRCreatePage() {
  const navigate = useNavigate();
  const { theme } = useTheme(); // 👈 yahan se theme aa raha hai context se

  // theme dependent colors AB YAHAN PE:
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE;

  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  // --- SIGNATURE STATES ---
  const [storeSignFile, setStoreSignFile] = useState(null);
  const [storeSignName, setStoreSignName] = useState("");
  const [storeSignDate, setStoreSignDate] = useState("");

  const [qcSignFile, setQcSignFile] = useState(null);
  const [qcSignName, setQcSignName] = useState("");
  const [qcSignDate, setQcSignDate] = useState("");

  const [piSignFile, setPiSignFile] = useState(null);
  const [piSignName, setPiSignName] = useState("");
  const [piSignDate, setPiSignDate] = useState("");

  // --- MATERIAL PHOTOS (multi) ---
  const [materialPhotos, setMaterialPhotos] = useState([]);

  // --- ATTACHMENTS (DOCS / FILES) ---
  const [attachments, setAttachments] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentDescription, setAttachmentDescription] = useState("");
  const [logoFile, setLogoFile] = useState(null);

  // MIR normal form
  const [form, setForm] = useState({
    project_id: "",
    mir_number: "",
    date: "",
    location: "",
    source_type: "CONTRACTOR",

    // Header / title fields (dynamic)
    ims_title: "TITLE NAME",
    report_title: "REPORT TITLE NAME",
    company_name: "COMPANY NAME",

    manufacturer_name: "",
    certificate_no: "",
    certificate_date: "",
    material_id: "",
    material_name: "",
    material_specification: "",
    material_description: "",
    material_unique_id: "",
    supplier_qc_report_no: "",
    supplier_qc_report_date: "",
    details_of_inspection: "",
    total_qty: "",
    accepted_qty: "",
    rejected_qty: "",
    rejection_reason: "",
    visual_test_result: "",
    criteria_test_result: "",
  });

  const [extraFields, setExtraFields] = useState([EMPTY_EXTRA_FIELD]);

  // project users + selected users
  const [projectUsers, setProjectUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [forwardComment, setForwardComment] = useState("");

  // ---- load projects for dropdown ----
  useEffect(() => {
    async function loadProjects() {
      try {
        setProjectsLoading(true);
        const res = await getProjectsForCurrentUser();
        const rows = res?.data || [];
        setProjects(rows);
      } catch (err) {
        console.error("Failed to load projects", err);
        toast.error("Projects load nahi ho paaye.");
      } finally {
        setProjectsLoading(false);
      }
    }
    loadProjects();
  }, []);

  // ---- project change -> users load karo ----
  useEffect(() => {
    async function loadUsers() {
      const projectId = form.project_id;

      if (!projectId) {
        setProjectUsers([]);
        setSelectedUserIds([]);
        return;
      }

      setUsersLoading(true);
      try {
        const res = await getUsersByProject(projectId);
        const users = res?.data || [];

        const options = users.map((u) => ({
          id: u.id,
          label:
            u.display_name ||
            [u.first_name, u.last_name].filter(Boolean).join(" ") ||
            u.username ||
            u.email ||
            `User #${u.id}`,
        }));

        setProjectUsers(options);
      } catch (err) {
        console.error("Failed to load project users", err);
        toast.error("Project ke users load nahi ho paaye.");
      } finally {
        setUsersLoading(false);
      }
    }

    loadUsers();
  }, [form.project_id]);

  // ---- helpers ----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExtraChange = (index, field, value) => {
    setExtraFields((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addExtraRow = () => {
    setExtraFields((prev) => [...prev, { ...EMPTY_EXTRA_FIELD }]);
  };

  const removeExtraRow = (index) => {
    setExtraFields((prev) => prev.filter((_, i) => i !== index));
  };

  const buildExtraData = () => {
    const extra = {};
    extraFields.forEach((row) => {
      const key = (row.key || "").trim();
      if (!key) return;
      extra[key] = row.value ?? "";
    });
    return extra;
  };

  const parseNumber = (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = Number(val);
    return Number.isNaN(num) ? null : num;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.project_id) {
      toast.error("Project select karo.");
      return;
    }

    if (!selectedUserIds.length) {
      toast.error("Kam se kam ek user select karo jise MIR forward hoga.");
      return;
    }

    const payload = {
      project_id: Number(form.project_id),
      mir_number: form.mir_number || "",
      date: form.date || null,
      location: form.location || "",
      source_type: form.source_type,

      // dynamic headings
      ims_title: form.ims_title || "",
      report_title: form.report_title || "",
      company_name: form.company_name || "",

      manufacturer_name: form.manufacturer_name || "",
      certificate_no: form.certificate_no || "",
      certificate_date: form.certificate_date || null,

      material_id: form.material_id || "",
      material_name: form.material_name || "",
      material_specification: form.material_specification || "",
      material_description: form.material_description || "",
      material_unique_id: form.material_unique_id || "",

      supplier_qc_report_no: form.supplier_qc_report_no || "",
      supplier_qc_report_date: form.supplier_qc_report_date || null,
      details_of_inspection: form.details_of_inspection || "",

      total_qty: parseNumber(form.total_qty),
      accepted_qty: parseNumber(form.accepted_qty),
      rejected_qty: parseNumber(form.rejected_qty),
      rejection_reason: form.rejection_reason || "",
      visual_test_result: form.visual_test_result || "",
      criteria_test_result: form.criteria_test_result || "",

      extra_data: buildExtraData(),
    };

    try {
      setLoading(true);

      // 1) MIR create
      const res = await createMIR(payload);
      const data = res.data || res;
      const mirId = data.id;

      if (!mirId) {
        throw new Error("MIR create response me id nahi mila.");
      }

      // 2) MIR logo upload (optional)
      try {
        if (logoFile) {
          const fdLogo = new FormData();
          fdLogo.append("logo", logoFile);
          await uploadMIRLogo(mirId, fdLogo);
        }
      } catch (logoErr) {
        console.error("Logo upload me error", logoErr);
      }

      // 3) forward
      for (const uid of selectedUserIds) {
        try {
          await forwardMIR(mirId, {
            to_user_id: Number(uid),
            comment: forwardComment || "",
          });
        } catch (errFwd) {
          console.error("Forward failed for user", uid, errFwd);
        }
      }

      // 4) signatures
      try {
        if (storeSignFile) {
          await signMIRStore(mirId, {
            name: storeSignName || undefined,
            sign_date: storeSignDate || undefined,
            file: storeSignFile,
          });
        }

        if (qcSignFile) {
          await signMIRQc(mirId, {
            name: qcSignName || undefined,
            sign_date: qcSignDate || undefined,
            file: qcSignFile,
          });
        }

        if (piSignFile) {
          await signMIRProjectIncharge(mirId, {
            name: piSignName || undefined,
            sign_date: piSignDate || undefined,
            file: piSignFile,
          });
        }
      } catch (signErr) {
        console.error("Signature API me error", signErr);
      }

      // 5) material images
      try {
        if (materialPhotos.length > 0) {
          const fd = new FormData();
          materialPhotos.forEach((file) => {
            fd.append("images", file);
          });
          await uploadMIRMaterialImages(mirId, fd);
        }
      } catch (imgErr) {
        console.error("Material images upload me error", imgErr);
      }

      // 6) attachments
      try {
        if (attachments.length > 0) {
          const fd = new FormData();
          attachments.forEach((file) => {
            fd.append("files", file);
          });
          if (attachmentName) {
            fd.append("name", attachmentName);
          }
          if (attachmentDescription) {
            fd.append("description", attachmentDescription);
          }
          await uploadMIRAttachments(mirId, fd);
        }
      } catch (attErr) {
        console.error("Attachments upload me error", attErr);
      }

      toast.success(
        "MIR create + material photos + attachments + selected users ko forward + signatures (agar diye) ho gaye."
      );

      // reset (headings same rehne do)
      setForm((prev) => ({
        ...prev,
        mir_number: "",
        date: "",
        location: "",
        manufacturer_name: "",
        material_id: "",
        material_name: "",
        material_specification: "",
        material_description: "",
        material_unique_id: "",
        supplier_qc_report_no: "",
        supplier_qc_report_date: "",
        details_of_inspection: "",
        total_qty: "",
        accepted_qty: "",
        rejected_qty: "",
        rejection_reason: "",
        visual_test_result: "",
        criteria_test_result: "",
      }));
      setExtraFields([EMPTY_EXTRA_FIELD]);
      setForwardComment("");
      setMaterialPhotos([]);
      setAttachments([]);
      setAttachmentName("");
      setAttachmentDescription("");

      setStoreSignFile(null);
      setStoreSignName("");
      setStoreSignDate("");
      setQcSignFile(null);
      setQcSignName("");
      setQcSignDate("");
      setPiSignFile(null);
      setPiSignName("");
      setPiSignDate("");
      setLogoFile(null);
    } catch (err) {
      console.error("Failed to create/forward MIR", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "MIR create/forward karte time error aaya.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: bgColor,
        color: textColor,
      }}
    >
      {/* PDF-STYLE HEADER */}
      <div
        style={{
          border: "2px solid #000",
          marginBottom: "20px",
          background: cardColor,
        }}
      >
        {/* Header Section */}
        <div
          style={{
            borderBottom: "2px solid #000",
            padding: "15px",
            textAlign: "center",
            background: BG_OFFWHITE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "2px solid #000",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "10px",
            }}
          >
            LOGO
          </div>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              name="ims_title"
              value={form.ims_title}
              onChange={handleChange}
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "18px",
                border: "none",
                outline: "none",
                background: "transparent",
                color: textColor,
              }}
            />
          </div>
        </div>

        {/* Title Section */}
        <div
          style={{
            borderBottom: "2px solid #000",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <input
            type="text"
            name="report_title"
            value={form.report_title}
            onChange={handleChange}
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: textColor,
            }}
          />
        </div>

        {/* Company Name */}
        <div
          style={{
            borderBottom: "2px solid #000",
            padding: "10px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "20px",
          }}
        >
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            style={{
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "20px",
              border: "none",
              outline: "none",
              background: "transparent",
              color: textColor,
            }}
          />
        </div>

        {/* Doc Number */}
        <div
          style={{
            borderBottom: "2px solid #000",
            padding: "8px 15px",
            fontSize: "12px",
          }}
        >
          DOC NO: ADL/QA/MIR/IMF/07
        </div>

        {/* FORM CONTENT STARTS HERE */}
        <form onSubmit={handleSubmit}>
          {/* Project Selection & Forward Settings - OUTSIDE TABLE */}
          <div
            style={{
              background: cardColor,
              border: `1px solid ${borderColor}`,
              padding: "15px",
              margin: "15px",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px 0",
                color: borderColor,
              }}
            >
               System Settings (Not part of PDF form)
            </h4>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Project *
              </label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value="">Select Project</option>
                {projectsLoading ? (
                  <option value="">Loading...</option>
                ) : (
                  projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.project_name || `Project #${p.id}`}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Source Type
              </label>
              <div style={{ display: "flex", gap: "15px" }}>
                <label>
                  <input
                    type="radio"
                    name="source_type"
                    value="INHOUSE"
                    checked={form.source_type === "INHOUSE"}
                    onChange={handleChange}
                  />{" "}
                  In-house
                </label>
                <label>
                  <input
                    type="radio"
                    name="source_type"
                    value="CONTRACTOR"
                    checked={form.source_type === "CONTRACTOR"}
                    onChange={handleChange}
                  />{" "}
                  Contractor
                </label>
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Forward MIR To (multi users) *
              </label>
              <select
                multiple
                value={selectedUserIds}
                onChange={(e) => {
                  const opts = Array.from(e.target.selectedOptions);
                  setSelectedUserIds(opts.map((o) => o.value));
                }}
                disabled={!form.project_id || usersLoading}
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "8px",
                  border: "1px solid #ccc",
                }}
              >
                {!form.project_id && (
                  <option value="" disabled>
                    Select project first
                  </option>
                )}
                {form.project_id && usersLoading && (
                  <option value="" disabled>
                    Users loading...
                  </option>
                )}
                {form.project_id &&
                  !usersLoading &&
                  projectUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
              </select>
              <div
                style={{
                  fontSize: "11px",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                Ctrl/Cmd + click for multiple selection
              </div>
            </div>

            {/* MIR Logo for PDF header */}
            <div style={{ marginBottom: "12px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                MIR Logo (for PDF header, right corner)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              {logoFile && (
                <div
                  style={{ fontSize: 11, color: "#555", marginTop: 4 }}
                >
                  Selected: {logoFile.name}
                </div>
              )}
            </div>

            <div>
              <label
                style={{
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Forward Comment (optional)
              </label>
              <textarea
                value={forwardComment}
                onChange={(e) => setForwardComment(e.target.value)}
                rows={2}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
                placeholder="e.g. Please verify TC & QC docs before unloading."
              />
            </div>
          </div>

          {/* PDF TABLE LAYOUT */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <tbody>
              {/* Date & Location Row */}
              <tr>
                <td style={styles.labelCell}>Date -</td>
                <td style={styles.inputCell} colSpan={2}>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.labelCell}>Location-</td>
                <td style={styles.inputCell} colSpan={3}>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>

              {/* MIR No Row */}
              <tr>
                <td style={styles.labelCell}>MIR No -</td>
                <td style={styles.inputCell} colSpan={6}>
                  <input
                    type="text"
                    name="mir_number"
                    value={form.mir_number}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>

              {/* Manufacturer Name Row */}
              <tr>
                <td style={styles.labelCell}>Manufacturer Name -</td>
                <td style={styles.inputCell} colSpan={6}>
                  <input
                    type="text"
                    name="manufacturer_name"
                    value={form.manufacturer_name}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>

              {/* Certificate No & Date Row */}
              <tr>
                <td style={styles.labelCell}>Certificate No & Date -</td>
                <td style={styles.inputCell} colSpan={3}>
                  <input
                    type="text"
                    name="certificate_no"
                    value={form.certificate_no}
                    onChange={handleChange}
                    placeholder="Certificate No"
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell} colSpan={3}>
                  <input
                    type="date"
                    name="certificate_date"
                    value={form.certificate_date}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>

              {/* Material ID, Name, Specification Row */}
              <tr>
                <td style={styles.labelCell}>Material ID</td>
                <td style={styles.labelCell}>Material Name</td>
                <td style={styles.labelCell} colSpan={5}>
                  Material Specification
                </td>
              </tr>
              <tr>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    name="material_id"
                    value={form.material_id}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    name="material_name"
                    value={form.material_name}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell} colSpan={5}>
                  <textarea
                    name="material_specification"
                    value={form.material_specification}
                    onChange={handleChange}
                    rows={2}
                    style={styles.textarea}
                  />
                </td>
              </tr>

              {/* Description of material */}
              <tr>
                <td style={styles.labelCell} colSpan={7}>
                  Description of material
                </td>
              </tr>
              <tr>
                <td style={styles.inputCell} colSpan={7}>
                  <textarea
                    name="material_description"
                    value={form.material_description}
                    onChange={handleChange}
                    rows={3}
                    style={styles.textarea}
                  />
                </td>
              </tr>

              {/* Material Unique ID */}
              <tr>
                <td style={styles.labelCell} colSpan={7}>
                  Material Unique ID/Serial /Type
                </td>
              </tr>
              <tr>
                <td style={styles.inputCell} colSpan={7}>
                  <input
                    type="text"
                    name="material_unique_id"
                    value={form.material_unique_id}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
              </tr>

              {/* Supplier QC Report & Details of Inspection */}
              <tr>
                <td style={styles.labelCell} colSpan={3}>
                  Supplier Internal Quality inspection Report No & Date -
                </td>
                <td style={styles.labelCell} colSpan={4}>
                  Details Of Inspection
                </td>
              </tr>
              <tr>
                <td style={styles.inputCell} colSpan={3}>
                  <input
                    type="text"
                    name="supplier_qc_report_no"
                    value={form.supplier_qc_report_no}
                    onChange={handleChange}
                    placeholder="Report No"
                    style={{ ...styles.input, marginBottom: "4px" }}
                  />
                  <input
                    type="date"
                    name="supplier_qc_report_date"
                    value={form.supplier_qc_report_date}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell} colSpan={4} rowSpan={2}>
                  <textarea
                    name="details_of_inspection"
                    value={form.details_of_inspection}
                    onChange={handleChange}
                    rows={5}
                    style={styles.textarea}
                  />
                </td>
              </tr>

              {/* Supplier Test Certificate Section */}
              <tr>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={3}
                >
                  As per Supplier Test certificate
                </td>
              </tr>
              <tr>
                <td style={styles.labelCell}>Min. Limit</td>
                <td style={styles.labelCell}>Max. Limit</td>
                <td style={styles.labelCell}>Min. Limit</td>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={2}
                >
                  As per Actual Inspection
                </td>
                <td style={styles.labelCell}>Min. Limit</td>
                <td style={styles.labelCell}>Max. Limit</td>
              </tr>
              <tr>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    style={styles.smallInput}
                    placeholder="Min"
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    style={styles.smallInput}
                    placeholder="Max"
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    style={styles.smallInput}
                    placeholder="Min"
                  />
                </td>
                <td style={styles.inputCell} colSpan={2}>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Actual Value"
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    style={styles.smallInput}
                    placeholder="Min"
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="text"
                    style={styles.smallInput}
                    placeholder="Max"
                  />
                </td>
              </tr>

              {/* Doc Reference Row */}
              <tr>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={3}
                >
                  Doc Reference
                </td>
                <td style={styles.inputCell} colSpan={1}></td>
                <td style={styles.inputCell} colSpan={1}></td>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={2}
                >
                  Doc. Reference
                </td>
              </tr>

              {/* Test for in Process compatibility */}
              <tr>
                <td style={styles.labelCell} colSpan={7}>
                  Test for in Process compatibility
                </td>
              </tr>
              <tr>
                <td
                  style={{ ...styles.inputCell, height: "60px" }}
                  colSpan={7}
                >
                  <textarea
                    rows={2}
                    style={styles.textarea}
                    placeholder="Enter test details..."
                  />
                </td>
              </tr>

              {/* Other test required */}
              <tr>
                <td style={styles.labelCell} colSpan={7}>
                  Other test required to compline And Application
                </td>
              </tr>
              <tr>
                <td
                  style={{ ...styles.inputCell, height: "60px" }}
                  colSpan={7}
                >
                  <textarea
                    rows={2}
                    style={styles.textarea}
                    placeholder="Enter other tests..."
                  />
                </td>
              </tr>

              {/* Visual Test Result & Criterial test Result */}
              <tr>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={3}
                >
                  Visual Test Result
                </td>
                <td
                  style={{ ...styles.labelCell, textAlign: "center" }}
                  colSpan={4}
                >
                  Criterial test Result
                </td>
              </tr>
              <tr>
                <td
                  style={{ ...styles.inputCell, height: "80px" }}
                  colSpan={3}
                >
                  <textarea
                    name="visual_test_result"
                    value={form.visual_test_result}
                    onChange={handleChange}
                    rows={3}
                    style={styles.textarea}
                  />
                </td>
                <td
                  style={{ ...styles.inputCell, height: "80px" }}
                  colSpan={4}
                >
                  <textarea
                    name="criteria_test_result"
                    value={form.criteria_test_result}
                    onChange={handleChange}
                    rows={3}
                    style={styles.textarea}
                  />
                </td>
              </tr>

              {/* Total Qty & Rejection Reason */}
              <tr>
                <td style={styles.labelCell} colSpan={2}>
                  Total Qty.-
                </td>
                <td style={styles.labelCell} colSpan={5}>
                  Rejection Reason
                </td>
              </tr>
              <tr>
                <td style={styles.inputCell} colSpan={2}>
                  <input
                    type="number"
                    step="0.01"
                    name="total_qty"
                    value={form.total_qty}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td
                  style={{ ...styles.inputCell, height: "60px" }}
                  colSpan={5}
                  rowSpan={2}
                >
                  <textarea
                    name="rejection_reason"
                    value={form.rejection_reason}
                    onChange={handleChange}
                    rows={3}
                    style={styles.textarea}
                  />
                </td>
              </tr>

              {/* Accepted Qty & Rejected Qty */}
              <tr>
                <td style={styles.labelCell}>Accepted Qty-</td>
                <td style={styles.labelCell}>Rejected Qty-</td>
              </tr>
              <tr>
                <td style={styles.inputCell}>
                  <input
                    type="number"
                    step="0.01"
                    name="accepted_qty"
                    value={form.accepted_qty}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell}>
                  <input
                    type="number"
                    step="0.01"
                    name="rejected_qty"
                    value={form.rejected_qty}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </td>
                <td style={styles.inputCell} colSpan={5}></td>
              </tr>

              {/* Signature Row */}
              <tr>
                <td
                  style={{
                    ...styles.labelCell,
                    textAlign: "center",
                    height: "150px",
                    verticalAlign: "bottom",
                  }}
                  colSpan={2}
                >
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={qcSignName}
                        onChange={(e) => setQcSignName(e.target.value)}
                        placeholder="QC Team Name"
                        style={{ ...styles.input, marginBottom: "4px" }}
                      />
                      <input
                        type="date"
                        value={qcSignDate}
                        onChange={(e) => setQcSignDate(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <SignaturePadField
                      label=""
                      fileValue={qcSignFile}
                      onChangeFile={setQcSignFile}
                    />
                  </div>
                  <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                    QC Team
                  </div>
                </td>

                <td
                  style={{
                    ...styles.labelCell,
                    textAlign: "center",
                    height: "150px",
                    verticalAlign: "bottom",
                  }}
                  colSpan={3}
                >
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={storeSignName}
                        onChange={(e) => setStoreSignName(e.target.value)}
                        placeholder="Store Team Name"
                        style={{ ...styles.input, marginBottom: "4px" }}
                      />
                      <input
                        type="date"
                        value={storeSignDate}
                        onChange={(e) => setStoreSignDate(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <SignaturePadField
                      label=""
                      fileValue={storeSignFile}
                      onChangeFile={setStoreSignFile}
                    />
                  </div>
                  <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                    Store Team
                  </div>
                </td>

                <td
                  style={{
                    ...styles.labelCell,
                    textAlign: "center",
                    height: "150px",
                    verticalAlign: "bottom",
                  }}
                  colSpan={2}
                >
                  <div>
                    <div style={{ marginBottom: "8px" }}>
                      <input
                        type="text"
                        value={piSignName}
                        onChange={(e) => setPiSignName(e.target.value)}
                        placeholder="Project Incharge Name"
                        style={{ ...styles.input, marginBottom: "4px" }}
                      />
                      <input
                        type="date"
                        value={piSignDate}
                        onChange={(e) => setPiSignDate(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <SignaturePadField
                      label=""
                      fileValue={piSignFile}
                      onChangeFile={setPiSignFile}
                    />
                  </div>
                  <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                    Project incharge
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>

      {/* ADDITIONAL SECTIONS (NOT IN PDF TABLE) */}
      <div
        style={{
          border: `1px solid ${borderColor}`,
          padding: "15px",
          marginTop: "20px",
          background: cardColor,
        }}
      >
        <h4
          style={{
            margin: "0 0 15px 0",
            color: borderColor,
          }}
        >
          📎 Additional Attachments (Not in PDF format)
        </h4>

        {/* Material Photos */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Material Photos
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setMaterialPhotos(Array.from(e.target.files || []))
            }
            style={{ marginBottom: "5px" }}
          />
          {materialPhotos.length > 0 && (
            <ul
              style={{
                marginTop: 8,
                fontSize: 12,
                paddingLeft: "20px",
              }}
            >
              {materialPhotos.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Attachments */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Attachments (Docs / Files)
          </label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setAttachments(Array.from(e.target.files || []))
            }
            style={{ marginBottom: "5px" }}
          />
          {attachments.length > 0 && (
            <ul
              style={{
                marginTop: 8,
                fontSize: 12,
                paddingLeft: "20px",
              }}
            >
              {attachments.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 8 }}>
            <label
              style={{
                fontSize: 12,
                display: "block",
                marginBottom: "3px",
              }}
            >
              Display Name (optional)
            </label>
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              style={{
                width: "100%",
                padding: 6,
                border: "1px solid #ccc",
              }}
              placeholder="e.g. Mill Test Certificate"
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <label
              style={{
                fontSize: 12,
                display: "block",
                marginBottom: "3px",
              }}
            >
              Description (optional)
            </label>
            <textarea
              rows={2}
              value={attachmentDescription}
              onChange={(e) =>
                setAttachmentDescription(e.target.value)
              }
              style={{
                width: "100%",
                padding: 6,
                border: "1px solid #ccc",
              }}
              placeholder="Short note..."
            />
          </div>
        </div>

        {/* Extra Fields */}
        <div>
          <label
            style={{
              fontWeight: "bold",
              display: "block",
              marginBottom: "5px",
            }}
          >
            Extra Fields (Modular)
          </label>
          <p
            style={{
              fontSize: 11,
              color: "#666",
              marginBottom: 8,
            }}
          >
            Custom fields stored in extra_data JSON
          </p>
          {extraFields.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr auto",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Key (e.g. gate_entry_no)"
                value={row.key}
                onChange={(e) =>
                  handleExtraChange(idx, "key", e.target.value)
                }
                style={{ padding: "6px", border: "1px solid #ccc" }}
              />
              <input
                type="text"
                placeholder="Value"
                value={row.value}
                onChange={(e) =>
                  handleExtraChange(idx, "value", e.target.value)
                }
                style={{ padding: "6px", border: "1px solid #ccc" }}
              />
              <button
                type="button"
                onClick={() => removeExtraRow(idx)}
                disabled={extraFields.length === 1}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  background: extraFields.length === 1 ? "#ccc" : ORANGE,
                  color: extraFields.length === 1 ? "#666" : "#222",
                  cursor:
                    extraFields.length === 1 ? "not-allowed" : "pointer",
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExtraRow}
            style={{
              padding: "8px 16px",
              background: ORANGE,
              color: "#222",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Add Extra Field
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: "12px 40px",
            fontSize: "16px",
            fontWeight: "bold",
            background: loading ? "#ccc" : ORANGE,
            color: loading ? "#666" : "#222",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          {loading ? "Creating MIR..." : "Create & Forward MIR"}
        </button>
      </div>
    </div>
  );
}
