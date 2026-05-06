import type { DashboardProfile } from "../types/dashboard.types";

type DashboardHeaderProps = {
  profile?: DashboardProfile;
  onOpenSidebar: () => void;
};

export const DashboardHeader = ({ profile, onOpenSidebar }: DashboardHeaderProps) => (
  <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
    <div className="flex items-center gap-4 flex-1">
      <button
        onClick={onOpenSidebar}
        className="p-2 -ml-2 hover:bg-slate-50 rounded-xl text-slate-500 lg:hidden"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>
      <div className="relative w-full max-w-sm hidden sm:block">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          className="w-full pl-12 pr-4 py-2.5 rounded-[1.25rem] border-transparent bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none text-sm font-medium transition-all shadow-inner"
          placeholder="Search resources..."
          type="text"
        />
      </div>
    </div>
    <div className="flex items-center gap-2 sm:gap-4">
      <button className="p-2.5 rounded-full text-slate-400 hover:bg-slate-50 relative transition-colors">
        <span className="material-symbols-outlined text-2xl">notifications</span>
        <span className="absolute top-2 right-2 size-2 bg-blue-600 rounded-full border-2 border-white"></span>
      </button>
      <div className="h-8 w-px bg-slate-100 mx-1 sm:mx-2"></div>
      <button className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
        <div className="size-9 rounded-xl bg-[#1148ad] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 overflow-hidden relative">
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
            {profile?.name?.[0] || "U"}
          </span>
        </div>
        <div className="text-left hidden xs:block">
          <p className="text-[13px] font-black text-slate-900 leading-none">{profile?.name || "User"}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Overview</p>
        </div>
      </button>
    </div>
  </header>
);
