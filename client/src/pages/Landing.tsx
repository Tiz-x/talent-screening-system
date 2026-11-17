import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Shield,
  Zap,
  GraduationCap,
  ArrowRight,
  Briefcase,
  Sparkles,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font)",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          padding: "20px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "var(--primary)",
            letterSpacing: "-0.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              background: "var(--primary)",
              color: "#fff",
              padding: "6px",
              borderRadius: "8px",
              display: "flex",
            }}
          >
            <Sparkles size={20} />
          </div>
          TalentScreen
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            style={{
              background: "none",
              border: "none",
              color: "var(--text)",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="btn"
            style={{ padding: "10px 20px", borderRadius: "8px" }}
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px",
          // Using Emerald/Teal soft radial gradients to match the theme
          background:
            "radial-gradient(circle at 10% 20%, var(--primary-soft) 0%, transparent 40%), radial-gradient(circle at 90% 80%, #ccfbf1 0%, transparent 40%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle Grid Pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.3,
            zIndex: 0,
          }}
        ></div>

        <div
          style={{
            maxWidth: "1100px",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#fff",
                border: "1px solid var(--border)",
                padding: "6px 16px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--primary)",
                marginBottom: "32px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  background: "var(--success)",
                  borderRadius: "50%",
                }}
              ></span>
              Official AAUA Recruitment Platform
            </div>

            <h1
              style={{
                fontSize: "56px",
                lineHeight: "1.1",
                marginBottom: "24px",
                color: "var(--text)",
                fontWeight: "800",
                letterSpacing: "-1px",
              }}
            >
              Smart Hiring for <br />
              {/* Gradient uses Primary and Accent colors */}
              <span
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Top Talent.
              </span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                color: "var(--muted)",
                marginBottom: "40px",
                lineHeight: "1.6",
                maxWidth: "480px",
              }}
            >
              Connecting Adekunle Ajasin University students and graduates with
              verified employers through a fair, transparent screening engine.
            </p>

            <div style={{ display: "flex", gap: "16px" }}>
              <button
                className="btn"
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 14px rgba(15, 118, 110, 0.3)",
                }}
                onClick={() => navigate("/register")}
              >
                Find a Job <ArrowRight size={20} />
              </button>
              <button
                className="btn btn-outline"
                style={{
                  padding: "16px 32px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  background: "#fff",
                }}
                onClick={() => navigate("/register")}
              >
                Post a Vacancy
              </button>
            </div>
          </div>

          {/* Right side floating UI mockup */}
          <div style={{ position: "relative", perspective: "1000px" }}>
            <div
              style={{
                background: "#fff",
                padding: "32px",
                borderRadius: "24px",
                boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                border: "1px solid var(--border)",
                position: "relative",
                zIndex: 2,
                transform: "rotateY(-5deg) rotateX(5deg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    background: "var(--primary-soft)",
                    padding: "16px",
                    borderRadius: "16px",
                  }}
                >
                  <Briefcase size={28} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      color: "var(--text)",
                    }}
                  >
                    Frontend Developer
                  </h3>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "14px",
                      margin: 0,
                    }}
                  >
                    TechNova Solutions • Remote
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "var(--muted)" }}>Match Score</span>
                  <span style={{ color: "var(--primary)" }}>85%</span>
                </div>
                <div
                  style={{
                    height: "10px",
                    background: "var(--bg)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  {/* Gradient uses Primary and Accent colors */}
                  <div
                    style={{
                      width: "85%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)",
                      borderRadius: "999px",
                    }}
                  ></div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <span className="badge badge-submitted">React</span>
                <span className="badge badge-submitted">TypeScript</span>
                <span className="badge badge-submitted">CSS</span>
              </div>
            </div>

            {/* Floating Element 1 */}
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-20px",
                background: "#fff",
                padding: "16px",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                border: "1px solid var(--border)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "var(--success-soft)",
                  padding: "8px",
                  borderRadius: "50%",
                }}
              >
                <CheckCircle size={20} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                  Shortlisted
                </p>
                <p
                  style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}
                >
                  Just now
                </p>
              </div>
            </div>

            {/* Floating Element 2 */}
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "-40px",
                background: "#fff",
                padding: "16px",
                borderRadius: "16px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                border: "1px solid var(--border)",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  background: "var(--warning-soft)",
                  padding: "8px",
                  borderRadius: "50%",
                }}
              >
                <Zap size={20} style={{ color: "var(--warning)" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>
                  Screening Complete
                </p>
                <p
                  style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}
                >
                  12 applicants ranked
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div
        style={{
          padding: "100px 48px",
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "64px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "36px",
              marginBottom: "16px",
              fontWeight: "800",
              letterSpacing: "-0.5px",
            }}
          >
            Why Choose TalentScreen?
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "18px" }}>
            {/* Built specifically for the AAUA community to streamline recruitment
            and internship placements. */}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "32px",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div
            className="card"
            style={{
              padding: "40px",
              transition: "transform 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                background: "var(--primary-soft)",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                color: "var(--primary)",
              }}
            >
              <Zap size={32} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              Automated Screening
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Our rule-based engine ranks applicants objectively based on
              skills, experience, and qualifications.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: "40px",
              transition: "transform 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                background: "var(--primary-soft)",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                color: "var(--primary)",
              }}
            >
              <Shield size={32} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              Secure Tracking
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Applicants can track their application status in real-time with
              full transparency.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: "40px",
              transition: "transform 0.2s",
              cursor: "default",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div
              style={{
                background: "var(--primary-soft)",
                width: "64px",
                height: "64px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
                color: "var(--primary)",
              }}
            >
              <GraduationCap size={32} />
            </div>
            <h3
              style={{
                fontSize: "20px",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              Internship Portal
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              A dedicated portal for SIWES and graduate internships, separate
              from the main job board.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: "14px",
        }}
      >
        {/* © 2026 TalentScreen. A Final Year Project for Adekunle Ajasin
        University, Akungba-Akoko. */}
      </div>
    </div>
  );
}
