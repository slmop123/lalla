import React, { useState, useEffect } from "react";
import { BellRing, RefreshCw } from "lucide-react";
import { getTicker } from "../lib/supabaseClient";

export default function MarqueeTicker() {
  const [tickerMessage, setTickerMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadTicker = async () => {
    setIsLoading(true);
    try {
      const message = await getTicker();
      setTickerMessage(message);
    } catch (err) {
      console.error("Error loading ticker:", err);
      setTickerMessage("مرحباً بكم في البوابة التربوية للثانوية الإعدادية للا أسماء بمديرية عين السبع.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTicker();

    window.addEventListener("school-data-updated", loadTicker);
    return () => window.removeEventListener("school-data-updated", loadTicker);
  }, []);

  return (
    <div className="bg-amber-50 border-b border-amber-200/60 text-slate-800 flex items-center relative h-11 overflow-hidden select-none shadow-sm z-30">
      
      {/* Alert Badge Indicator (Sticky right side for RTL Layout) */}
      <div className="bg-traditional-clay text-white px-3 sm:px-4 h-full flex items-center gap-1.5 font-bold text-xs sm:text-sm z-40 shadow-md shrink-0 relative">
        <BellRing className="h-4.5 w-4.5 animate-bounce text-amber-200" />
        <span className="whitespace-nowrap font-serif tracking-wide">شريط المستجدات العاجلة</span>
        {/* Decorative arrow element */}
        <div className="absolute top-0 -left-3.5 h-0 w-0 border-y-[22px] border-y-transparent border-r-[14px] border-r-traditional-clay"></div>
      </div>

      {/* Marquee Body */}
      <div className="flex-1 px-4 relative flex items-center overflow-hidden h-full">
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-xs text-right pr-2">
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-moroccan-gold" />
            <span>جاري جلب آخر الأخبار...</span>
          </div>
        ) : (
          <marquee
            behavior="scroll"
            direction="right"
            scrollamount="5"
            className="text-right w-full font-medium text-xs sm:text-sm text-slate-700/90 whitespace-nowrap"
            style={{ direction: "rtl", unicodeBidi: "bidi-override" }}
          >
            {tickerMessage}
          </marquee>
        )}
      </div>

    </div>
  );
}
