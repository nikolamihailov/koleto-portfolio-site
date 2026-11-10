import { useEffect, useState } from 'react';

/** Returns the id of the section currently in the middle of the viewport. */
export function useActiveSection(ids: string[], enabled = true) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    // Sections may mount after the loader finishes, so retry briefly.
    const attach = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    attach();
    const t = window.setTimeout(attach, 500);
    return () => {
      window.clearTimeout(t);
      observer.disconnect();
    };
  }, [ids, enabled]);

  return active;
}
