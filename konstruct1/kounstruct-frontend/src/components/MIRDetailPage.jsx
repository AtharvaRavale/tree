// // src/pages/MIR/MIRDetailPage.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import {
//   getMIRById, // 👈 make sure ye wala export api.js me hai
//   acceptMIR,
//   rejectMIR,
//   forwardMIR,
//   getUsersByProject,
//   uploadMIRAttachments, // 👈 attachments
//   signMIRStore, // 👈 signatures
//   signMIRQc,
//   signMIRProjectIncharge,
//   updateMIR, // 👈 NEW: for editing details
// } from "../api";

// import SignaturePadField from "../components/SignaturePadField"; // 👈 same as create page

// // helper: numbers ko safe parse karo
// const parseNumber = (val) => {
//   if (val === "" || val === null || val === undefined) return null;
//   const num = Number(val);
//   return Number.isNaN(num) ? null : num;
// };

// export default function MIRDetailPage() {
//   const { id } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [mir, setMir] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(false);

//   // forward UI
//   const [forwardUsers, setForwardUsers] = useState([]);
//   const [selectedForwardUserId, setSelectedForwardUserId] = useState("");
//   const [forwardComment, setForwardComment] = useState("");

//   // attachments upload state
//   const [attachmentsFiles, setAttachmentsFiles] = useState([]);
//   const [attachmentName, setAttachmentName] = useState("");
//   const [attachmentDescription, setAttachmentDescription] = useState("");

//   // signatures upload state (file from pad OR upload)
//   const [storeSignFile, setStoreSignFile] = useState(null);
//   const [storeSignName, setStoreSignName] = useState("");
//   const [storeSignDate, setStoreSignDate] = useState("");

//   const [qcSignFile, setQcSignFile] = useState(null);
//   const [qcSignName, setQcSignName] = useState("");
//   const [qcSignDate, setQcSignDate] = useState("");

//   const [piSignFile, setPiSignFile] = useState(null);
//   const [piSignName, setPiSignName] = useState("");
//   const [piSignDate, setPiSignDate] = useState("");

//   // 🔹 editable form state
//   const [editForm, setEditForm] = useState(null);

//   const initialMode = searchParams.get("mode"); // e.g. /mir/5?mode=forward (abhi use nahi ho raha)

//   useEffect(() => {
//     if (!id) return;
//     fetchDetail();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchDetail = async () => {
//     try {
//       setLoading(true);
//       const res = await getMIRById(id);
//       const data = res?.data || res;
//       setMir(data);

//       // forward users ke liye, project_id se load
//       if (data?.project_id) {
//         try {
//           const uRes = await getUsersByProject(data.project_id);
//           const users = uRes?.data || [];
//           setForwardUsers(
//             users.map((u) => ({
//               id: u.id,
//               label:
//                 u.display_name ||
//                 [u.first_name, u.last_name].filter(Boolean).join(" ") ||
//                 u.username ||
//                 u.email ||
//                 `User #${u.id}`,
//             }))
//           );
//         } catch (err) {
//           console.warn("Forward users load failed", err);
//         }
//       }

//       // defaults for signature edit form
//       setStoreSignName(data.store_team_name || "");
//       setStoreSignDate(
//         data.store_team_sign_date
//           ? data.store_team_sign_date.substring(0, 10)
//           : ""
//       );
//       setQcSignName(data.qc_team_name || "");
//       setQcSignDate(
//         data.qc_team_sign_date
//           ? data.qc_team_sign_date.substring(0, 10)
//           : ""
//       );
//       setPiSignName(data.project_incharge_name || "");
//       setPiSignDate(
//         data.project_incharge_sign_date
//           ? data.project_incharge_sign_date.substring(0, 10)
//           : ""
//       );

//       // 🔹 editable fields pre-fill
//       setEditForm({
//         mir_number: data.mir_number || "",
//         location: data.location || "",
//         manufacturer_name: data.manufacturer_name || "",
//         certificate_no: data.certificate_no || "",
//         certificate_date: data.certificate_date
//           ? data.certificate_date.substring(0, 10)
//           : "",
//         material_id: data.material_id || "",
//         material_name: data.material_name || "",
//         material_specification: data.material_specification || "",
//         material_description: data.material_description || "",
//         material_unique_id: data.material_unique_id || "",
//         supplier_qc_report_no: data.supplier_qc_report_no || "",
//         supplier_qc_report_date: data.supplier_qc_report_date
//           ? data.supplier_qc_report_date.substring(0, 10)
//           : "",
//         details_of_inspection: data.details_of_inspection || "",
//         total_qty:
//           data.total_qty === null || data.total_qty === undefined
//             ? ""
//             : String(data.total_qty),
//         accepted_qty:
//           data.accepted_qty === null || data.accepted_qty === undefined
//             ? ""
//             : String(data.accepted_qty),
//         rejected_qty:
//           data.rejected_qty === null || data.rejected_qty === undefined
//             ? ""
//             : String(data.rejected_qty),
//         rejection_reason: data.rejection_reason || "",
//         visual_test_result: data.visual_test_result || "",
//         criteria_test_result: data.criteria_test_result || "",
//       });
//     } catch (err) {
//       console.error("Failed to load MIR detail", err);
//       toast.error("MIR detail load nahi ho paayi.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBack = () => {
//     navigate("/mir/inbox");
//   };

//   const handleAccept = async () => {
//     if (!mir?.id) return;
//     if (!window.confirm("Is MIR ko ACCEPT karna hai?")) return;

//     try {
//       setActionLoading(true);
//       await acceptMIR(mir.id, {
//         comment: "Accepted from detail page.",
//       });
//       toast.success("MIR accept ho gaya.");
//       await fetchDetail();
//     } catch (err) {
//       console.error("Accept MIR error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Accept karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!mir?.id) return;
//     const reason = window.prompt("Reject reason (optional):", "");
//     if (reason === null) return; // cancel

//     try {
//       setActionLoading(true);
//       await rejectMIR(mir.id, {
//         comment: reason || "Rejected from detail page.",
//       });
//       toast.success("MIR reject ho gaya.");
//       await fetchDetail();
//     } catch (err) {
//       console.error("Reject MIR error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Reject karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleForward = async () => {
//     if (!mir?.id) return;
//     if (!selectedForwardUserId) {
//       toast.error("Pehle user select karo jise forward karna hai.");
//       return;
//     }

//     try {
//       setActionLoading(true);
//       await forwardMIR(mir.id, {
//         to_user_id: Number(selectedForwardUserId),
//         comment: forwardComment || "",
//       });
//       toast.success("MIR forward ho gaya.");
//       setForwardComment("");
//       await fetchDetail(); // 👈 refresh so current_assignee/actions update ho jaye
//     } catch (err) {
//       console.error("Forward MIR error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Forward karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleUploadAttachments = async () => {
//     if (!mir?.id) return;
//     if (!attachmentsFiles.length) {
//       toast.error("Pehle kam se kam ek file select karo.");
//       return;
//     }

//     try {
//       setActionLoading(true);
//       const fd = new FormData();
//       attachmentsFiles.forEach((file) => {
//         fd.append("files", file); // backend: request.FILES.getlist("files")
//       });
//       if (attachmentName) fd.append("name", attachmentName);
//       if (attachmentDescription) fd.append("description", attachmentDescription);

//       await uploadMIRAttachments(mir.id, fd);
//       toast.success("Attachments upload ho gaye.");
//       setAttachmentsFiles([]);
//       setAttachmentName("");
//       setAttachmentDescription("");
//       await fetchDetail();
//     } catch (err) {
//       console.error("Attachments upload error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Attachments upload karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleStoreSignSave = async () => {
//     if (!mir?.id) return;
//     if (!storeSignFile) {
//       toast.error("Store team signature file/signature select karo.");
//       return;
//     }
//     try {
//       setActionLoading(true);
//       await signMIRStore(mir.id, {
//         name: storeSignName || undefined,
//         sign_date: storeSignDate || undefined,
//         file: storeSignFile,
//       });
//       toast.success("Store signature save ho gayi.");
//       setStoreSignFile(null);
//       await fetchDetail();
//     } catch (err) {
//       console.error("Store signature error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Store signature save karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleQcSignSave = async () => {
//     if (!mir?.id) return;
//     if (!qcSignFile) {
//       toast.error("QC team signature file/signature select karo.");
//       return;
//     }
//     try {
//       setActionLoading(true);
//       await signMIRQc(mir.id, {
//         name: qcSignName || undefined,
//         sign_date: qcSignDate || undefined,
//         file: qcSignFile,
//       });
//       toast.success("QC signature save ho gayi.");
//       setQcSignFile(null);
//       await fetchDetail();
//     } catch (err) {
//       console.error("QC signature error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "QC signature save karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handlePiSignSave = async () => {
//     if (!mir?.id) return;
//     if (!piSignFile) {
//       toast.error("Project incharge signature file/signature select karo.");
//       return;
//     }
//     try {
//       setActionLoading(true);
//       await signMIRProjectIncharge(mir.id, {
//         name: piSignName || undefined,
//         sign_date: piSignDate || undefined,
//         file: piSignFile,
//       });
//       toast.success("Project incharge signature save ho gayi.");
//       setPiSignFile(null);
//       await fetchDetail();
//     } catch (err) {
//       console.error("PI signature error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "Project incharge signature save karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // 🔹 edit form change handler
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // 🔹 update MIR details API
//   const handleUpdateDetails = async () => {
//     if (!mir?.id || !editForm) return;

//     const payload = {
//       mir_number: editForm.mir_number || "",
//       location: editForm.location || "",
//       manufacturer_name: editForm.manufacturer_name || "",
//       certificate_no: editForm.certificate_no || "",
//       certificate_date: editForm.certificate_date || null,

//       material_id: editForm.material_id || "",
//       material_name: editForm.material_name || "",
//       material_specification: editForm.material_specification || "",
//       material_description: editForm.material_description || "",
//       material_unique_id: editForm.material_unique_id || "",

//       supplier_qc_report_no: editForm.supplier_qc_report_no || "",
//       supplier_qc_report_date: editForm.supplier_qc_report_date || null,
//       details_of_inspection: editForm.details_of_inspection || "",

//       total_qty: parseNumber(editForm.total_qty),
//       accepted_qty: parseNumber(editForm.accepted_qty),
//       rejected_qty: parseNumber(editForm.rejected_qty),
//       rejection_reason: editForm.rejection_reason || "",
//       visual_test_result: editForm.visual_test_result || "",
//       criteria_test_result: editForm.criteria_test_result || "",
//     };

//     try {
//       setActionLoading(true);
//       await updateMIR(mir.id, payload);
//       toast.success("MIR details update ho gaye.");
//       await fetchDetail();
//     } catch (err) {
//       console.error("Update MIR details error", err);
//       const msg =
//         err.response?.data?.detail ||
//         err.response?.data?.error ||
//         "MIR details update karte time error aaya.";
//       toast.error(msg);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: 20 }}>
//         <button onClick={handleBack} style={{ marginBottom: 12 }}>
//           ← Back to Inbox
//         </button>
//         <div>Loading MIR...</div>
//       </div>
//     );
//   }

//   if (!mir) {
//     return (
//       <div style={{ padding: 20 }}>
//         <button onClick={handleBack} style={{ marginBottom: 12 }}>
//           ← Back to Inbox
//         </button>
//         <div>MIR not found.</div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       <button onClick={handleBack} style={{ marginBottom: 12 }}>
//         ← Back to Inbox
//       </button>

//       <h2 style={{ marginBottom: 8 }}>
//         MIR #{mir.mir_number || mir.id} (Project {mir.project_id})
//       </h2>
//       <p style={{ marginBottom: 16, fontSize: 14 }}>
//         <b>Status:</b> {mir.status} <br />
//         <b>Location:</b> {mir.location || "-"} <br />
//         <b>Created By:</b> {mir.created_by_name || "-"} <br />
//         <b>Current Assignee:</b> {mir.current_assignee_name || "-"} <br />
//         <b>Created At:</b>{" "}
//         {mir.created_at ? new Date(mir.created_at).toLocaleString() : "-"}
//       </p>

//       {/* 🔹 Editable MIR details */}
//       {editForm && (
//         <div style={cardStyle}>
//           <h3>MIR Details (Editable)</h3>

//           {/* MIR No + Location */}
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>MIR No (optional)</label>
//               <input
//                 type="text"
//                 name="mir_number"
//                 value={editForm.mir_number}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={editForm.location}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           {/* Manufacturer & Certificate */}
//           <h4>Manufacturer & Certificate</h4>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>Manufacturer Name</label>
//               <input
//                 type="text"
//                 name="manufacturer_name"
//                 value={editForm.manufacturer_name}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Certificate No</label>
//               <input
//                 type="text"
//                 name="certificate_no"
//                 value={editForm.certificate_no}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Certificate Date</label>
//               <input
//                 type="date"
//                 name="certificate_date"
//                 value={editForm.certificate_date}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           {/* Material Details */}
//           <h4>Material Details</h4>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>Material ID</label>
//               <input
//                 type="text"
//                 name="material_id"
//                 value={editForm.material_id}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Material Name</label>
//               <input
//                 type="text"
//                 name="material_name"
//                 value={editForm.material_name}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12 }}>Specification</label>
//             <textarea
//               name="material_specification"
//               value={editForm.material_specification}
//               onChange={handleEditChange}
//               rows={2}
//               style={{ width: "100%", padding: 8 }}
//             />
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12 }}>Description</label>
//             <textarea
//               name="material_description"
//               value={editForm.material_description}
//               onChange={handleEditChange}
//               rows={2}
//               style={{ width: "100%", padding: 8 }}
//             />
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12 }}>Unique ID / Serial / Type</label>
//             <input
//               type="text"
//               name="material_unique_id"
//               value={editForm.material_unique_id}
//               onChange={handleEditChange}
//               style={{ width: "100%", padding: 8 }}
//             />
//           </div>

//           {/* Supplier QC */}
//           <h4>Supplier QC Report</h4>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>QC Report No</label>
//               <input
//                 type="text"
//                 name="supplier_qc_report_no"
//                 value={editForm.supplier_qc_report_no}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>QC Report Date</label>
//               <input
//                 type="date"
//                 name="supplier_qc_report_date"
//                 value={editForm.supplier_qc_report_date}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12 }}>Details of Inspection</label>
//             <textarea
//               name="details_of_inspection"
//               value={editForm.details_of_inspection}
//               onChange={handleEditChange}
//               rows={3}
//               style={{ width: "100%", padding: 8 }}
//             />
//           </div>

//           {/* Quantity & Result */}
//           <h4>Quantity & Result</h4>
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>Total Qty</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="total_qty"
//                 value={editForm.total_qty}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Accepted Qty</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="accepted_qty"
//                 value={editForm.accepted_qty}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Rejected Qty</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 name="rejected_qty"
//                 value={editForm.rejected_qty}
//                 onChange={handleEditChange}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr",
//               gap: 16,
//               marginBottom: 16,
//             }}
//           >
//             <div>
//               <label style={{ fontSize: 12 }}>Rejection Reason</label>
//               <textarea
//                 name="rejection_reason"
//                 value={editForm.rejection_reason}
//                 onChange={handleEditChange}
//                 rows={2}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//             <div>
//               <label style={{ fontSize: 12 }}>Visual Test Result</label>
//               <textarea
//                 name="visual_test_result"
//                 value={editForm.visual_test_result}
//                 onChange={handleEditChange}
//                 rows={2}
//                 style={{ width: "100%", padding: 8 }}
//               />
//             </div>
//           </div>

//           <div style={{ marginBottom: 16 }}>
//             <label style={{ fontSize: 12 }}>Criteria Test Result</label>
//             <textarea
//               name="criteria_test_result"
//               value={editForm.criteria_test_result}
//               onChange={handleEditChange}
//               rows={2}
//               style={{ width: "100%", padding: 8 }}
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleUpdateDetails}
//             disabled={actionLoading}
//             style={{
//               padding: "6px 12px",
//               borderRadius: 4,
//               border: "none",
//               background: "#4f46e5",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             {actionLoading ? "Updating..." : "Update MIR Details"}
//           </button>
//         </div>
//       )}

//       {/* ✅ Material Photos gallery */}
//       {Array.isArray(mir.material_images) && mir.material_images.length > 0 && (
//         <div style={cardStyle}>
//           <h3>Material Photos</h3>
//           <div
//             style={{
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 12,
//               marginTop: 8,
//             }}
//           >
//             {mir.material_images.map((img) => (
//               <div key={img.id} style={{ width: 150 }}>
//                 <div
//                   style={{
//                     borderRadius: 8,
//                     overflow: "hidden",
//                     border: "1px solid #ddd",
//                   }}
//                 >
//                   <img
//                     src={img.image}
//                     alt={img.caption || "Material image"}
//                     style={{
//                       width: "100%",
//                       height: 110,
//                       objectFit: "cover",
//                       display: "block",
//                     }}
//                   />
//                 </div>
//                 <div style={{ fontSize: 11, marginTop: 4 }}>
//                   {img.caption || "—"}
//                   <br />
//                   {img.created_at
//                     ? new Date(img.created_at).toLocaleString()
//                     : ""}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ✅ Attachments list + upload */}
//       <div style={cardStyle}>
//         <h3>Attachments</h3>

//         {Array.isArray(mir.attachments) && mir.attachments.length > 0 ? (
//           <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 12 }}>
//             {mir.attachments.map((att) => (
//               <li key={att.id} style={{ marginBottom: 6 }}>
//                 <a
//                   href={att.file}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   style={{ fontWeight: 500 }}
//                 >
//                   {att.name ||
//                     (att.file && att.file.split("/").slice(-1)[0]) ||
//                     "Attachment"}
//                 </a>
//                 {att.description && (
//                   <span style={{ marginLeft: 6, color: "#555" }}>
//                     – {att.description}
//                   </span>
//                 )}
//                 <div style={{ fontSize: 11, color: "#777" }}>
//                   {att.uploaded_by_name && <>By {att.uploaded_by_name} · </>}
//                   {att.created_at &&
//                     new Date(att.created_at).toLocaleString()}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p style={{ fontSize: 13, color: "#777", marginBottom: 12 }}>
//             Abhi tak koi attachment nahi hai.
//           </p>
//         )}

//         <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8 }}>
//           <h4 style={{ fontSize: 14, marginBottom: 6 }}>
//             Add / Update Attachments
//           </h4>
//           <input
//             type="file"
//             multiple
//             onChange={(e) =>
//               setAttachmentsFiles(Array.from(e.target.files || []))
//             }
//           />
//           {attachmentsFiles.length > 0 && (
//             <ul style={{ marginTop: 6, fontSize: 12 }}>
//               {attachmentsFiles.map((file, idx) => (
//                 <li key={idx}>{file.name}</li>
//               ))}
//             </ul>
//           )}

//           <div style={{ marginTop: 6 }}>
//             <label style={{ fontSize: 12 }}>Display Name (optional)</label>
//             <input
//               type="text"
//               value={attachmentName}
//               onChange={(e) => setAttachmentName(e.target.value)}
//               style={{ width: "100%", padding: 6 }}
//               placeholder="e.g. Mill Test Certificate"
//             />
//           </div>

//           <div style={{ marginTop: 6 }}>
//             <label style={{ fontSize: 12 }}>Description (optional)</label>
//             <textarea
//               rows={2}
//               value={attachmentDescription}
//               onChange={(e) => setAttachmentDescription(e.target.value)}
//               style={{ width: "100%", padding: 6 }}
//               placeholder="Short note about these files..."
//             />
//           </div>

//           <button
//             type="button"
//             onClick={handleUploadAttachments}
//             disabled={actionLoading}
//             style={{
//               marginTop: 8,
//               padding: "6px 12px",
//               borderRadius: 4,
//               border: "none",
//               background: "#0f766e",
//               color: "#fff",
//               cursor: "pointer",
//             }}
//           >
//             Upload Attachments
//           </button>
//         </div>
//       </div>

//       {/* Actions */}
//       <div style={cardStyle}>
//         <h3>Take Action</h3>
//         <div
//           style={{
//             display: "flex",
//             gap: 8,
//             marginBottom: 12,
//             flexWrap: "wrap",
//           }}
//         >
//           <button
//             type="button"
//             onClick={handleAccept}
//             disabled={actionLoading}
//             style={btnAcceptStyle}
//           >
//             {actionLoading ? "..." : "Accept"}
//           </button>

//           <button
//             type="button"
//             onClick={handleReject}
//             disabled={actionLoading}
//             style={btnRejectStyle}
//           >
//             Reject
//           </button>
//         </div>

//         <div style={{ marginTop: 12 }}>
//           <h4>Forward MIR</h4>
//           <div style={{ marginBottom: 8 }}>
//             <label style={{ fontSize: 12 }}>Forward To User</label>
//             <select
//               value={selectedForwardUserId}
//               onChange={(e) => setSelectedForwardUserId(e.target.value)}
//               style={{ padding: 6, minWidth: 220 }}
//             >
//               <option value="">Select user...</option>
//               {forwardUsers.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div style={{ marginBottom: 8 }}>
//             <label style={{ fontSize: 12 }}>Comment (optional)</label>
//             <textarea
//               rows={2}
//               value={forwardComment}
//               onChange={(e) => setForwardComment(e.target.value)}
//               style={{ width: "100%", padding: 6 }}
//             />
//           </div>
//           <button
//             type="button"
//             onClick={handleForward}
//             disabled={actionLoading}
//             style={btnForwardStyle}
//           >
//             Forward
//           </button>
//         </div>
//       </div>

//       {/* ✅ Signatures block (view + update) */}
//       <div style={cardStyle}>
//         <h3>Signatures</h3>

//         {/* existing signatures display */}
//         <SignatureRow
//           title="Store Team"
//           name={mir.store_team_name}
//           date={mir.store_team_sign_date}
//           image={mir.store_team_sign}
//         />

//         <SignatureRow
//           title="QC Team"
//           name={mir.qc_team_name}
//           date={mir.qc_team_sign_date}
//           image={mir.qc_team_sign}
//         />

//         <SignatureRow
//           title="Project Incharge"
//           name={mir.project_incharge_name}
//           date={mir.project_incharge_sign_date}
//           image={mir.project_incharge_sign}
//         />

//         {/* update / add signatures (with pad + upload) */}
//         <div
//           style={{
//             marginTop: 12,
//             borderTop: "1px dashed #e5e7eb",
//             paddingTop: 8,
//           }}
//         >
//           <h4 style={{ fontSize: 14, marginBottom: 6 }}>
//             Add / Update Signatures
//           </h4>

//           {/* Store Team edit */}
//           <div style={signatureEditRowStyle}>
//             <div style={{ minWidth: 130, fontWeight: 600 }}>Store Team</div>
//             <div style={{ fontSize: 13 }}>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Name (optional)</label>
//                 <input
//                   type="text"
//                   value={storeSignName}
//                   onChange={(e) => setStoreSignName(e.target.value)}
//                   style={{ width: "100%", padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
//                 <input
//                   type="date"
//                   value={storeSignDate}
//                   onChange={(e) => setStoreSignDate(e.target.value)}
//                   style={{ padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 {/* SignaturePadField: draw OR upload image */}
//                 <SignaturePadField
//                   label="Store Team Signature (draw or upload)"
//                   fileValue={storeSignFile}
//                   onChangeFile={setStoreSignFile}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handleStoreSignSave}
//                 disabled={actionLoading}
//                 style={btnSmall}
//               >
//                 Save Store Signature
//               </button>
//             </div>
//           </div>

//           {/* QC Team edit */}
//           <div style={signatureEditRowStyle}>
//             <div style={{ minWidth: 130, fontWeight: 600 }}>QC Team</div>
//             <div style={{ fontSize: 13 }}>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Name (optional)</label>
//                 <input
//                   type="text"
//                   value={qcSignName}
//                   onChange={(e) => setQcSignName(e.target.value)}
//                   style={{ width: "100%", padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
//                 <input
//                   type="date"
//                   value={qcSignDate}
//                   onChange={(e) => setQcSignDate(e.target.value)}
//                   style={{ padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 <SignaturePadField
//                   label="QC Team Signature (draw or upload)"
//                   fileValue={qcSignFile}
//                   onChangeFile={setQcSignFile}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handleQcSignSave}
//                 disabled={actionLoading}
//                 style={btnSmall}
//               >
//                 Save QC Signature
//               </button>
//             </div>
//           </div>

//           {/* Project Incharge edit */}
//           <div style={signatureEditRowStyle}>
//             <div style={{ minWidth: 130, fontWeight: 600 }}>
//               Project Incharge
//             </div>
//             <div style={{ fontSize: 13 }}>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Name (optional)</label>
//                 <input
//                   type="text"
//                   value={piSignName}
//                   onChange={(e) => setPiSignName(e.target.value)}
//                   style={{ width: "100%", padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
//                 <input
//                   type="date"
//                   value={piSignDate}
//                   onChange={(e) => setPiSignDate(e.target.value)}
//                   style={{ padding: 6 }}
//                 />
//               </div>
//               <div style={{ marginBottom: 4 }}>
//                 <SignaturePadField
//                   label="Project Incharge Signature (draw or upload)"
//                   fileValue={piSignFile}
//                   onChangeFile={setPiSignFile}
//                 />
//               </div>
//               <button
//                 type="button"
//                 onClick={handlePiSignSave}
//                 disabled={actionLoading}
//                 style={btnSmall}
//               >
//                 Save PI Signature
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* History */}
//       {Array.isArray(mir.actions) && mir.actions.length > 0 && (
//         <div style={cardStyle}>
//           <h3>Workflow History</h3>
//           <ul style={{ fontSize: 13, paddingLeft: 20 }}>
//             {mir.actions.map((a) => (
//               <li key={a.id} style={{ marginBottom: 4 }}>
//                 <b>{a.action}</b> —{" "}
//                 {a.from_user_name || "Unknown"} → {a.to_user_name || "-"} |{" "}
//                 {a.comment || "-"} |{" "}
//                 {a.created_at
//                   ? new Date(a.created_at).toLocaleString()
//                   : ""}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// /* ---------- Small presentational helpers ---------- */

// const cardStyle = {
//   border: "1px solid #ddd",
//   borderRadius: 8,
//   padding: 12,
//   marginBottom: 16,
// };

// const btnAcceptStyle = {
//   padding: "6px 12px",
//   borderRadius: 4,
//   border: "none",
//   background: "#16a34a",
//   color: "#fff",
//   cursor: "pointer",
// };

// const btnRejectStyle = {
//   padding: "6px 12px",
//   borderRadius: 4,
//   border: "none",
//   background: "#dc2626",
//   color: "#fff",
//   cursor: "pointer",
// };

// const btnForwardStyle = {
//   padding: "6px 12px",
//   borderRadius: 4,
//   border: "none",
//   background: "#2563eb",
//   color: "#fff",
//   cursor: "pointer",
// };

// const btnSmall = {
//   padding: "4px 10px",
//   borderRadius: 4,
//   border: "none",
//   background: "#2563eb",
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: 12,
// };

// const signatureEditRowStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   gap: 12,
//   marginTop: 8,
// };

// function SignatureRow({ title, name, date, image }) {
//   const hasImage = !!image;

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "flex-start",
//         gap: 12,
//         marginTop: 8,
//         borderTop: "1px dashed #e5e7eb",
//         paddingTop: 8,
//       }}
//     >
//       <div style={{ minWidth: 130, fontWeight: 600 }}>{title}</div>
//       <div style={{ fontSize: 13 }}>
//         <div>
//           <b>Name:</b> {name || "—"}
//         </div>
//         <div>
//           <b>Signed At:</b>{" "}
//           {date ? new Date(date).toLocaleString() : "—"}
//         </div>
//         {hasImage ? (
//           <div
//             style={{
//               marginTop: 6,
//               border: "1px solid #ddd",
//               borderRadius: 6,
//               padding: 4,
//               display: "inline-block",
//               background: "#f9fafb",
//             }}
//           >
//             <img
//               src={image}
//               alt={`${title} signature`}
//               style={{
//                 maxWidth: 220,
//                 maxHeight: 80,
//                 objectFit: "contain",
//                 display: "block",
//               }}
//             />
//           </div>
//         ) : (
//           <div style={{ marginTop: 4, fontSize: 12, color: "#888" }}>
//             No signature uploaded yet.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// src/pages/MIR/MIRDetailPage.jsx


import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getMIRById,
  acceptMIR,
  rejectMIR,
  forwardMIR,
  getUsersByProject,
  uploadMIRAttachments,
  signMIRStore,
  signMIRQc,
  signMIRProjectIncharge,
  updateMIR,
  uploadMIRLogo,
} from "../api";

import SignaturePadField from "../components/SignaturePadField";
import { useTheme } from "../ThemeContext"; // 👈 theme import

// THEME PALETTE
const ORANGE = "#ffbe63";
const BG_OFFWHITE = "#fcfaf7";

const parseNumber = (val) => {
  if (val === "" || val === null || val === undefined) return null;
  const num = Number(val);
  return Number.isNaN(num) ? null : num;
};

export default function MIRDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // theme-based colors
  const bgColor = theme === "dark" ? "#191922" : BG_OFFWHITE;
  const cardColor = theme === "dark" ? "#23232c" : "#fff";
  const borderColor = ORANGE;
  const textColor = theme === "dark" ? "#fff" : "#222";
  const iconColor = ORANGE; // (future use if needed)

  const [mir, setMir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // forward UI
  const [forwardUsers, setForwardUsers] = useState([]);
  const [selectedForwardUserId, setSelectedForwardUserId] = useState("");
  const [forwardComment, setForwardComment] = useState("");

  // attachments upload state
  const [attachmentsFiles, setAttachmentsFiles] = useState([]);
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentDescription, setAttachmentDescription] = useState("");

  // signatures upload state
  const [storeSignFile, setStoreSignFile] = useState(null);
  const [storeSignName, setStoreSignName] = useState("");
  const [storeSignDate, setStoreSignDate] = useState("");

  const [qcSignFile, setQcSignFile] = useState(null);
  const [qcSignName, setQcSignName] = useState("");
  const [qcSignDate, setQcSignDate] = useState("");

  const [piSignFile, setPiSignFile] = useState(null);
  const [piSignName, setPiSignName] = useState("");
  const [piSignDate, setPiSignDate] = useState("");

  const [logoFile, setLogoFile] = useState(null);

  // editable form state
  const [editForm, setEditForm] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const initialMode = searchParams.get("mode");

  // PDF ref – only this block will be exported
  const pdfRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getMIRById(id);
      const data = res?.data || res;
      setMir(data);

      if (data?.project_id) {
        try {
          const uRes = await getUsersByProject(data.project_id);
          const users = uRes?.data || [];
          setForwardUsers(
            users.map((u) => ({
              id: u.id,
              label:
                u.display_name ||
                [u.first_name, u.last_name].filter(Boolean).join(" ") ||
                u.username ||
                u.email ||
                `User #${u.id}`,
            }))
          );
        } catch (err) {
          console.warn("Forward users load failed", err);
        }
      }

      setStoreSignName(data.store_team_name || "");
      setStoreSignDate(
        data.store_team_sign_date
          ? data.store_team_sign_date.substring(0, 10)
          : ""
      );
      setQcSignName(data.qc_team_name || "");
      setQcSignDate(
        data.qc_team_sign_date ? data.qc_team_sign_date.substring(0, 10) : ""
      );
      setPiSignName(data.project_incharge_name || "");
      setPiSignDate(
        data.project_incharge_sign_date
          ? data.project_incharge_sign_date.substring(0, 10)
          : ""
      );

      // editable fields including headings + date
      setEditForm({
        ims_title: data.ims_title || "INTEGRATED MANAGEMENT SYSTEM",
        report_title: data.report_title || "MATERIAL INSPECTION REPORT",
        company_name: data.company_name || "ARKADE DEVELOPERS LTD",
        date: data.date ? data.date.substring(0, 10) : "",

        mir_number: data.mir_number || "",
        location: data.location || "",
        manufacturer_name: data.manufacturer_name || "",
        certificate_no: data.certificate_no || "",
        certificate_date: data.certificate_date
          ? data.certificate_date.substring(0, 10)
          : "",
        material_id: data.material_id || "",
        material_name: data.material_name || "",
        material_specification: data.material_specification || "",
        material_description: data.material_description || "",
        material_unique_id: data.material_unique_id || "",
        supplier_qc_report_no: data.supplier_qc_report_no || "",
        supplier_qc_report_date: data.supplier_qc_report_date
          ? data.supplier_qc_report_date.substring(0, 10)
          : "",
        details_of_inspection: data.details_of_inspection || "",
        total_qty:
          data.total_qty === null || data.total_qty === undefined
            ? ""
            : String(data.total_qty),
        accepted_qty:
          data.accepted_qty === null || data.accepted_qty === undefined
            ? ""
            : String(data.accepted_qty),
        rejected_qty:
          data.rejected_qty === null || data.rejected_qty === undefined
            ? ""
            : String(data.rejected_qty),
        rejection_reason: data.rejection_reason || "",
        visual_test_result: data.visual_test_result || "",
        criteria_test_result: data.criteria_test_result || "",
      });
    } catch (err) {
      console.error("Failed to load MIR detail", err);
      toast.error("MIR detail load nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/mir/inbox");
  };

  const handleAccept = async () => {
    if (!mir?.id) return;
    if (!window.confirm("Is MIR ko ACCEPT karna hai?")) return;

    try {
      setActionLoading(true);
      await acceptMIR(mir.id, {
        comment: "Accepted from detail page.",
      });
      toast.success("MIR accept ho gaya.");
      await fetchDetail();
    } catch (err) {
      console.error("Accept MIR error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Accept karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!mir?.id) return;
    const reason = window.prompt("Reject reason (optional):", "");
    if (reason === null) return;

    try {
      setActionLoading(true);
      await rejectMIR(mir.id, {
        comment: reason || "Rejected from detail page.",
      });
      toast.success("MIR reject ho gaya.");
      await fetchDetail();
    } catch (err) {
      console.error("Reject MIR error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Reject karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleForward = async () => {
    if (!mir?.id) return;
    if (!selectedForwardUserId) {
      toast.error("Pehle user select karo jise forward karna hai.");
      return;
    }

    try {
      setActionLoading(true);
      await forwardMIR(mir.id, {
        to_user_id: Number(selectedForwardUserId),
        comment: forwardComment || "",
      });
      toast.success("MIR forward ho gaya.");
      setForwardComment("");
      await fetchDetail();
    } catch (err) {
      console.error("Forward MIR error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Forward karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadAttachments = async () => {
    if (!mir?.id) return;
    if (!attachmentsFiles.length) {
      toast.error("Pehle kam se kam ek file select karo.");
      return;
    }

    try {
      setActionLoading(true);
      const fd = new FormData();
      attachmentsFiles.forEach((file) => {
        fd.append("files", file);
      });
      if (attachmentName) fd.append("name", attachmentName);
      if (attachmentDescription)
        fd.append("description", attachmentDescription);

      await uploadMIRAttachments(mir.id, fd);
      toast.success("Attachments upload ho gaye.");
      setAttachmentsFiles([]);
      setAttachmentName("");
      setAttachmentDescription("");
      await fetchDetail();
    } catch (err) {
      console.error("Attachments upload error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Attachments upload karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!mir?.id) return;

    if (!logoFile) {
      toast.error("Pehle logo file select karo.");
      return;
    }

    try {
      setActionLoading(true);
      const fd = new FormData();
      fd.append("logo", logoFile);

      await uploadMIRLogo(mir.id, fd);
      toast.success("MIR logo upload/update ho gaya.");

      setLogoFile(null);
      await fetchDetail();
    } catch (err) {
      console.error("Logo upload error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Logo upload karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStoreSignSave = async () => {
    if (!mir?.id) return;
    if (!storeSignFile) {
      toast.error("Store team signature file/signature select karo.");
      return;
    }
    try {
      setActionLoading(true);
      await signMIRStore(mir.id, {
        name: storeSignName || undefined,
        sign_date: storeSignDate || undefined,
        file: storeSignFile,
      });
      toast.success("Store signature save ho gayi.");
      setStoreSignFile(null);
      await fetchDetail();
    } catch (err) {
      console.error("Store signature error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Store signature save karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQcSignSave = async () => {
    if (!mir?.id) return;
    if (!qcSignFile) {
      toast.error("QC team signature file/signature select karo.");
      return;
    }
    try {
      setActionLoading(true);
      await signMIRQc(mir.id, {
        name: qcSignName || undefined,
        sign_date: qcSignDate || undefined,
        file: qcSignFile,
      });
      toast.success("QC signature save ho gayi.");
      setQcSignFile(null);
      await fetchDetail();
    } catch (err) {
      console.error("QC signature error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "QC signature save karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePiSignSave = async () => {
    if (!mir?.id) return;
    if (!piSignFile) {
      toast.error("Project incharge signature file/signature select karo.");
      return;
    }
    try {
      setActionLoading(true);
      await signMIRProjectIncharge(mir.id, {
        name: piSignName || undefined,
        sign_date: piSignDate || undefined,
        file: piSignFile,
      });
      toast.success("Project incharge signature save ho gayi.");
      setPiSignFile(null);
      await fetchDetail();
    } catch (err) {
      console.error("PI signature error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Project incharge signature save karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateDetails = async () => {
    if (!mir?.id || !editForm) return;

    const payload = {
      ims_title: editForm.ims_title || "",
      report_title: editForm.report_title || "",
      company_name: editForm.company_name || "",
      date: editForm.date || null,

      mir_number: editForm.mir_number || "",
      location: editForm.location || "",
      manufacturer_name: editForm.manufacturer_name || "",
      certificate_no: editForm.certificate_no || "",
      certificate_date: editForm.certificate_date || null,

      material_id: editForm.material_id || "",
      material_name: editForm.material_name || "",
      material_specification: editForm.material_specification || "",
      material_description: editForm.material_description || "",
      material_unique_id: editForm.material_unique_id || "",

      supplier_qc_report_no: editForm.supplier_qc_report_no || "",
      supplier_qc_report_date: editForm.supplier_qc_report_date || null,
      details_of_inspection: editForm.details_of_inspection || "",

      total_qty: parseNumber(editForm.total_qty),
      accepted_qty: parseNumber(editForm.accepted_qty),
      rejected_qty: parseNumber(editForm.rejected_qty),
      rejection_reason: editForm.rejection_reason || "",
      visual_test_result: editForm.visual_test_result || "",
      criteria_test_result: editForm.criteria_test_result || "",
    };

    try {
      setActionLoading(true);
      await updateMIR(mir.id, payload);
      toast.success("MIR details update ho gaye.");
      setIsEditing(false);
      await fetchDetail();
    } catch (err) {
      console.error("Update MIR details error", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "MIR details update karte time error aaya.";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // EXPORT PDF
  const handleExportPdf = () => {
    if (!pdfRef.current || !mir) {
      toast.error("PDF content ready nahi hai.");
      return;
    }

    try {
      const printContents = pdfRef.current.innerHTML;
      const win = window.open("", "", "height=800,width=1000");

      if (!win) {
        toast.error("Popup blocked ho gaya. Please allow popups.");
        return;
      }

      win.document.write(`
      <html>
        <head>
          <title>MIR ${mir.mir_number || `#${mir.id}`}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 5mm;
            }
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
            }
            body {
              font-family: Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            #mir-pdf-sheet {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 0 !important;
            }
            #mir-pdf-sheet table {
              border-collapse: collapse;
              width: 100%;
            }
            #mir-pdf-sheet td {
              border: 1px solid #000;
              font-size: 9px !important;
              padding: 2px 3px !important;
              vertical-align: top;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);

      win.document.close();
      win.focus();
      win.print();
    } catch (e) {
      console.error("PDF export error", e);
      toast.error("PDF export mein error aaya.");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: 20,
          background: bgColor,
          color: textColor,
          minHeight: "100vh",
        }}
      >
        <button onClick={handleBack} style={{ marginBottom: 12 }}>
          ← Back to Inbox
        </button>
        <div>Loading MIR...</div>
      </div>
    );
  }

  if (!mir) {
    return (
      <div
        style={{
          padding: 20,
          background: bgColor,
          color: textColor,
          minHeight: "100vh",
        }}
      >
        <button onClick={handleBack} style={{ marginBottom: 12 }}>
          ← Back to Inbox
        </button>
        <div>MIR not found.</div>
      </div>
    );
  }

  return (
    <div
      id="mir-print-root"
      style={{
        maxWidth: "1200px",
        margin: "20px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: bgColor,
        color: textColor,
        borderRadius: 12,
      }}
    >
      {/* Top buttons */}
      <button
        onClick={handleBack}
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          background: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Back to Inbox
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(!isEditing)}
        style={{
          padding: "4px 12px",
          fontSize: "11px",
          background: isEditing ? "#6b7280" : ORANGE,
          color: isEditing ? "#fff" : "#222",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
          marginLeft: 8,
        }}
      >
        {isEditing ? "Cancel Edit" : " Edit Mode"}
      </button>
      <button
        type="button"
        onClick={handleExportPdf}
        style={{ ...btnExportStyle, marginLeft: 8 }}
      >
        ⬇ Export PDF
      </button>

      {/* Meta info */}
      <div style={{ marginTop: 8, marginBottom: 16, fontSize: 13 }}>
        <div>
          <strong>MIR ID:</strong> #{mir.id}
        </div>
        <div>
          <strong>Created By:</strong> {mir.created_by_name || "-"}
        </div>
        <div>
          <strong>Current Assignee:</strong>{" "}
          {mir.current_assignee_name || "-"}
        </div>
        <div>
          <strong>Created At:</strong>{" "}
          {mir.created_at ? new Date(mir.created_at).toLocaleString() : "-"}
        </div>
      </div>

      {/* PDF AREA */}
      <div ref={pdfRef}>
        <div
          id="mir-pdf-sheet"
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
              padding: "5px",
              background: BG_OFFWHITE,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              {/* LEFT SPACER */}
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  visibility: "hidden",
                  flexShrink: 0,
                }}
              />

              {/* CENTER TITLE */}
              <div style={{ flex: 1, textAlign: "center" }}>
                {isEditing && editForm ? (
                  <input
                    type="text"
                    name="ims_title"
                    value={editForm.ims_title || ""}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "18px",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                    }}
                  />
                ) : (
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {mir.ims_title || "INTEGRATED MANAGEMENT SYSTEM"}
                  </div>
                )}
              </div>

              {/* RIGHT LOGO */}
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  border: mir.logo ? "none" : "2px solid #000",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fff",
                  flexShrink: 0,
                }}
              >
                {mir.logo ? (
                  <img
                    src={mir.logo}
                    alt="MIR Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                ) : (
                  <span style={{ fontWeight: "bold", fontSize: "10px" }}>
                    LOGO
                  </span>
                )}
              </div>
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
            {isEditing && editForm ? (
              <input
                type="text"
                name="report_title"
                value={editForm.report_title || ""}
                onChange={handleEditChange}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "16px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            ) : (
              <span>
                {mir.report_title || "MATERIAL INSPECTION REPORT"}
              </span>
            )}
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
            {isEditing && editForm ? (
              <input
                type="text"
                name="company_name"
                value={editForm.company_name || ""}
                onChange={handleEditChange}
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20px",
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            ) : (
              <span>{mir.company_name || "ARKADE DEVELOPERS LTD"}</span>
            )}
          </div>

          {/* Doc Number + Status */}
          <div
            style={{
              borderBottom: "2px solid #000",
              padding: "8px 15px",
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>DOC NO: ADL/QA/MIR/IMF/07</span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  fontSize: "11px",
                  background:
                    mir.status === "ACCEPTED"
                      ? "#10b981"
                      : mir.status === "REJECTED"
                      ? "#ef4444"
                      : ORANGE,
                  color: "white",
                }}
              >
                {mir.status}
              </span>
            </div>
          </div>

          {/* PDF TABLE LAYOUT */}
          {editForm && (
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
                    {isEditing ? (
                      <input
                        type="date"
                        name="date"
                        value={editForm.date || ""}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.date
                          ? new Date(mir.date).toLocaleDateString()
                          : mir.created_at
                          ? new Date(mir.created_at).toLocaleDateString()
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.labelCell}>Location-</td>
                  <td style={styles.inputCell} colSpan={3}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.location || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* MIR No Row */}
                <tr>
                  <td style={styles.labelCell}>MIR No -</td>
                  <td style={styles.inputCell} colSpan={6}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="mir_number"
                        value={editForm.mir_number}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.mir_number || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Manufacturer Name Row */}
                <tr>
                  <td style={styles.labelCell}>Manufacturer Name -</td>
                  <td style={styles.inputCell} colSpan={6}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="manufacturer_name"
                        value={editForm.manufacturer_name}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.manufacturer_name || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Certificate No & Date Row */}
                <tr>
                  <td style={styles.labelCell}>Certificate No & Date -</td>
                  <td style={styles.inputCell} colSpan={3}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="certificate_no"
                        value={editForm.certificate_no}
                        onChange={handleEditChange}
                        placeholder="Certificate No"
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.certificate_no || "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.inputCell} colSpan={3}>
                    {isEditing ? (
                      <input
                        type="date"
                        name="certificate_date"
                        value={editForm.certificate_date}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.certificate_date
                          ? new Date(
                              mir.certificate_date
                            ).toLocaleDateString()
                          : "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Material ID, Name, Specification */}
                <tr>
                  <td style={styles.labelCell}>Material ID</td>
                  <td style={styles.labelCell}>Material Name</td>
                  <td style={styles.labelCell} colSpan={5}>
                    Material Specification
                  </td>
                </tr>
                <tr>
                  <td style={styles.inputCell}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="material_id"
                        value={editForm.material_id}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.material_id || "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.inputCell}>
                    {isEditing ? (
                      <input
                        type="text"
                        name="material_name"
                        value={editForm.material_name}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.material_name || "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.inputCell} colSpan={5}>
                    {isEditing ? (
                      <textarea
                        name="material_specification"
                        value={editForm.material_specification}
                        onChange={handleEditChange}
                        rows={2}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.material_specification || "-"}
                      </span>
                    )}
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
                    {isEditing ? (
                      <textarea
                        name="material_description"
                        value={editForm.material_description}
                        onChange={handleEditChange}
                        rows={3}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.material_description || "-"}
                      </span>
                    )}
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
                    {isEditing ? (
                      <input
                        type="text"
                        name="material_unique_id"
                        value={editForm.material_unique_id}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.material_unique_id || "-"}
                      </span>
                    )}
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
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="supplier_qc_report_no"
                          value={editForm.supplier_qc_report_no}
                          onChange={handleEditChange}
                          placeholder="Report No"
                          style={{ ...styles.input, marginBottom: "4px" }}
                        />
                        <input
                          type="date"
                          name="supplier_qc_report_date"
                          value={editForm.supplier_qc_report_date}
                          onChange={handleEditChange}
                          style={styles.input}
                        />
                      </>
                    ) : (
                      <div>
                        <div style={styles.displayText}>
                          {mir.supplier_qc_report_no || "-"}
                        </div>
                        <div style={styles.displayText}>
                          {mir.supplier_qc_report_date
                            ? new Date(
                                mir.supplier_qc_report_date
                              ).toLocaleDateString()
                            : "-"}
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={styles.inputCell} colSpan={4} rowSpan={2}>
                    {isEditing ? (
                      <textarea
                        name="details_of_inspection"
                        value={editForm.details_of_inspection}
                        onChange={handleEditChange}
                        rows={5}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.details_of_inspection || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Supplier Test Certificate (static disabled inputs) */}
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
                      disabled
                    />
                  </td>
                  <td style={styles.inputCell}>
                    <input
                      type="text"
                      style={styles.smallInput}
                      placeholder="Max"
                      disabled
                    />
                  </td>
                  <td style={styles.inputCell}>
                    <input
                      type="text"
                      style={styles.smallInput}
                      placeholder="Min"
                      disabled
                    />
                  </td>
                  <td style={styles.inputCell} colSpan={2}>
                    <input
                      type="text"
                      style={styles.input}
                      placeholder="Actual Value"
                      disabled
                    />
                  </td>
                  <td style={styles.inputCell}>
                    <input
                      type="text"
                      style={styles.smallInput}
                      placeholder="Min"
                      disabled
                    />
                  </td>
                  <td style={styles.inputCell}>
                    <input
                      type="text"
                      style={styles.smallInput}
                      placeholder="Max"
                      disabled
                    />
                  </td>
                </tr>

                {/* Doc Reference */}
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
                      disabled
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
                      disabled
                    />
                  </td>
                </tr>

                {/* Visual & Criteria test */}
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
                    {isEditing ? (
                      <textarea
                        name="visual_test_result"
                        value={editForm.visual_test_result}
                        onChange={handleEditChange}
                        rows={3}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.visual_test_result || "-"}
                      </span>
                    )}
                  </td>
                  <td
                    style={{ ...styles.inputCell, height: "80px" }}
                    colSpan={4}
                  >
                    {isEditing ? (
                      <textarea
                        name="criteria_test_result"
                        value={editForm.criteria_test_result}
                        onChange={handleEditChange}
                        rows={3}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.criteria_test_result || "-"}
                      </span>
                    )}
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
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        name="total_qty"
                        value={editForm.total_qty}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.total_qty !== null && mir.total_qty !== undefined
                          ? mir.total_qty
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td
                    style={{ ...styles.inputCell, height: "60px" }}
                    colSpan={5}
                    rowSpan={2}
                  >
                    {isEditing ? (
                      <textarea
                        name="rejection_reason"
                        value={editForm.rejection_reason}
                        onChange={handleEditChange}
                        rows={3}
                        style={styles.textarea}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.rejection_reason || "-"}
                      </span>
                    )}
                  </td>
                </tr>

                {/* Accepted Qty & Rejected Qty */}
                <tr>
                  <td style={styles.labelCell}>Accepted Qty-</td>
                  <td style={styles.labelCell}>Rejected Qty-</td>
                </tr>
                <tr>
                  <td style={styles.inputCell}>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        name="accepted_qty"
                        value={editForm.accepted_qty}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.accepted_qty !== null &&
                        mir.accepted_qty !== undefined
                          ? mir.accepted_qty
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.inputCell}>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        name="rejected_qty"
                        value={editForm.rejected_qty}
                        onChange={handleEditChange}
                        style={styles.input}
                      />
                    ) : (
                      <span style={styles.displayText}>
                        {mir.rejected_qty !== null &&
                        mir.rejected_qty !== undefined
                          ? mir.rejected_qty
                          : "-"}
                      </span>
                    )}
                  </td>
                  <td style={styles.inputCell} colSpan={5}></td>
                </tr>

                {/* Signature Row – view mode */}
                {!isEditing && (
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
                        {mir.qc_team_sign && (
                          <div
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: 6,
                              padding: 4,
                              display: "inline-block",
                              background: "#f9fafb",
                              marginBottom: 8,
                            }}
                          >
                            <img
                              src={mir.qc_team_sign}
                              alt="QC signature"
                              style={{
                                maxWidth: 150,
                                maxHeight: 60,
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ fontSize: "11px", marginTop: 4 }}>
                          {mir.qc_team_name || "-"}
                        </div>
                        <div style={{ fontSize: "10px", color: "#666" }}>
                          {mir.qc_team_sign_date
                            ? new Date(
                                mir.qc_team_sign_date
                              ).toLocaleDateString()
                            : ""}
                        </div>
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
                        {mir.store_team_sign && (
                          <div
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: 6,
                              padding: 4,
                              display: "inline-block",
                              background: "#f9fafb",
                              marginBottom: 8,
                            }}
                          >
                            <img
                              src={mir.store_team_sign}
                              alt="Store signature"
                              style={{
                                maxWidth: 150,
                                maxHeight: 60,
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ fontSize: "11px", marginTop: 4 }}>
                          {mir.store_team_name || "-"}
                        </div>
                        <div style={{ fontSize: "10px", color: "#666" }}>
                          {mir.store_team_sign_date
                            ? new Date(
                                mir.store_team_sign_date
                              ).toLocaleDateString()
                            : ""}
                        </div>
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
                        {mir.project_incharge_sign && (
                          <div
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: 6,
                              padding: 4,
                              display: "inline-block",
                              background: "#f9fafb",
                              marginBottom: 8,
                            }}
                          >
                            <img
                              src={mir.project_incharge_sign}
                              alt="PI signature"
                              style={{
                                maxWidth: 150,
                                maxHeight: 60,
                                objectFit: "contain",
                                display: "block",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ fontSize: "11px", marginTop: 4 }}>
                          {mir.project_incharge_name || "-"}
                        </div>
                        <div style={{ fontSize: "10px", color: "#666" }}>
                          {mir.project_incharge_sign_date
                            ? new Date(
                                mir.project_incharge_sign_date
                              ).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                      <div style={{ fontWeight: "bold", marginTop: "8px" }}>
                        Project incharge
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* Save Area inside sheet (when editing) */}
          {isEditing && (
            <div style={{ padding: "15px", borderTop: "2px solid #000" }}>
              <button
                type="button"
                onClick={handleUpdateDetails}
                disabled={actionLoading}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  background: actionLoading ? "#ccc" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: actionLoading ? "not-allowed" : "pointer",
                  marginRight: "10px",
                }}
              >
                {actionLoading ? "Updating..." : "💾 Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MIR Logo CONFIG */}
      <div
        style={{
          ...cardStyle,
          background: cardColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <h3 style={{ marginTop: 0 }}>🏷️ MIR Logo (PDF Header)</h3>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
              overflow: "hidden",
            }}
          >
            {mir.logo ? (
              <img
                src={mir.logo}
                alt="MIR Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            ) : (
              <span style={{ fontSize: 12, color: "#6b7280" }}>
                No logo set
              </span>
            )}
          </div>

          <div style={{ flex: 1, fontSize: 13 }}>
            <p style={{ marginTop: 0, marginBottom: 6 }}>
              Yeh logo PDF ke right top corner me use hoga.
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setLogoFile(
                  e.target.files && e.target.files[0]
                    ? e.target.files[0]
                    : null
                )
              }
            />
            {logoFile && (
              <div style={{ fontSize: 12, marginTop: 4 }}>
                Selected: <strong>{logoFile.name}</strong>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogoUpload}
              disabled={actionLoading}
              style={{
                marginTop: 8,
                padding: "6px 14px",
                borderRadius: 4,
                border: "none",
                background: ORANGE,
                color: "#222",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: "bold",
              }}
            >
              {actionLoading ? "Uploading..." : "Upload / Update Logo"}
            </button>
          </div>
        </div>
      </div>

      {/* Material Photos */}
      {Array.isArray(mir.material_images) && mir.material_images.length > 0 && (
        <div
          style={{
            ...cardStyle,
            background: cardColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          <h3 style={{ marginTop: 0 }}>📸 Material Photos</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 8,
            }}
          >
            {mir.material_images.map((img) => (
              <div key={img.id} style={{ width: 150 }}>
                <div
                  style={{
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={img.image}
                    alt={img.caption || "Material image"}
                    style={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, marginTop: 4 }}>
                  {img.caption || "—"}
                  <br />
                  {img.created_at
                    ? new Date(img.created_at).toLocaleString()
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      <div
        style={{
          ...cardStyle,
          background: cardColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <h3 style={{ marginTop: 0 }}>📎 Attachments</h3>

        {Array.isArray(mir.attachments) && mir.attachments.length > 0 ? (
          <ul style={{ fontSize: 13, paddingLeft: 20, marginBottom: 12 }}>
            {mir.attachments.map((att) => (
              <li key={att.id} style={{ marginBottom: 6 }}>
                <a
                  href={att.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 500 }}
                >
                  {att.name ||
                    (att.file && att.file.split("/").slice(-1)[0]) ||
                    "Attachment"}
                </a>
                {att.description && (
                  <span style={{ marginLeft: 6, color: "#555" }}>
                    – {att.description}
                  </span>
                )}
                <div style={{ fontSize: 11, color: "#777" }}>
                  {att.uploaded_by_name && <>By {att.uploaded_by_name} · </>}
                  {att.created_at && new Date(att.created_at).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ fontSize: 13, color: "#777", marginBottom: 12 }}>
            No attachments yet.
          </p>
        )}

        <div style={{ borderTop: "1px dashed #e5e7eb", paddingTop: 8 }}>
          <h4 style={{ fontSize: 14, marginBottom: 6 }}>
            Add / Update Attachments
          </h4>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setAttachmentsFiles(Array.from(e.target.files || []))
            }
          />
          {attachmentsFiles.length > 0 && (
            <ul style={{ marginTop: 6, fontSize: 12 }}>
              {attachmentsFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 6 }}>
            <label style={{ fontSize: 12 }}>Display Name (optional)</label>
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
              placeholder="e.g. Mill Test Certificate"
            />
          </div>

          <div style={{ marginTop: 6 }}>
            <label style={{ fontSize: 12 }}>Description (optional)</label>
            <textarea
              rows={2}
              value={attachmentDescription}
              onChange={(e) => setAttachmentDescription(e.target.value)}
              style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
              placeholder="Short note..."
            />
          </div>

          <button
            type="button"
            onClick={handleUploadAttachments}
            disabled={actionLoading}
            style={{
              marginTop: 8,
              padding: "6px 12px",
              borderRadius: 4,
              border: "none",
              background: ORANGE,
              color: "#222",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Upload Attachments
          </button>
        </div>
      </div>

      {/* Signatures Update */}
      <div
        style={{
          ...cardStyle,
          background: cardColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <h3 style={{ marginTop: 0 }}> Update Signatures</h3>

        {/* Store Team */}
        <div style={signatureEditRowStyle}>
          <div style={{ minWidth: 130, fontWeight: 600 }}>Store Team</div>
          <div style={{ fontSize: 13, flex: 1 }}>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Name (optional)</label>
              <input
                type="text"
                value={storeSignName}
                onChange={(e) => setStoreSignName(e.target.value)}
                style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
              <input
                type="date"
                value={storeSignDate}
                onChange={(e) => setStoreSignDate(e.target.value)}
                style={{ padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <SignaturePadField
                label="Store Team Signature"
                fileValue={storeSignFile}
                onChangeFile={setStoreSignFile}
              />
            </div>
            <button
              type="button"
              onClick={handleStoreSignSave}
              disabled={actionLoading}
              style={btnSmall}
            >
              Save Store Signature
            </button>
          </div>
        </div>

        {/* QC Team */}
        <div style={signatureEditRowStyle}>
          <div style={{ minWidth: 130, fontWeight: 600 }}>QC Team</div>
          <div style={{ fontSize: 13, flex: 1 }}>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Name (optional)</label>
              <input
                type="text"
                value={qcSignName}
                onChange={(e) => setQcSignName(e.target.value)}
                style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
              <input
                type="date"
                value={qcSignDate}
                onChange={(e) => setQcSignDate(e.target.value)}
                style={{ padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <SignaturePadField
                label="QC Team Signature"
                fileValue={qcSignFile}
                onChangeFile={setQcSignFile}
              />
            </div>
            <button
              type="button"
              onClick={handleQcSignSave}
              disabled={actionLoading}
              style={btnSmall}
            >
              Save QC Signature
            </button>
          </div>
        </div>

        {/* Project Incharge */}
        <div style={signatureEditRowStyle}>
          <div style={{ minWidth: 130, fontWeight: 600 }}>
            Project Incharge
          </div>
          <div style={{ fontSize: 13, flex: 1 }}>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Name (optional)</label>
              <input
                type="text"
                value={piSignName}
                onChange={(e) => setPiSignName(e.target.value)}
                style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12 }}>Sign Date (optional)</label>
              <input
                type="date"
                value={piSignDate}
                onChange={(e) => setPiSignDate(e.target.value)}
                style={{ padding: 6, border: "1px solid #ccc" }}
              />
            </div>
            <div style={{ marginBottom: 4 }}>
              <SignaturePadField
                label="Project Incharge Signature"
                fileValue={piSignFile}
                onChangeFile={setPiSignFile}
              />
            </div>
            <button
              type="button"
              onClick={handlePiSignSave}
              disabled={actionLoading}
              style={btnSmall}
            >
              Save PI Signature
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          ...cardStyle,
          background: cardColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        <h3 style={{ marginTop: 0 }}> Take Action</h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleAccept}
            disabled={actionLoading}
            style={btnAcceptStyle}
          >
            {actionLoading ? "..." : "✅ Accept"}
          </button>

          <button
            type="button"
            onClick={handleReject}
            disabled={actionLoading}
            style={btnRejectStyle}
          >
            ❌ Reject
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          <h4>Forward MIR</h4>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>Forward To User</label>
            <select
              value={selectedForwardUserId}
              onChange={(e) => setSelectedForwardUserId(e.target.value)}
              style={{ padding: 6, minWidth: 220, border: "1px solid #ccc" }}
            >
              <option value="">Select user...</option>
              {forwardUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>Comment (optional)</label>
            <textarea
              rows={2}
              value={forwardComment}
              onChange={(e) => setForwardComment(e.target.value)}
              style={{ width: "100%", padding: 6, border: "1px solid #ccc" }}
            />
          </div>
          <button
            type="button"
            onClick={handleForward}
            disabled={actionLoading}
            style={btnForwardStyle}
          >
             Forward
          </button>
        </div>
      </div>

      {/* Workflow History */}
      {Array.isArray(mir.actions) && mir.actions.length > 0 && (
        <div
          style={{
            ...cardStyle,
            background: cardColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          <h3 style={{ marginTop: 0 }}> Workflow History</h3>
          <ul style={{ fontSize: 13, paddingLeft: 20 }}>
            {mir.actions.map((a) => (
              <li key={a.id} style={{ marginBottom: 4 }}>
                <b>{a.action}</b> — {a.from_user_name || "Unknown"} →{" "}
                {a.to_user_name || "-"} | {a.comment || "-"} |{" "}
                {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  labelCell: {
    border: "1px solid #000",
    padding: "8px",
    fontWeight: "bold",
    background: BG_OFFWHITE, // theme offwhite
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
  displayText: {
    padding: "4px",
    display: "block",
    minHeight: "20px",
  },
};

const cardStyle = {
  border: "2px solid #e5e7eb",
  borderRadius: 8,
  padding: 15,
  marginBottom: 16,
  background: "#fafafa",
};

const btnAcceptStyle = {
  padding: "8px 16px",
  borderRadius: 4,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnRejectStyle = {
  padding: "8px 16px",
  borderRadius: 4,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnForwardStyle = {
  padding: "8px 16px",
  borderRadius: 4,
  border: "none",
  background: ORANGE,
  color: "#222",
  cursor: "pointer",
  fontWeight: "bold",
};

const btnSmall = {
  padding: "6px 14px",
  borderRadius: 4,
  border: "none",
  background: ORANGE,
  color: "#222",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: "bold",
};

const btnExportStyle = {
  padding: "4px 10px",
  borderRadius: 4,
  border: "1px solid #9ca3af",
  background: "#f9fafb",
  color: "#111827",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 500,
};

const signatureEditRowStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  marginTop: 12,
  paddingTop: 12,
  borderTop: "1px dashed #d1d5db",
};
