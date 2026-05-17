/**
 * Loader — Full-page and inline loading spinner.
 */

export default function Loader({ fullPage = false, size = 'md', text = '' }) {
  const sizeClass = size === 'lg' ? 'spinner-lg' : 'spinner';

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center"
           style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className={sizeClass}></div>
          {text && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <div className={sizeClass}></div>
        {text && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
