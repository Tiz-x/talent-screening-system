import { useState, useEffect } from "react";
import { api } from "../api/api";
import {
  Award,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  X,
  Users,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Spinner from "../components/Spinner";
import { useToast } from "../components/Toast";
import CustomSelect from "../components/CustomSelect"; // <-- Import CustomSelect
import "./EmployerRanking.css";

interface Vacancy {
  id: string;
  title: string;
}

interface ApplicantProfile {
  qualification: string;
  skills: string[];
  experienceYrs: number;
  cvUrl: string | null;
  additionalInfo?: { label: string; value: string }[];
}

interface ScreeningResult {
  applicationId: string;
  applicantName: string;
  status: string;
  profile: ApplicantProfile | null;
  knockedOut: boolean;
  reason?: string;
  totalScore: number;
  breakdown: {
    qualScore: number;
    skillsScore: number;
    expScore: number;
    certsScore: number;
  } | null;
}

export default function EmployerRanking() {
  const { showToast } = useToast();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScreening, setIsScreening] = useState(false);

  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    mode: "Virtual",
    link: "",
    notes: "",
  });
  const [isScheduling, setIsScheduling] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getVacancies(true);
        setVacancies(data);
        if (data.length > 0) setSelectedVacancy(data[0].id);
      } catch {
        console.error("Failed to load vacancies");
        showToast("Failed to load vacancies", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedVacancy) {
      handleRunScreening();
    }
  }, [selectedVacancy]);

  const handleRunScreening = async () => {
    if (!selectedVacancy) return;
    setIsScreening(true);
    setResults([]);

    try {
      const data = await api.runScreening(selectedVacancy);
      setResults(data.results);
      setSelectedApplicant(data.results[0]?.applicationId || null);
    } catch {
      showToast("Failed to run screening", "error");
    } finally {
      setIsScreening(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!currentApp) return;
    try {
      await api.updateApplicationStatus(currentApp.applicationId, status);
      showToast(`Applicant status updated to ${status}`, "success");
      handleRunScreening();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentApp) return;
    setIsScheduling(true);
    try {
      await api.scheduleInterview({
        applicationId: currentApp.applicationId,
        ...interviewData,
      });
      showToast("Interview scheduled successfully!", "success");
      setIsInterviewModalOpen(false);
      handleRunScreening();
    } catch {
      showToast("Failed to schedule interview", "error");
    } finally {
      setIsScheduling(false);
    }
  };

  const currentApp = results.find((a) => a.applicationId === selectedApplicant);

  const totalApplicants = results.length;
  const knockedOutCount = results.filter((r) => r.knockedOut).length;
  const eligibleCount = totalApplicants - knockedOutCount;

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="page-header er-header">
        <div>
          <h1>Screening & Ranking</h1>
          <p style={{ color: "var(--muted)" }}>
            Select a vacancy to view and rank its applicants
          </p>
        </div>
        <div className="er-header-actions">
          <div className="er-select-wrap">
            <CustomSelect
              value={selectedVacancy}
              onChange={setSelectedVacancy}
              options={vacancies.map((v) => ({ value: v.id, label: v.title }))}
            />
          </div>
          <button
            className="btn er-refresh-btn"
            onClick={handleRunScreening}
            disabled={isScreening || !selectedVacancy}
          >
            {isScreening ? "Screening..." : "Refresh"}
          </button>
        </div>
      </div>

      {isScreening ? (
        <Spinner />
      ) : results.length === 0 ? (
        <div className="card er-empty">
          <div className="er-empty-icon">
            <Users size={40} />
          </div>
          <h2>No Applicants Yet</h2>
          <p>
            There are currently no applications for this vacancy. Once
            candidates apply, you can screen and rank them here.
          </p>
        </div>
      ) : (
        <div className="er-content">
          {/* SUMMARY STATS BAR */}
          <div className="er-stats">
            <div className="card er-stat-card">
              <div className="er-stat-icon er-stat-icon-primary"><Users size={24} /></div>
              <div>
                <p className="er-stat-label">Total Applicants</p>
                <h2 className="er-stat-value">{totalApplicants}</h2>
              </div>
            </div>
            <div className="card er-stat-card">
              <div className="er-stat-icon er-stat-icon-success"><ShieldCheck size={24} /></div>
              <div>
                <p className="er-stat-label">Eligible Candidates</p>
                <h2 className="er-stat-value">{eligibleCount}</h2>
              </div>
            </div>
            <div className="card er-stat-card">
              <div className="er-stat-icon er-stat-icon-danger"><ShieldAlert size={24} /></div>
              <div>
                <p className="er-stat-label">Knocked Out</p>
                <h2 className="er-stat-value">{knockedOutCount}</h2>
              </div>
            </div>
          </div>

          {/* MAIN SPLIT VIEW */}
          <div className="split er-split">
            {/* LEFT: Ranked Table */}
            <div className="card er-table-card">
              <div className="er-table-scroll">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Applicant</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((app, index) => (
                      <tr
                        key={app.applicationId}
                        onClick={() => setSelectedApplicant(app.applicationId)}
                        className={selectedApplicant === app.applicationId ? "selected" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        <td style={{ fontWeight: "bold" }}>
                          {app.knockedOut ? (
                            "-"
                          ) : (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                color: index === 0 ? "var(--primary)" : "var(--text)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {index === 0 && <Award size={16} />} #{index + 1}
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: "600" }}>{app.applicantName}</div>
                        </td>
                        <td>
                          {app.knockedOut ? (
                            <span className="badge badge-rejected">Knocked Out</span>
                          ) : (
                            <span
                              className={
                                app.totalScore > 80
                                  ? "score-high"
                                  : app.totalScore > 50
                                  ? "score-mid"
                                  : "score-low"
                              }
                            >
                              {app.totalScore}%
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              app.knockedOut ? "badge-rejected" : "badge-shortlisted"
                            }`}
                          >
                            {app.knockedOut ? "Rejected" : "Eligible"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT: Applicant Details */}
            <div className="card er-detail">
              {currentApp && (
                <>
                  <h2 style={{ marginBottom: "4px" }}>{currentApp.applicantName}</h2>
                  <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "24px" }}></p>

                  {currentApp.knockedOut ? (
                    <div className="er-knockout-box">
                      <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <strong>Knocked Out</strong>
                        <p style={{ marginTop: "4px", fontSize: "13px" }}>{currentApp.reason}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 style={{ marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                        Score Breakdown
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                            <span>Qualification</span>
                            <strong>{currentApp.breakdown?.qualScore} / 100</strong>
                          </div>
                          <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.qualScore}%` }}></span></div>
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                            <span>Skills Match</span>
                            <strong>{currentApp.breakdown?.skillsScore} / 100</strong>
                          </div>
                          <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.skillsScore}%` }}></span></div>
                        </div>
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontSize: "13px" }}>
                            <span>Experience</span>
                            <strong>{currentApp.breakdown?.expScore} / 100</strong>
                          </div>
                          <div className="score-bar"><span style={{ width: `${currentApp.breakdown?.expScore}%` }}></span></div>
                        </div>
                        <div className="er-total-score">
                          <h3>Total Score</h3>
                          <h2 style={{ color: "var(--primary)" }}>{currentApp.totalScore}%</h2>
                        </div>
                      </div>

                      {currentApp.profile && (
                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
                          <h3 style={{ marginBottom: "16px" }}>Candidate Profile</h3>

                          <div className="er-profile-grid">
                            <div>
                              <p className="er-profile-label">Qualification</p>
                              <p style={{ fontWeight: "500" }}>{currentApp.profile.qualification || "N/A"}</p>
                            </div>
                            <div>
                              <p className="er-profile-label">Experience</p>
                              <p style={{ fontWeight: "500" }}>{currentApp.profile.experienceYrs || 0} Years</p>
                            </div>
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <p className="er-profile-label" style={{ marginBottom: "8px" }}>Skills</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                              {currentApp.profile.skills.map((s) => (
                                <span
                                  key={s}
                                  style={{
                                    background: "var(--bg)",
                                    border: "1px solid var(--border)",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          {currentApp.profile.additionalInfo && currentApp.profile.additionalInfo.length > 0 && (
                            <div style={{ marginBottom: "16px" }}>
                              <p className="er-profile-label" style={{ marginBottom: "8px" }}>Additional Info</p>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {currentApp.profile.additionalInfo.map((info, index) => (
                                  <div key={index} style={{ display: "flex", gap: "8px", fontSize: "13px", flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: "600", color: "var(--text)" }}>{info.label}:</span>
                                    <span style={{ color: "var(--muted)" }}>{info.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <a
                            href={currentApp.profile.cvUrl?.replace(/\.pdf$/i, ".jpg") || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="er-cv-link"
                            style={{
                              color: currentApp.profile.cvUrl ? "var(--primary)" : "var(--muted)",
                              cursor: currentApp.profile.cvUrl ? "pointer" : "not-allowed",
                            }}
                          >
                            <FileText size={16} />{" "}
                            {currentApp.profile.cvUrl ? "View CV / Resume" : "No CV Uploaded"}
                          </a>

                          {/* ACTION BUTTONS */}
                          <div className="er-actions">
                            <button
                              className="btn"
                              style={{
                                justifyContent: "center",
                                opacity: currentApp.status === "INTERVIEW" ? 0.5 : 1,
                                cursor: currentApp.status === "INTERVIEW" ? "not-allowed" : "pointer",
                              }}
                              onClick={() => setIsInterviewModalOpen(true)}
                              disabled={currentApp.status === "INTERVIEW"}
                            >
                              <Calendar size={16} />
                              {currentApp.status === "INTERVIEW" ? "Interview Scheduled" : "Schedule Interview"}
                            </button>

                            <div className="er-actions-row">
                              <button
                                className="btn"
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  opacity: currentApp.status === "SHORTLISTED" ? 0.5 : 1,
                                  cursor: currentApp.status === "SHORTLISTED" ? "not-allowed" : "pointer",
                                }}
                                onClick={() => handleStatusUpdate("SHORTLISTED")}
                                disabled={currentApp.status === "SHORTLISTED"}
                              >
                                <CheckCircle size={16} />
                                {currentApp.status === "SHORTLISTED" ? "Shortlisted" : "Shortlist"}
                              </button>

                              <button
                                className="btn btn-outline"
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  color: "var(--danger)",
                                  borderColor: "var(--danger)",
                                  opacity: currentApp.status === "REJECTED" ? 0.5 : 1,
                                  cursor: currentApp.status === "REJECTED" ? "not-allowed" : "pointer",
                                }}
                                onClick={() => handleStatusUpdate("REJECTED")}
                                disabled={currentApp.status === "REJECTED"}
                              >
                                <XCircle size={16} />
                                {currentApp.status === "REJECTED" ? "Rejected" : "Reject"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEW SCHEDULING MODAL */}
      {isInterviewModalOpen && currentApp && (
        <div className="er-modal-overlay">
          <div className="card er-modal">
            <div className="er-modal-header">
              <h2 style={{ margin: 0 }}>Schedule Interview</h2>
              <button
                type="button"
                onClick={() => setIsInterviewModalOpen(false)}
                className="er-modal-close"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleScheduleInterview} className="er-modal-form">
              <div className="field">
                <label>Date</label>
                <input
                  type="date"
                  className="input"
                  required
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Time</label>
                <input
                  type="time"
                  className="input"
                  required
                  value={interviewData.time}
                  onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                />
              </div>
              
              {/* REPLACED NATIVE SELECT WITH CUSTOM SELECT */}
              <div className="field">
                <label>Mode</label>
                <CustomSelect
                  value={interviewData.mode}
                  onChange={(val) => setInterviewData({ ...interviewData, mode: val })}
                  options={[
                    { value: "Virtual", label: "Virtual (Zoom/Meet)" },
                    { value: "In-person", label: "In-person" },
                  ]}
                />
              </div>

              <div className="field">
                <label>{interviewData.mode === "Virtual" ? "Meeting Link" : "Physical Address"}</label>
                <input
                  type="text"
                  className="input"
                  placeholder={interviewData.mode === "Virtual" ? "https://zoom.us/..." : "Office Address"}
                  value={interviewData.link}
                  onChange={(e) => setInterviewData({ ...interviewData, link: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label>Notes (Optional)</label>
                <textarea
                  className="textarea"
                  rows={2}
                  placeholder="e.g. Bring your portfolio"
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                ></textarea>
              </div>
              <div className="er-modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsInterviewModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn" disabled={isScheduling}>
                  {isScheduling ? "Scheduling..." : "Confirm Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}