import { useState, useEffect, useRef } from "react";
import { api } from "../api/api";
import { useToast } from '../components/Toast';
import CustomSelect from '../components/CustomSelect';
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
  Filter,
} from "lucide-react";
import './Vacancies.css';

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
  additionalInfo?: { label: string; value: string }[];
}

export default function Vacancies() {
  const { showToast } = useToast();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [modalQual, setModalQual] = useState("BSC");
  const [modalExp, setModalExp] = useState(1);
  const [modalSkills, setModalSkills] = useState("");
  const [modalCvUrl, setModalCvUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, profileData, myApps] = await Promise.all([
          api.getVacancies(),
          api.getMyProfile().catch(() => null),
          api.getMyApplications().catch(() => []),
        ]);
        setVacancies(jobsData);
        if (profileData) setProfile(profileData);
        const appliedIds = myApps.map((app: any) => app.vacancyId);
        setAppliedJobs(appliedIds);
      } catch {
        console.error("Failed to load data");
        showToast("Failed to load vacancies", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueTypes = Array.from(new Set(vacancies.map((v) => v.type)));
  const uniqueModes = Array.from(new Set(vacancies.map((v) => v.workMode)));

  const getDeadlineStatus = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0)
      return { text: "Expired", color: "var(--danger)", bg: "var(--danger-soft)" };
    if (diffDays === 0)
      return { text: "Closes Today", color: "var(--danger)", bg: "var(--danger-soft)" };
    if (diffDays === 1)
      return { text: "Closes Tomorrow", color: "var(--warning)", bg: "var(--warning-soft)" };
    return { text: `${diffDays} days left`, color: "var(--success)", bg: "var(--success-soft)" };
  };

  const handleOpenApplyModal = () => {
    if (!profile) {
      showToast("Please complete your profile before applying.", "error");
      return;
    }
    setModalQual(profile.qualification);
    setModalExp(profile.experienceYrs);
    setModalSkills(profile.skills.join(", "));
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
      showToast("CV uploaded successfully!", "success");
    } catch {
      showToast("Failed to upload CV", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedJob) return;
    setApplying(true);

    try {
      await api.saveApplicantProfile({
        qualification: modalQual,
        experienceYrs: modalExp,
        skills: modalSkills.split(",").map((s) => s.trim()).filter(Boolean),
        cvUrl: modalCvUrl,
        additionalInfo: profile?.additionalInfo,
      });
      await api.applyForVacancy(selectedJob);
      setAppliedJobs([...appliedJobs, selectedJob]);
      showToast("Application submitted successfully!", "success");
      setTimeout(() => setIsModalOpen(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) showToast(err.message, "error");
      else showToast("Failed to apply", "error");
    } finally {
      setApplying(false);
    }
  };

  const filteredJobs = vacancies.filter((job) => {
    const deadline = new Date(job.deadline);
    deadline.setHours(23, 59, 59, 999);
    if (deadline < new Date()) return false;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(searchLower) ||
      job.companyName.toLowerCase().includes(searchLower) ||
      job.requiredSkills.some((skill) => skill.toLowerCase().includes(searchLower));

    if (!matchesSearch) return false;
    if (selectedType && job.type !== selectedType) return false;
    if (selectedMode && job.workMode !== selectedMode) return false;

    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Find Vacancies</h1>
          <p style={{ color: "var(--muted)" }}>Browse open roles and apply</p>
        </div>
      </div>

      <div className="vac-layout">
        {/* LEFT: Job List */}
        <div className="vac-list">

          {/* UNIFIED FILTER BAR */}
          <div className="card vac-filter-card">

            {/* Search Input */}
            <div className="vac-search-wrap">
              <Search size={20} className="vac-search-icon" />
              <input
                type="text"
                className="input vac-search-input"
                placeholder="Search by job title, company, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            <div className="vac-filters">
              {/* Type Filter */}
              <div className="vac-filter-row">
                <span className="vac-filter-label">
                  <Filter size={14} /> Type
                </span>
                <div className="vac-filter-pills">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`vac-pill${selectedType === null ? " active" : ""}`}
                  >
                    All
                  </button>
                  {uniqueTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`vac-pill${selectedType === type ? " active" : ""}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Filter */}
              <div className="vac-filter-row">
                <span className="vac-filter-label">Mode</span>
                <div className="vac-filter-pills">
                  <button
                    onClick={() => setSelectedMode(null)}
                    className={`vac-pill${selectedMode === null ? " active" : ""}`}
                  >
                    All
                  </button>
                  {uniqueModes.map(mode => (
                    <button
                      key={mode}
                      onClick={() => setSelectedMode(mode)}
                      className={`vac-pill${selectedMode === mode ? " active" : ""}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* JOB LIST */}
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredJobs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
              No jobs found matching your criteria.
            </div>
          ) : (
            filteredJobs.map((job) => {
              const dl = getDeadlineStatus(job.deadline);
              const isSelected = selectedJob === job.id;
              return (
                <div
                  key={job.id}
                  className={`card vac-job-card${isSelected ? " selected" : ""}`}
                  onClick={() => setSelectedJob(job.id)}
                >
                  <div className="vac-job-inner">
                    <div className="vac-job-main">
                      <h2 className="vac-job-title">{job.title}</h2>
                      <p className="vac-job-company">
                        <Building2 size={14} /> {job.companyName}
                      </p>
                      <div className="vac-job-meta">
                        <span>
                          <MapPin size={14} /> {job.location} ({job.workMode})
                        </span>
                        <span>
                          <Banknote size={14} /> {job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="vac-job-badges">
                      {appliedJobs.includes(job.id) ? (
                        <span className="badge badge-selected">Applied</span>
                      ) : (
                        <span className="badge badge-submitted">{job.type}</span>
                      )}
                      <span className="vac-deadline-badge" style={{ color: dl.color, background: dl.bg }}>
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
        <div className="card vac-detail">
          {selectedJob ? (
            (() => {
              const job = vacancies.find((v) => v.id === selectedJob)!;
              const hasApplied = appliedJobs.includes(job.id);
              const dl = getDeadlineStatus(job.deadline);
              const isExpired = dl.text === "Expired";

              return (
                <>
                  <div className="vac-detail-badges">
                    <span className="badge badge-shortlisted">{job.type}</span>
                    <span className="badge badge-submitted">{job.workMode}</span>
                    <span className="vac-deadline-badge" style={{ color: dl.color, background: dl.bg, marginLeft: "auto" }}>
                      {dl.text}
                    </span>
                  </div>

                  <h1 className="vac-detail-title">{job.title}</h1>
                  <p className="vac-detail-company">
                    <Building2 size={18} /> {job.companyName}
                  </p>
                  <p className="vac-detail-location">
                    <MapPin size={16} /> {job.location}
                  </p>

                  <div className="vac-detail-grid">
                    <div>
                      <p className="vac-detail-label">Salary</p>
                      <p style={{ fontWeight: "600", color: "var(--success)" }}>
                        {job.salary || "Not disclosed"}
                      </p>
                    </div>
                    <div>
                      <p className="vac-detail-label">Deadline</p>
                      <p style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", color: isExpired ? "var(--danger)" : "var(--text)" }}>
                        <Calendar size={14} /> {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="vac-detail-label">Min. Qual</p>
                      <p style={{ fontWeight: "600" }}>{job.minQualification}</p>
                    </div>
                    <div>
                      <p className="vac-detail-label">Experience</p>
                      <p style={{ fontWeight: "600" }}>{job.requiredYears} Years</p>
                    </div>
                  </div>

                  <h3 style={{ marginBottom: "12px" }}>Required Skills</h3>
                  <div className="vac-skills">
                    {job.requiredSkills.map((skill) => (
                      <span key={skill} className="vac-skill-pill">{skill}</span>
                    ))}
                  </div>

                  <button
                    className="btn vac-apply-btn"
                    onClick={handleOpenApplyModal}
                    disabled={hasApplied || isExpired}
                    style={{
                      background: hasApplied ? "var(--success)" : isExpired ? "var(--muted)" : "var(--primary)",
                      cursor: (hasApplied || isExpired) ? "not-allowed" : "pointer",
                    }}
                  >
                    {hasApplied ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <CheckCircle2 size={18} /> Already Applied
                      </span>
                    ) : isExpired ? "Application Closed" : "Review & Apply"}
                  </button>
                </>
              );
            })()
          ) : (
            <div className="vac-detail-empty">
              <Briefcase size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>Select a job to view details.</p>
            </div>
          )}
        </div>
      </div>

      {/* EDITABLE APPLICATION MODAL */}
      {isModalOpen && selectedJob && (
        <div
          className="vac-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
        >
          <div className="card vac-modal">

            <div className="vac-modal-header">
              <div style={{ minWidth: 0 }}>
                <h2>Review & Edit Application</h2>
                <p>Update your details below before submitting.</p>
              </div>
              <button
                type="button"
                className="vac-modal-close"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="vac-modal-body">
              <div>
                <h3 className="vac-modal-section-title">
                  <User size={18} /> Profile Information
                </h3>
                <div className="vac-modal-grid-2">
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "13px" }}>Highest Qualification</label>
                    <CustomSelect 
  value={modalQual}
  onChange={setModalQual}
  options={[
    { value: 'OND', label: 'OND' },
    { value: 'HND', label: 'HND' },
    { value: 'BSC', label: 'BSc' },
    { value: 'MSC', label: 'MSc' }
  ]}
/>
                  </div>
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "13px" }}>Years of Experience</label>
                    <input
                      type="number"
                      className="input"
                      value={modalExp}
                      onChange={(e) => setModalExp(parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <hr className="vac-modal-hr" />

              <div>
                <h3 className="vac-modal-section-title">
                  <Briefcase size={18} /> Skills
                </h3>
                <div className="field" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "13px" }}>Skills (Comma Separated)</label>
                  <input
                    type="text"
                    className="input"
                    value={modalSkills}
                    onChange={(e) => setModalSkills(e.target.value)}
                    placeholder="e.g. React, TypeScript, CSS"
                  />
                  <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
                    The screening engine will match these exactly against the job requirements.
                  </p>
                </div>
              </div>

              {profile?.additionalInfo && profile.additionalInfo.length > 0 && (
                <>
                  <hr className="vac-modal-hr" />
                  <div>
                    <h3 className="vac-modal-section-title">
                      <FileText size={18} /> Additional Information
                    </h3>
                    <div className="vac-modal-info">
                      {profile.additionalInfo.map((info, index) => (
                        <div
                          key={index}
                          className="vac-modal-info-row"
                          style={{
                            borderBottom: index !== profile.additionalInfo!.length - 1
                              ? "1px dashed var(--border)"
                              : "none",
                          }}
                        >
                          <span className="vac-modal-info-label">{info.label}</span>
                          <span className="vac-modal-info-value">{info.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <hr className="vac-modal-hr" />

              <div>
                <h3 className="vac-modal-section-title">
                  <UploadCloud size={18} /> CV / Resume
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                />

                {modalCvUrl ? (
                  <div className="vac-modal-cv">
                    <div className="vac-modal-cv-left">
                      <div className="vac-modal-cv-icon">
                        <FileText size={24} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p className="vac-modal-cv-name">Uploaded_Resume.pdf</p>
                        <p className="vac-modal-cv-status">
                          <CheckCircle2 size={14} /> Attached to application
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline vac-modal-cv-replace"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Replace"}
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="vac-modal-dropzone"
                  >
                    <UploadCloud size={32} style={{ color: "var(--primary)", marginBottom: 12 }} />
                    <p className="vac-modal-dropzone-title">Click to upload your CV</p>
                    <p className="vac-modal-dropzone-hint">PDF or DOCX (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="vac-modal-footer">
              <button className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn"
                onClick={handleFinalSubmit}
                disabled={applying}
                style={{ padding: "10px 24px" }}
              >
                {applying ? "Submitting..." : "Save & Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}