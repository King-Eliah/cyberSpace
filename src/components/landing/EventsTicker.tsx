"use client";

const ITEMS = [
  { type: "EVENT", date: "JUN 12", title: "GDG Kumasi DevFest 2025" },
  { type: "NEWS", title: "HackKNUST applications now open" },
  { type: "EVENT", date: "JUN 18", title: "KNUST SRC Career & Internship Fair" },
  { type: "NEWS", title: "MEST Africa visiting KNUST this month" },
  { type: "EVENT", date: "JUL 3", title: "Startup Weekend Kumasi 2025" },
  { type: "NEWS", title: "Google Cloud Study Jam — 50 spots left" },
  { type: "EVENT", date: "JUL 14", title: "Ashesi × KNUST Networking Night" },
  { type: "NEWS", title: "InstaDeep ML internship — deadline Aug 1" },
  { type: "EVENT", date: "AUG 2", title: "IEEE KNUST: AI in Healthcare Talk" },
  { type: "NEWS", title: "ALX Africa info session this Friday" },
];

export function EventsTicker() {
  return (
    <div className="border-t border-[#2A2A28] bg-[#0A0A09] overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex items-center px-5 border-r border-[#2A2A28] flex-shrink-0 py-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C84B31]">
            Live
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C84B31] ml-2 animate-pulse" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track flex items-center gap-0">
            {[...ITEMS, ...ITEMS].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-8 border-r border-[#2A2A28] py-4 flex-shrink-0 cursor-pointer group hover:bg-[#1A1A18] transition-colors"
              >
                {item.date ? (
                  <div className="text-center flex-shrink-0">
                    <p className="text-[9px] font-semibold text-[#6B6B63] uppercase leading-none">
                      {item.date.split(" ")[0]}
                    </p>
                    <p className="text-xl font-bold text-white leading-none">
                      {item.date.split(" ")[1]}
                    </p>
                  </div>
                ) : (
                  <span className="text-[10px] font-semibold text-[#6B6B63] uppercase tracking-wider border border-[#2A2A28] px-2 py-0.5 flex-shrink-0">
                    NEWS
                  </span>
                )}
                <p className="text-sm font-semibold text-[#FAFAF7] whitespace-nowrap group-hover:text-[#C84B31] transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
