import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Key,
  Bell,
  CreditCard,
  Download,
  LogOut,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  Globe,
} from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [security, setSecurity] = useState(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const base = "http://localhost:8000/api/profile";

        const [pRes, sRes, secRes, keyRes] = await Promise.all([
          fetch(`${base}/me`, { headers }),
          fetch(`${base}/stats`, { headers }),
          fetch(`${base}/security`, { headers }),
          fetch(`${base}/api-key`, { headers }),
        ]);

        const [p, s, sec, key] = await Promise.all([
          pRes.json(),
          sRes.json(),
          secRes.json(),
          keyRes.json(),
        ]);

        setProfile(p);
        setStats(s);
        setSecurity(sec);
        setApiKey(key.api_key);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateProfile = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:8000/api/profile/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editName,
          phone: editPhone,
        }),
      });

      if (res.ok) {
        setProfile({ ...profile, full_name: editName, phone: editPhone });
        setEditing(false);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const revokeApiKey = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await fetch("http://localhost:8000/api/profile/api-key/revoke", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setApiKey("Revoked — generate a new one");
    } catch (err) {
      console.error("Revoke failed", err);
    }
  };

  const generateNewKey = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:8000/api/profile/api-key/generate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApiKey(data.api_key);
    } catch (err) {
      console.error("Generate failed", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl flex items-center justify-center shadow-md">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Account Center
              </h1>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-green-700">
                {loading
                  ? "Loading..."
                  : profile?.verified
                  ? "Active • Verified"
                  : "Active"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div>
            <nav className="bg-white rounded-2xl border border-gray-200 shadow-sm divide-y divide-gray-200">
              {[
                { id: "account", label: "Account Overview", icon: User },
                { id: "security", label: "Security & Login", icon: Shield },
                { id: "api", label: "API Keys", icon: Key },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "billing", label: "Billing & Plan", icon: CreditCard },
                { id: "data", label: "Data & Export", icon: Download },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-4 px-6 py-5 text-left transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 bg-gradient-to-br from-red-600 to-pink-700 text-white rounded-2xl p-6 shadow-lg cursor-pointer hover:opacity-95 transition">
              <LogOut className="w-8 h-8 mb-3" />
              <p className="font-bold text-lg">Sign Out</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>

                    {!editing && (
                      <button
                        onClick={() => {
                          setEditing(true);
                          setEditName(profile?.full_name || "");
                          setEditPhone(profile?.phone || "");
                        }}
                        className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {/* EDIT FORM */}
                  {editing && (
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        className="w-full border px-4 py-2 rounded"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        className="w-full border px-4 py-2 rounded"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Phone"
                      />

                      <div className="flex gap-4">
                        <button
                          onClick={updateProfile}
                          className="px-5 py-2 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(false)}
                          className="px-5 py-2 bg-gray-200 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PROFILE INFO */}
                  {!editing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                          {profile?.full_name
                            ? getInitials(profile.full_name)
                            : "U"}
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-900">
                            {profile?.full_name}
                          </p>
                          <p className="text-gray-600">
                            {profile?.role || "Professional Trader"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <InfoRow icon={Mail} label="Email" value={profile?.email} verified={profile?.verified} />
                        <InfoRow icon={Phone} label="Phone" value={profile?.phone} />
                        <InfoRow icon={Calendar} label="Member Since" value={formatDate(profile?.member_since)} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ACCOUNT STATS */}
                {!loading && stats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Account Tier" value={stats.tier} badge="Premium Access" color="indigo" />
                    <StatCard title="API Rate Limit" value={stats.api_rate_limit} badge="Enterprise" color="emerald" />
                    <StatCard title="Data Retention" value={stats.data_retention} badge="Full History" color="purple" />
                  </div>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && security && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-8">Security Settings</h2>

                <SecurityItem title="Two-Factor Authentication" status={security.two_factor_enabled ? "Enabled" : "Disabled"} verified={security.two_factor_enabled} />
                <SecurityItem title="Login Alerts" status={security.login_alerts ? "Enabled" : "Disabled"} />
                <SecurityItem title="Session Timeout" status={security.session_timeout} />
                <SecurityItem title="Password" status={`Changed on ${formatDate(security.password_changed_at)}`} action="Change Password" />
              </div>
            )}

            {/* API KEY TAB */}
            {activeTab === "api" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-8">API Access</h2>

                <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm break-all">
                  {apiKey}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={revokeApiKey}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl"
                  >
                    Revoke Key
                  </button>

                  <button
                    onClick={generateNewKey}
                    className="px-6 py-3 bg-blue-700 text-white rounded-xl"
                  >
                    Generate New Key
                  </button>
                </div>
              </div>
            )}

            {/* COMING SOON SECTIONS */}
            {["notifications", "billing", "data"].includes(activeTab) && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center text-gray-500">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, verified }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-medium text-gray-900 flex items-center gap-2">
          {value}
          {verified && <CheckCircle2 className="w-4 h-4 text-green-600" />}
        </p>
      </div>
    </div>
  );
}

function SecurityItem({ title, status, action, verified }) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-gray-100">
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{status}</p>
      </div>
      <div className="flex items-center gap-3">
        {verified && <CheckCircle2 className="w-6 h-6 text-green-600" />}
        {action && <button className="text-blue-700 hover:underline">{action}</button>}
      </div>
    </div>
  );
}

function StatCard({ title, value, badge, color }) {
  const colors = {
    indigo: "from-indigo-600 to-blue-700",
    emerald: "from-emerald-600 to-teal-700",
    purple: "from-purple-600 to-pink-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-600 uppercase">{title}</p>
      <p className="mt-3 text-2xl font-black text-gray-900">{value}</p>
      <div className={`mt-4 inline-flex px-4 py-2 rounded-full text-white text-xs font-bold bg-gradient-to-r ${colors[color]}`}>
        {badge}
      </div>
    </div>
  );
}
