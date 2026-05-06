import { SidebarLink } from "./DashboardUI";
import type { DashboardProfile, DashboardTab } from "../types/dashboard.types";

type DashboardSidebarProps = {
  activeTab: DashboardTab;
  selectedFormId: number | null;
  email: string;
  profile?: DashboardProfile;
  onTabChange: (tab: DashboardTab, formId?: number | null) => void;
  onLogout: () => void;
};

export const DashboardSidebar = ({
  activeTab,
  selectedFormId,
  email,
  profile,
  onTabChange,
  onLogout,
}: DashboardSidebarProps) => (
  <div className="h-full flex flex-col">
    <div className="p-6 flex items-center gap-3">
      <div className="size-10 bg-[#1148ad] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
        <span className="material-symbols-outlined text-white text-2xl">dynamic_form</span>
      </div>
      <div>
        <h1 className="font-black text-lg leading-tight text-[#104aac] tracking-tight">AI FormFlow</h1>
        <p className="text-[10px] uppercase font-black tracking-widest text-[#104aac]/40 mt-0.5">Enterprise</p>
      </div>
    </div>

    <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
      <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Workspace</div>
      <SidebarLink icon="dashboard" label="Dashboard" active={activeTab === "dashboard"} onClick={() => onTabChange("dashboard", null)} />
      <SidebarLink icon="description" label="My Forms" active={activeTab === "my-forms"} onClick={() => onTabChange("my-forms", null)} />
      {(selectedFormId || activeTab === "submissions") && (
        <SidebarLink icon="group" label="Submissions" active={activeTab === "submissions"} onClick={() => onTabChange("submissions")} />
      )}
      <SidebarLink icon="analytics" label="Insights" active={activeTab === "insights"} onClick={() => onTabChange("insights")} />

      <div className="pt-8 pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System</div>
      <SidebarLink icon="settings" label="Settings" active={activeTab === "settings"} onClick={() => onTabChange("settings")} />
      <SidebarLink icon="help" label="Support" badge="New" active={activeTab === "support"} onClick={() => onTabChange("support")} />
    </nav>

    <div className="p-4 mt-auto">
      <div className="bg-gradient-to-br from-[#0033cc] to-[#1148ad] rounded-2xl p-5 text-white relative overflow-hidden group shadow-xl shadow-blue-500/10">
        <div className="absolute -top-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Current Plan</p>
        <h4 className="font-bold text-sm mb-4">Pro Membership</h4>
        <button className="w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-white/10 group/btn">
          Upgrade Now
          <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
        </button>
      </div>

      <div className="mt-4 bg-[#0033cc]/5 rounded-2xl p-3 border border-blue-50/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-xl bg-[#1148ad] flex items-center justify-center text-sm font-bold text-white overflow-hidden shadow-inner relative">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(event) => {
                  (event.target as HTMLImageElement).style.display = "none";
                  const fallback = (event.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <span className={`${profile?.avatar ? "hidden" : "flex"} items-center justify-center w-full h-full`}>
              {profile?.name?.[0] || email?.[0] || "U"}
            </span>
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-black truncate text-[#104aac]">{profile?.name || "User Account"}</p>
            <p className="text-[11px] text-[#104aac]/50 truncate font-bold">{email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full py-2.5 hover:bg-[#1148ad] hover:text-white rounded-xl text-xs font-black transition-all bg-[#0033cc]/10 text-[#0033cc] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Exit Dashboard
        </button>
      </div>
    </div>
  </div>
);
