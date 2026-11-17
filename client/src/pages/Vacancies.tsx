import { useState, useEffect, useRef } from "react";
import { api } from "../api/api";
import Spinner from '../components/Spinner';
import {
  MapPin,
  Briefcase,
  Calendar,
  Search,
  CheckCircle2,
  Building2,
  X,
  User,
  FileText,
  Banknote,
  UploadCloud,
} from "lucide-react";

interface Vacancy {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workMode: string;
  salary: string;
  type: string;
  deadline: string;
  minQualification: string;
  requiredYears: number;
  requiredSkills: string[];
}

interface Profile {
  qualification: string;
  skills: string[];
  experienceYrs: number;
  cvUrl: string | null;
}

export default function Vacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  // Editable Modal States
  const [modalQual, setModalQual] = useState("BSC");
  const [modalExp, setModalExp] = useState(1);
  const [modalSkills, setModalSkills] = useState("");
  const [modalCvUrl, setModalCvUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, profileData] = await Promise.all([
          api.getVacancies(),
          api.getMyProfile().catch(() => null),
        ]);
        setVacancies(jobsData);
        if (profileData) setProfile(profileData);
      } catch {
        console.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getDeadlineStatus = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0)
      return {
        text: "Expired",
        color: "var(--danger)",
        bg: "var(--danger-soft)",
      };
    if (diffDays === 0)
      return {
        text: "Closes Today",
        color: "var(--danger)",
        bg: "var(--danger-soft)",
      };
    if (diffDays === 1)
      return {
        text: "Closes Tomorrow",
        color: "var(--warning)",
        bg: "var(--warning-soft)",
      };
    if (diffDays <= 3)
      return {
        text: `${diffDays} days left`,
        color: "var(--warning)",
        bg: "var(--warning-soft)",
      };
    return {
      text: `${diffDays} days left`,
      color: "var(--success)",
      bg: "var(--success-soft)",
    };
  };

  const handleOpenApplyModal = () => {
    setMessage("");
    if (!profile) {
      alert("Please complete your profile before applying.");
      return;
    }

    // Populate modal states with current profile data
    setModalQual(profile.qualification);
    setModalExp(profile.experienceYrs);
    setModalSkills(profile.skills.join(", ")); // Convert array to comma-separated string
    setModalCvUrl(profile.cvUrl);

    setIsModalOpen(true);
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await api.uploadCV(file);
      setModalCvUrl(data.cvUrl);
    } catch {
      alert("Failed to upload CV");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedJob) return;
    setApplying(true);
    setMessage("");

    try {
      // 1. Save the edited profile data first
      await api.saveApplicantProfile({
        qualification: modalQual,
        experienceYrs: modalExp,
        skills: modalSkills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        cvUrl: modalCvUrl,
      });

      // 2. Submit the application
      await api.applyForVacancy(selectedJob);

      setAppliedJobs([...appliedJobs, selectedJob]);
      setMessage("Application submitted successfully!");
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = vacancies.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Find Vacancies</h1>
          <p style={{ color: "var(--muted)" }}>Browse open roles and apply</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 450px",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* LEFT: Job List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: "16px",
                top: "14px",
                color: "var(--muted)",
              }}
            />
            <input
              type="text"
              className="input"
              placeholder="Search by title, company, or skill..."
              style={{
                paddingLeft: "48px",
                paddingTop: "12px",
                paddingBottom: "12px",
                fontSize: "15px",
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <Spinner />
          ) : filteredJobs.length === 0 ? (
            <p>No jobs found.</p>
          ) : (
            filteredJobs.map((job) => {
              const dl = getDeadlineStatus(job.deadline);
              return (
                <div
                  key={job.id}
                  className={`card ${selectedJob === job.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedJob(job.id);
                    setMessage("");
                  }}
                  style={{
                    cursor: "pointer",
                    borderLeft:
                      selectedJob === job.id
                        ? "4px solid var(--primary)"
                        : "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          color: "var(--text)",
                          fontSize: "18px",
                          marginBottom: "4px",
                        }}
                      >
                        {job.title}
                      </h2>
                      <p
                        style={{
                          fontWeight: "500",
                          fontSize: "14px",
                          color: "var(--primary)",
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Building2 size={14} /> {job.companyName}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          color: "var(--muted)",
                          fontSize: "13px",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <MapPin size={14} /> {job.location} ({job.workMode})
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Banknote size={14} /> {job.salary}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "8px",
                      }}
                    >
                      {appliedJobs.includes(job.id) ? (
                        <span className="badge badge-selected">Applied</span>
                      ) : (
                        <span className="badge badge-submitted">
                          {job.type}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: dl.color,
                          background: dl.bg,
                          padding: "4px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        {dl.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: Details */}
        <div
          className="card"
          style={{ position: "sticky", top: "24px", padding: "32px" }}
        >
          {selectedJob ? (
            (() => {
              const job = vacancies.find((v) => v.id === selectedJob)!;
              const hasApplied = appliedJobs.includes(job.id);
              const dl = getDeadlineStatus(job.deadline);
              const isExpired = dl.text === "Expired";

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <span className="badge badge-shortlisted">{job.type}</span>
                    <span className="badge badge-submitted">
                      {job.workMode}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: dl.color,
                        background: dl.bg,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        marginLeft: "auto",
                      }}
                    >
                      {dl.text}
                    </span>
                  </div>

                  <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>
                    {job.title}
                  </h1>
                  <p
                    style={{
                      color: "var(--text)",
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Building2 size={18} /> {job.companyName}
                  </p>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "14px",
                      marginBottom: "24px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <MapPin size={16} /> {job.location}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px",
                      borderTop: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                      padding: "16px 0",
                      marginBottom: "24px",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Salary
                      </p>
                      <p style={{ fontWeight: "600", color: "var(--success)" }}>
                        {job.salary || "Not disclosed"}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Deadline
                      </p>
                      <p
                        style={{
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          color: isExpired ? "var(--danger)" : "var(--text)",
                        }}
                      >
                        <Calendar size={14} />{" "}
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Min. Qual
                      </p>
                      <p style={{ fontWeight: "600" }}>
                        {job.minQualification}
                      </p>
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          marginBottom: "4px",
                        }}
                      >
                        Experience
                      </p>
                      <p style={{ fontWeight: "600" }}>
                        {job.requiredYears} Years
                      </p>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: "12px" }}>Required Skills</h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "32px",
                    }}
                  >
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn"
                    onClick={handleOpenApplyModal}
                    disabled={hasApplied || isExpired}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      padding: "14px",
                      fontSize: "16px",
                      background: hasApplied
                        ? "var(--success)"
                        : isExpired
                          ? "var(--muted)"
                          : "var(--primary)",
                      cursor: isExpired ? "not-allowed" : "pointer",
                    }}
                  >
                    {hasApplied ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <CheckCircle2 size={18} /> Applied Successfully
                      </span>
                    ) : isExpired ? (
                      "Application Closed"
                    ) : (
                      "Review & Apply"
                    )}
                  </button>
                </>
              );
            })()
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "var(--muted)",
                padding: "60px 0",
              }}
            >
              <Briefcase
                size={48}
                style={{ opacity: 0.2, margin: "0 auto 16px auto" }}
              />
              <p>Select a job to view details.</p>
            </div>
          )}
        </div>
      </div>

      
            {/* --- EDITABLE APPLICATION REVIEW MODAL --- */}
      {isModalOpen && selectedJob && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflowY: 'auto' }}>
          <div className="card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', animation: 'fadeIn 0.2s ease-out' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)' }}>
              <div>
                <h2 style={{ fontSize: '22px', margin: 0, fontWeight: '700' }}>Review & Edit Application</h2>
                <p style={{ color: 'var(--muted)', fontSize: '14px', margin: '4px 0 0 0' }}>Update your details below before submitting to the employer.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={24} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
              
              {message && (
                <div style={{ padding: '16px', background: message.includes('success') ? 'var(--success-soft)' : 'var(--danger-soft)', color: message.includes('success') ? 'var(--success)' : 'var(--danger)', borderRadius: '8px', fontWeight: '500', fontSize: '14px' }}>
                  {message}
                </div>
              )}

              {/* --- SECTION 1: PROFILE INFO --- */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: 'var(--primary)' }} /> Profile Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '13px' }}>Highest Qualification</label>
                    <select className="select" value={modalQual} onChange={(e) => setModalQual(e.target.value)} style={{ width: '100%' }}>
                      <option value="OND">OND</option>
                      <option value="HND">HND</option>
                      <option value="BSC">BSc</option>
                      <option value="MSC">MSc</option>
                    </select>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '13px' }}>Years of Experience</label>
                    <input type="number" className="input" value={modalExp} onChange={(e) => setModalExp(parseInt(e.target.value) || 0)} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

              {/* --- SECTION 2: SKILLS --- */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={18} style={{ color: 'var(--primary)' }} /> Skills
                </h3>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: '13px' }}>Skills (Comma Separated)</label>
                  <input 
                    type="text" 
                    className="input" 
                    value={modalSkills} 
                    onChange={(e) => setModalSkills(e.target.value)} 
                    placeholder="e.g. React, TypeScript, CSS"
                    style={{ width: '100%' }}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>The screening engine will match these exactly against the job requirements.</p>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />

              {/* --- SECTION 3: CV / RESUME --- */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UploadCloud size={18} style={{ color: 'var(--primary)' }} /> CV / Resume
                </h3>
                
                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleCvUpload} />

                {modalCvUrl ? (
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: '#fee2e2', padding: '12px', borderRadius: '8px', color: '#dc2626' }}>
                        <FileText size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', margin: 0, color: 'var(--text)' }}>Uploaded_Resume.pdf</p>
                        <p style={{ fontSize: '13px', color: 'var(--success)', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Attached to application
                        </p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="btn btn-outline" 
                      style={{ fontSize: '13px', padding: '8px 16px', background: '#fff' }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Replace'}
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ 
                      border: '2px dashed var(--border)', borderRadius: '8px', padding: '32px 16px', 
                      textAlign: 'center', cursor: 'pointer', background: 'var(--bg)' 
                    }}
                  >
                    <UploadCloud size={32} style={{ color: 'var(--primary)', margin: '0 auto 12px auto' }} />
                    <p style={{ fontSize: '15px', fontWeight: '600', margin: '0 0 4px 0', color: 'var(--text)' }}>Click to upload your CV</p>
                    <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>PDF or DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '20px 32px', borderTop: '1px solid var(--border)', background: 'var(--bg)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn" onClick={handleFinalSubmit} disabled={applying || message.includes('success')} style={{ padding: '10px 24px' }}>
                {applying ? 'Submitting...' : 'Save & Submit Application'}
              </button>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
