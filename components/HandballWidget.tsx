"use client";

import { useEffect, useRef } from "react";
import { TOURNAMENT_ID } from "@/lib/site";

type WidgetType = "tabelle" | "spielplan";

interface HandballWidgetProps {
  widget: WidgetType;
  className?: string;
}

export default function HandballWidget({ widget, className }: HandballWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = `handball-${widget}-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.id = containerId;

    const initScript = document.createElement("script");
    initScript.innerHTML = `
      (function(e,t,n,r,i,s,o){
        e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},
        e[i].l=1*new Date;s=t.createElement(n),o=t.getElementsByTagName(n)[0];
        s.async=1;s.src=r;o.parentNode.insertBefore(s,o)
      })(window,document,"script","https://www.handball.net/widgets/embed/v1.js","_hb");
    `;
    document.head.appendChild(initScript);

    const widgetScript = document.createElement("script");
    widgetScript.innerHTML = `
      _hb({
        widget: '${widget}',
        tournamentId: '${TOURNAMENT_ID}',
        container: '${containerId}'
      });
    `;

    const timer = setTimeout(() => {
      document.body.appendChild(widgetScript);
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [widget, containerId]);

  return <div ref={containerRef} className={className} />;
}
