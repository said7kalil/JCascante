import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Plus, Upload, Loader2, Trash2, FileText, Presentation, ArrowLeft, ArrowRight, Maximize, Share2, Download, X } from "lucide-react";
import { api, apiErr, fileUrl } from "@/lib/api";

export const SlidesTab = () => {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewIdx, setViewIdx] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    try { const { data } = await api.get("/presentations"); setItems(data); }
    catch (e) { toast.error(apiErr(e)); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const upload = async (file) => {
    if (!file) return;
    if (!title.trim()) { toast.error("Escribe un título para la diapositiva"); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("title", title); fd.append("file", file);
    try { await api.post("/presentations", fd); toast.success("Diapositiva subida"); setTitle(""); load(); }
    catch (e) { toast.error(apiErr(e)); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const del = async (id) => {
    try { await api.delete(`/presentations/${id}`); toast.success("Eliminada"); load(); }
    catch (e) { toast.error(apiErr(e)); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input data-testid="slide-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la diapositiva"
               className="ui-field border border-white/15 rounded-xl px-5 py-3 ui-ink placeholder:ui-muted outline-none focus:border-cyan min-w-[240px]" />
        <label data-testid="new-slide-btn" className="inline-flex items-center gap-2 rounded-xl bg-navy-600 border border-white/15 px-5 py-3 font-semibold ui-ink hover:bg-navy-500 transition cursor-pointer">
          {uploading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} className="text-cyan" />} Nueva diapositiva (PDF/PPTX)
          <input ref={fileRef} type="file" accept="application/pdf,.pptx,.ppt" className="hidden" onChange={(e) => upload(e.target.files[0])} />
        </label>
      </div>

      {items.length === 0 ? (
        <p className="p-10 text-center ui-muted ui-card rounded-2xl border ui-line">Sube tu primera presentación en PDF o PPTX.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <div key={it.id} data-testid={`slide-card-${i}`} className="rounded-2xl ui-card border ui-line p-5 hover:border-cyan/40 transition group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${it.kind === "pdf" ? "bg-pulse/15 text-pulse" : "bg-cyan/15 text-cyan"}`}>
                  {it.kind === "pdf" ? <FileText size={20} /> : <Presentation size={20} />}
                </div>
                <button onClick={() => del(it.id)} className="ui-muted hover:text-pulse"><Trash2 size={17} /></button>
              </div>
              <p className="font-display font-bold ui-ink mb-1 truncate">{it.title}</p>
              <p className="text-xs ui-muted uppercase tracking-wide mb-4">{it.kind}</p>
              <button onClick={() => setViewIdx(i)} data-testid={`slide-open-${i}`}
                      className="w-full rounded-lg bg-gold/90 py-2 text-navy-950 font-bold text-sm hover:bg-gold transition">Abrir visor</button>
            </div>
          ))}
        </div>
      )}

      {viewIdx !== null && (
        <SlideViewer items={items} idx={viewIdx} setIdx={setViewIdx} onClose={() => setViewIdx(null)} />
      )}
    </div>
  );
};

const SlideViewer = ({ items, idx, setIdx, onClose }) => {
  const containerRef = useRef(null);
  const it = items[idx];
  const src = fileUrl(it.file.url);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const fullscreen = () => {
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
  };
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: it.title, text: `Presentación: ${it.title}` });
      else { await navigator.clipboard.writeText(it.title); toast.success("Título copiado"); }
    } catch { /* cancelled */ }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-navy-950/95 backdrop-blur flex flex-col p-4 lg:p-8" data-testid="slide-viewer">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display font-bold ui-ink text-lg">{it.title}</p>
        <button onClick={onClose} className="ui-sub hover:ui-ink"><X size={24} /></button>
      </div>

      <div ref={containerRef} className="flex-1 rounded-2xl overflow-hidden bg-white flex items-center justify-center">
        {it.kind === "pdf" ? (
          <iframe title={it.title} src={src} className="w-full h-full" />
        ) : (
          <div className="text-center p-10">
            <Presentation size={56} className="text-cyan mx-auto mb-4" />
            <p className="font-display font-bold text-navy-950 text-xl mb-2">{it.title}</p>
            <p className="text-navy-950/60 mb-6">Los archivos PPTX no se previsualizan en el navegador. Descárgalo para verlo.</p>
            <a href={src} download={it.file.original_filename} className="inline-flex items-center gap-2 bg-pulse ui-ink rounded-full px-6 py-3 font-semibold">
              <Download size={18} /> Descargar PPTX
            </a>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-6 lg:gap-10 text-gold font-semibold">
        <button onClick={() => setIdx((idx - 1 + items.length) % items.length)} data-testid="slide-prev" className="inline-flex items-center gap-2 hover:ui-ink transition"><ArrowLeft size={18} /> Atrás</button>
        <button onClick={fullscreen} data-testid="slide-fullscreen" className="inline-flex items-center gap-2 hover:ui-ink transition"><Maximize size={18} /> Fullscreen</button>
        <button onClick={share} data-testid="slide-share" className="inline-flex items-center gap-2 hover:ui-ink transition"><Share2 size={18} /> Compartir</button>
        <a href={src} download={it.file.original_filename} data-testid="slide-download" className="inline-flex items-center gap-2 hover:ui-ink transition"><Download size={18} /> Descargar</a>
        <button onClick={() => setIdx((idx + 1) % items.length)} data-testid="slide-next" className="inline-flex items-center gap-2 hover:ui-ink transition">Siguiente <ArrowRight size={18} /></button>
      </div>
    </div>
  );
};
