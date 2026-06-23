import { useState, useEffect } from "react";
import { EnvelopeSimple, CircleNotch, FilePdf, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { lettersApi, type LetterResponse } from "@/api/letters.api";
import { useNavigate } from "react-router";

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-yellow-400',
  processing: 'text-brand-neon-blue',
  paid: 'text-brand-neon-green',
  failed: 'text-red-400',
  refunded: 'text-brand-light-grey/60',
  unpaid: 'text-yellow-400',
  pending_print: 'text-brand-neon-blue',
  printing: 'text-brand-neon-blue',
  shipped: 'text-brand-neon-green',
  delivered: 'text-brand-neon-green',
  returned: 'text-red-400',
};

const formatDate = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const MyLetters = () => {
  const navigate = useNavigate();
  const [letters, setLetters] = useState<LetterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    lettersApi.list().then((res) => {
      if (res.success) {
        setLetters(res.data);
        setError(null);
      } else {
        setError(res.error.message);
      }
      setLoading(false);
    });
  }, []);

  const handleDownload = async (letterId: string) => {
    setDownloadingId(letterId);
    try {
      await lettersApi.downloadPdf(letterId);
    } catch (err: any) {
      alert(err.message || 'Failed to download PDF');
    } finally {
      setDownloadingId(null);
    }
  };

  const getPreview = (body: string): string => {
    const txt = body ? new DOMParser().parseFromString(body, 'text/html').body.textContent || '' : '';
    return txt.substring(0, 80) || 'Letter draft';
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest font-mono text-brand-neon-green">
            Your Letters
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-heading mt-1">
            My Letters
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <CircleNotch size={28} className="animate-spin text-brand-neon-green" />
          </div>
        ) : error ? (
          <div className="rounded-none border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-mono text-red-300">
            {error}
          </div>
        ) : letters.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <EnvelopeSimple size={40} className="text-brand-light-grey/30" />
            <p className="font-mono text-base text-brand-light-grey/70">
              You haven't written any letters yet.
            </p>
            <Button
              asChild
              className="mt-2 h-12 px-8 text-sm uppercase tracking-widest font-mono font-bold rounded-none"
            >
              <a href="/letter">
                Write your first letter
                <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {letters.map((letter) => (
              <div
                key={letter.id}
                className="flex items-center justify-between border border-white/10 bg-brand-dark-grey/20 px-4 py-3 transition-colors hover:border-white/20"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">
                      {getPreview(letter.body)}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-brand-light-grey/50 px-1.5 py-0.5 border border-white/10 shrink-0">
                      {letter.category}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs font-mono text-brand-light-grey/60">
                    <span>To: {letter.recipient.name || 'Not set'}</span>
                    <span>&middot;</span>
                    <span>{formatDate(letter.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className={`text-[10px] uppercase font-mono font-bold ${STATUS_COLORS[letter.paymentStatus] || 'text-brand-light-grey/50'}`}>
                    {letter.paymentStatus}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleDownload(letter.id)}
                    disabled={downloadingId === letter.id}
                    className="text-[10px] font-mono uppercase tracking-wider rounded-none h-7 px-3"
                  >
                    {downloadingId === letter.id ? (
                      <CircleNotch size={14} className="animate-spin" />
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <FilePdf size={14} />
                        PDF
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLetters;
