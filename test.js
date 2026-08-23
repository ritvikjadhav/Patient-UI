import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Clock3,
  Phone,
  MoreHorizontal,
  AlertTriangle,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Stethoscope,
  Menu,
  X,
  Siren
} from "lucide-react";

const initialPatients = [
  {
    id: 1,
    token: "A-024",
    name: "Rahul Sharma",
    age: 31,
    gender: "Male",
    phone: "+91 98765 12001",
    reason: "Fever",
    arrival: "01:20 PM",
    wait: 8,
    status: "consulting",
    priority: "normal"
  },
  {
    id: 2,
    token: "A-025",
    name: "Priya Patil",
    age: 26,
    gender: "Female",
    phone: "+91 98765 12002",
    reason: "Headache",
    arrival: "01:25 PM",
    wait: 6,
    status: "waiting",
    priority: "normal"
  },
  {
    id: 3,
    token: "A-026",
    name: "Amit Jadhav",
    age: 42,
    gender: "Male",
    phone: "+91 98765 12003",
    reason: "Cold / Cough",
    arrival: "01:31 PM",
    wait: 4,
    status: "waiting",
    priority: "normal"
  },
  {
    id: 4,
    token: "E-001",
    name: "Sanjay More",
    age: 58,
    gender: "Male",
    phone: "+91 98765 12004",
    reason: "Emergency",
    arrival: "01:42 PM",
    wait: 1,
    status: "waiting",
    priority: "emergency"
  },
  {
    id: 5,
    token: "A-027",
    name: "Neha Shah",
    age: 22,
    gender: "Female",
    phone: "+91 98765 12005",
    reason: "Stomach Problem",
    arrival: "01:37 PM",
    wait: 3,
    status: "waiting",
    priority: "normal"
  }
];

function App() {
  const [patients, setPatients] = useState(initialPatients);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const waitingPatients = useMemo(() => {
    return patients
      .filter((patient) => patient.status === "waiting")
      .sort((a, b) => {
        if (a.priority === "emergency") return -1;
        if (b.priority === "emergency") return 1;
        return a.id - b.id;
      });
  }, [patients]);

  const currentPatient = patients.find(
    (patient) => patient.status === "consulting"
  );

  const emergencyPatients = patients.filter(
    (patient) =>
      patient.priority === "emergency" &&
      patient.status !== "completed"
  );

  const completedPatients = patients.filter(
    (patient) => patient.status === "completed"
  );

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.token} ${patient.phone} ${patient.reason}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const callNextPatient = () => {
    if (currentPatient) {
      alert("Complete the current consultation first.");
      return;
    }

    const nextPatient = waitingPatients[0];

    if (!nextPatient) {
      alert("No patients are waiting.");
      return;
    }

    setPatients((current) =>
      current.map((patient) =>
        patient.id === nextPatient.id
          ? {
              ...patient,
              status: "consulting"
            }
          : patient
      )
    );
  };

  const completeConsultation = () => {
    if (!currentPatient) return;

    setPatients((current) =>
      current.map((patient) =>
        patient.id === currentPatient.id
          ? {
              ...patient,
              status: "completed"
            }
          : patient
      )
    );
  };

  const toggleEmergency = (id) => {
    setPatients((current) =>
      current.map((patient) =>
        patient.id === id
          ? {
              ...patient,
              priority:
                patient.priority === "emergency"
                  ? "normal"
                  : "emergency"
            }
          : patient
      )
    );
  };

  return (
    <div className="app">

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">C</div>

          <div>
            <h2>CarePoint</h2>
            <span>Clinic Management</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="clinic-switcher">
          <div className="clinic-avatar">CP</div>

          <div>
            <strong>CarePoint Clinic</strong>
            <span>General Medicine</span>
          </div>

          <ChevronDown size={16} />
        </div>

        <nav>

          <p className="nav-title">WORKSPACE</p>

          <NavItem
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
            active={activePage === "dashboard"}
            onClick={() => setActivePage("dashboard")}
          />

          <NavItem
            icon={<ClipboardList size={19} />}
            label="Live Queue"
            badge={waitingPatients.length}
            active={activePage === "queue"}
            onClick={() => setActivePage("queue")}
          />

          <NavItem
            icon={<CalendarDays size={19} />}
            label="Appointments"
            active={activePage === "appointments"}
            onClick={() => setActivePage("appointments")}
          />

          <NavItem
            icon={<Users size={19} />}
            label="Patients"
            active={activePage === "patients"}
            onClick={() => setActivePage("patients")}
          />

          <p className="nav-title second">MANAGEMENT</p>

          <NavItem
            icon={<Search size={19} />}
            label="Patient Search"
            active={activePage === "search"}
            onClick={() => setActivePage("search")}
          />

          <NavItem
            icon={<Bell size={19} />}
            label="Notifications"
            active={activePage === "notifications"}
            onClick={() => setActivePage("notifications")}
          />

        </nav>

        <div className="sidebar-bottom">

          <div className="doctor-card">

            <div className="doctor-avatar">
              AS
            </div>

            <div>
              <strong>Dr. Aarav Shah</strong>

              <span>
                <i />
                Available
              </span>
            </div>

          </div>

          <NavItem
            icon={<Settings size={19} />}
            label="Settings"
            active={activePage === "settings"}
            onClick={() => setActivePage("settings")}
          />

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="global-search">

            <Search size={18} />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search patient, token or mobile..."
            />

            <kbd>⌘ K</kbd>

          </div>

          <div className="top-actions">

            <div className="live-status">
              <span />
              Live
            </div>

            <button className="notification">
              <Bell size={19} />
              <b />
            </button>

            <div className="reception-profile">

              <div className="reception-avatar">
                R
              </div>

              <div>
                <strong>Reception</strong>
                <span>Front Desk</span>
              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </header>

        <div className="content">

          <section className="page-header">

            <div>

              <span className="overline">
                SUNDAY · AUGUST 23, 2026
              </span>

              <h1>
                Good afternoon, Reception
              </h1>

              <p>
                Keep today's patient flow moving smoothly.
              </p>

            </div>

            <div className="header-actions">

              <button className="secondary-btn">
                <CalendarDays size={17} />
                Today's visits
              </button>

              <button className="primary-btn">
                <UserPlus size={17} />
                Add patient
              </button>

            </div>

          </section>

          <section className="stats">

            <Stat
              label="Waiting"
              value={waitingPatients.length}
              description="Patients in queue"
              icon={<Clock3 size={18} />}
            />

            <Stat
              label="Consulting"
              value={currentPatient ? 1 : 0}
              description="With doctor now"
              icon={<Stethoscope size={18} />}
            />

            <Stat
              label="Completed"
              value={completedPatients.length}
              description="Visits today"
              icon={<CheckCircle2 size={18} />}
            />

            <Stat
              label="Emergency"
              value={emergencyPatients.length}
              description="Needs attention"
              icon={<AlertTriangle size={18} />}
            />

          </section>

          <section className="dashboard-grid">

            <div className="queue-panel">

              <div className="panel-header">

                <div>

                  <div className="live-label">
                    <span />
                    LIVE QUEUE
                  </div>

                  <h2>
                    Patient Queue
                  </h2>

                  <p>
                    Patients are automatically ordered by priority.
                  </p>

                </div>

                {currentPatient ? (

                  <button
                    className="secondary-btn"
                    onClick={completeConsultation}
                  >
                    <CheckCircle2 size={17} />
                    Complete consultation
                  </button>

                ) : (

                  <button
                    className="primary-btn"
                    onClick={callNextPatient}
                  >
                    Call next
                    <ArrowRight size={17} />
                  </button>

                )}

              </div>

              {currentPatient && (

                <div className="current-patient">

                  <div className="current-left">

                    <div className="current-token">
                      {currentPatient.token}
                    </div>

                    <div>

                      <span className="current-label">
                        CURRENTLY WITH DOCTOR
                      </span>

                      <h3>
                        {currentPatient.name}
                      </h3>

                      <p>
                        {currentPatient.reason}
                      </p>

                    </div>

                  </div>

                  <div className="consulting-pill">
                    <span />
                    Consulting
                  </div>

                </div>

              )}

              <div className="queue-heading">

                <span>#</span>
                <span>Patient</span>
                <span>Reason</span>
                <span>Waiting</span>
                <span>Status</span>
                <span />

              </div>

              <div className="queue">

                {waitingPatients.map((patient, index) => (

                  <div
                    className={`queue-row ${
                      patient.priority === "emergency"
                        ? "emergency-row"
                        : ""
                    }`}
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                  >

                    <div className="queue-position">

                      {patient.priority === "emergency" ? (
                        <Siren size={17} />
                      ) : (
                        index + 1
                      )}

                    </div>

                    <div className="patient-cell">

                      <div className="patient-avatar">
                        {patient.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>

                        <strong>
                          {patient.name}
                        </strong>

                        <span>
                          {patient.token} · {patient.age} yrs
                        </span>

                      </div>

                    </div>

                    <div className="reason">
                      {patient.reason}
                    </div>

                    <div className="waiting-time">
                      <Clock3 size={15} />
                      {patient.wait} min
                    </div>

                    <div>

                      {patient.priority === "emergency" ? (

                        <span className="status emergency">
                          Emergency
                        </span>

                      ) : (

                        <span className="status waiting">
                          Waiting
                        </span>

                      )}

                    </div>

                    <button
                      className="row-menu"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedPatient(patient);
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                  </div>

                ))}

              </div>

              <div className="queue-footer">

                <span>
                  <span className="green-dot" />
                  Queue updates automatically
                </span>

                <span>
                  {waitingPatients.length} patients waiting
                </span>

              </div>

            </div>

            <aside className="right-column">

              <div className="next-card">

                <div className="card-top">

                  <div>

                    <span className="overline">
                      NEXT PATIENT
                    </span>

                    <h3>
                      {waitingPatients[0]?.token || "--"}
                    </h3>

                  </div>

                  <div className="next-icon">
                    <ArrowRight size={20} />
                  </div>

                </div>

                {waitingPatients[0] && (

                  <>
                    <div className="next-person">

                      <div className="big-avatar">
                        {waitingPatients[0].name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>

                        <strong>
                          {waitingPatients[0].name}
                        </strong>

                        <span>
                          {waitingPatients[0].age} yrs ·{" "}
                          {waitingPatients[0].gender}
                        </span>

                      </div>

                    </div>

                    <div className="next-reason">

                      <span>
                        Reason for visit
                      </span>

                      <strong>
                        {waitingPatients[0].reason}
                      </strong>

                    </div>
                  </>

                )}

              </div>

              <div className="emergency-card">

                <div className="emergency-heading">

                  <div className="emergency-icon">
                    <AlertTriangle size={18} />
                  </div>

                  <div>

                    <span>
                      ATTENTION
                    </span>

                    <h3>
                      Emergency
                    </h3>

                  </div>

                </div>

                {emergencyPatients.length > 0 ? (

                  emergencyPatients.map((patient) => (

                    <div
                      className="emergency-patient"
                      key={patient.id}
                    >

                      <div>

                        <strong>
                          {patient.name}
                        </strong>

                        <span>
                          {patient.token} · {patient.reason}
                        </span>

                      </div>

                      <button
                        onClick={() =>
                          setSelectedPatient(patient)
                        }
                      >
                        View
                      </button>

                    </div>

                  ))

                ) : (

                  <p className="no-emergency">
                    No emergency patients right now.
                  </p>

                )}

              </div>

              <div className="quick-card">

                <div className="quick-heading">

                  <h3>
                    Quick actions
                  </h3>

                  <span>
                    Common tasks
                  </span>

                </div>

                <QuickAction
                  icon={<UserPlus size={17} />}
                  title="Register patient"
                  description="Manual registration"
                />

                <QuickAction
                  icon={<Search size={17} />}
                  title="Find patient"
                  description="Search records"
                />

                <QuickAction
                  icon={<CalendarDays size={17} />}
                  title="Appointments"
                  description="View today's schedule"
                />

              </div>

            </aside>

          </section>

          {search && (

            <section className="search-results">

              <div className="search-results-header">

                <div>

                  <span className="overline">
                    SEARCH
                  </span>

                  <h2>
                    Patient results
                  </h2>

                </div>

                <span>
                  {filteredPatients.length} results
                </span>

              </div>

              {filteredPatients.map((patient) => (

                <button
                  className="search-result"
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                >

                  <div className="patient-avatar">
                    {patient.name[0]}
                  </div>

                  <div>

                    <strong>
                      {patient.name}
                    </strong>

                    <span>
                      {patient.token} · {patient.phone}
                    </span>

                  </div>

                  <span>
                    {patient.reason}
                  </span>

                </button>

              ))}
