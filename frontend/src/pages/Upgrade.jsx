/**
 * Upgrade — Premium subscription page with UPI payment flow.
 * Shows plan comparison, QR code, and payment submission form.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Crown, Check, X, Upload, ArrowLeft, Shield, Zap, FileText,
  Sparkles, Clock, Star, CreditCard, Copy, CheckCircle, Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import {
  fetchSubscriptionStatus,
  fetchPaymentConfig,
  submitPayment,
  fetchPaymentHistory,
} from '../redux/subscriptionSlice';

const UPI_ID = '9399265348@ibl';

export default function Upgrade() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState('plans'); // plans | payment | submitted
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status: subStatus, paymentHistory, config } = useSelector((s) => s.subscription);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchSubscriptionStatus());
    dispatch(fetchPaymentConfig());
    dispatch(fetchPaymentHistory());
  }, [dispatch]);

  // Check for pending payment
  const hasPending = paymentHistory?.some?.((p) => p.status === 'pending');

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error('Please enter the transaction ID');
      return;
    }
    if (!screenshot) {
      toast.error('Please upload the payment screenshot');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('transaction_id', transactionId.trim());
    formData.append('screenshot', screenshot);

    const result = await dispatch(submitPayment(formData));
    setIsSubmitting(false);

    if (submitPayment.fulfilled.match(result)) {
      toast.success('Payment submitted! We\'ll verify it shortly.');
      setStep('submitted');
      dispatch(fetchPaymentHistory());
    } else {
      toast.error(result.payload || 'Submission failed');
    }
  };

  const freeFeatures = [
    'Up to 3 resumes',
    '3 PDF exports/month',
    '3 free templates',
    'AI text improvement',
    'ATS scoring (basic)',
  ];

  const premiumFeatures = [
    'Unlimited resumes',
    'Unlimited PDF exports',
    '5 premium templates',
    'AI text improvement',
    'Advanced ATS scoring',
    'Priority support',
    'Premium template designs',
    'Export history tracking',
  ];

  return (
    <div className="page-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area" style={{ padding: '32px 36px' }}>
        {/* Back Button */}
        <button
          onClick={() => step === 'plans' ? navigate('/dashboard') : setStep('plans')}
          className="btn-ghost"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px',
            borderRadius: '10px', fontSize: '14px', fontWeight: 500, marginBottom: '24px',
            color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* If already premium */}
        {subStatus?.is_premium && step === 'plans' && (
          <div className="animate-fade-in-up" style={{
            padding: '28px 32px', borderRadius: '20px', marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(16, 185, 129, 0.15)',
              }}>
                <Crown size={22} style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Premium Active
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {subStatus.days_remaining} days remaining · Expires {new Date(subStatus.subscription_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Payment State */}
        {hasPending && step === 'plans' && (
          <div className="animate-fade-in-up" style={{
            padding: '28px 32px', borderRadius: '20px', marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(245, 158, 11, 0.15)',
              }}>
                <Clock size={22} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Payment Pending Verification
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Your payment is being reviewed. You'll be upgraded once verified.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP: Plan Comparison */}
        {step === 'plans' && (
          <div className="animate-fade-in-up">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '32px', fontWeight: 800, letterSpacing: '-0.04em',
                color: 'var(--text-primary)', marginBottom: '8px',
              }}>
                Upgrade to <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</span>
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto' }}>
                Unlock unlimited exports, premium templates, and advanced features.
              </p>
            </div>

            {/* Plan Cards */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px', maxWidth: '700px', margin: '0 auto',
            }}>
              {/* Free Plan */}
              <div style={{
                padding: '28px', borderRadius: '20px',
                background: 'var(--bg-secondary)', border: '1.5px solid var(--border-default)',
                position: 'relative',
              }}>
                <div style={{
                  fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px',
                }}>Free</div>
                <div style={{
                  fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)',
                  letterSpacing: '-0.04em', lineHeight: 1,
                }}>₹0</div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>Forever free</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {freeFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Check size={15} style={{ color: '#10b981', flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
                <button disabled className="btn" style={{
                  marginTop: '24px', width: '100%', padding: '12px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, background: 'var(--bg-tertiary)',
                  color: 'var(--text-tertiary)', border: '1px solid var(--border-default)', cursor: 'not-allowed',
                }}>
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div style={{
                padding: '28px', borderRadius: '20px', position: 'relative',
                background: 'var(--bg-secondary)',
                border: '2px solid rgba(99, 102, 241, 0.4)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.08)',
              }}>
                <div style={{
                  position: 'absolute', top: '-12px', right: '20px',
                  padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                  background: 'var(--gradient-primary)', color: 'white', letterSpacing: '0.5px',
                }}>
                  POPULAR
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '8px',
                }}>
                  <Crown size={16} style={{ color: '#f59e0b' }} />
                  <span style={{
                    fontSize: '12px', fontWeight: 700, color: '#f59e0b',
                    textTransform: 'uppercase', letterSpacing: '2px',
                  }}>Premium</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span style={{
                    fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)',
                    letterSpacing: '-0.04em', lineHeight: 1,
                  }}>₹99</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>/month</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)', marginBottom: '24px' }}>30 days of premium access</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {premiumFeatures.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <Check size={15} style={{ color: '#6366f1', flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('payment')}
                  disabled={subStatus?.is_premium || hasPending}
                  className="btn btn-primary"
                  style={{
                    marginTop: '24px', width: '100%', padding: '13px', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 700, gap: '8px',
                    opacity: (subStatus?.is_premium || hasPending) ? 0.5 : 1,
                  }}
                >
                  <Zap size={16} />
                  {subStatus?.is_premium ? 'Already Premium' : hasPending ? 'Verification Pending' : 'Upgrade Now'}
                </button>
              </div>
            </div>

            {/* Payment History */}
            {paymentHistory?.length > 0 && (
              <div style={{ maxWidth: '700px', margin: '40px auto 0' }}>
                <h3 style={{
                  fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
                  marginBottom: '16px', letterSpacing: '-0.02em',
                }}>Payment History</h3>
                <div style={{
                  borderRadius: '16px', overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                }}>
                  {paymentHistory.map((p, i) => (
                    <div key={p.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 20px', background: 'var(--bg-secondary)',
                      borderBottom: i < paymentHistory.length - 1 ? '1px solid var(--border-default)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          ₹{p.amount} — {p.transaction_id}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {new Date(p.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{
                        padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                        background: p.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' :
                          p.status === 'rejected' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: p.status === 'approved' ? '#10b981' :
                          p.status === 'rejected' ? '#ef4444' : '#f59e0b',
                      }}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP: Payment */}
        {step === 'payment' && (
          <div className="animate-fade-in-up" style={{ maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{
                fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)',
                letterSpacing: '-0.03em', marginBottom: '6px',
              }}>Complete Payment</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Pay ₹99 via UPI and upload the screenshot
              </p>
            </div>

            {/* UPI Payment Card */}
            <div style={{
              padding: '28px', borderRadius: '20px', marginBottom: '24px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '12px', fontWeight: 700, color: '#6366f1',
                textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px',
              }}>Scan to Pay</div>

              {/* QR Code */}
              <div style={{
                width: '200px', height: '200px', margin: '0 auto 20px',
                borderRadius: '16px', overflow: 'hidden',
                border: '3px solid var(--border-default)',
                background: '#1a1a2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src="/upi-qr.png"
                  alt="UPI QR Code"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  display: 'none', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', color: '#a5aaff', fontSize: '12px',
                  padding: '20px', textAlign: 'center',
                }}>
                  <CreditCard size={32} style={{ marginBottom: '8px' }} />
                  <span>QR Code</span>
                  <span style={{ fontSize: '10px', color: '#718096' }}>Use UPI ID below</span>
                </div>
              </div>

              {/* UPI ID */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', marginBottom: '8px',
              }}>
                <span style={{
                  fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)',
                  fontFamily: 'monospace', letterSpacing: '0.5px',
                }}>{UPI_ID}</span>
                <button
                  onClick={handleCopyUPI}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                    background: copied ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                    color: copied ? '#10b981' : 'var(--text-secondary)',
                    border: '1px solid var(--border-default)', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1', marginTop: '12px' }}>
                ₹99
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Premium · 30 days</div>
            </div>

            {/* Payment Submission Form */}
            <form onSubmit={handleSubmit}>
              <div style={{
                padding: '28px', borderRadius: '20px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-default)',
              }}>
                <h3 style={{
                  fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)',
                  marginBottom: '20px', letterSpacing: '-0.01em',
                }}>Submit Payment Proof</h3>

                {/* Transaction ID */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontWeight: 600,
                    color: 'var(--text-secondary)', marginBottom: '6px',
                  }}>Transaction / UTR ID</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g., 412345678901"
                    required
                    style={{
                      width: '100%', padding: '12px 16px', fontSize: '14px',
                      borderRadius: '12px', background: 'var(--bg-primary)',
                      border: '1.5px solid var(--border-default)',
                      color: 'var(--text-primary)', outline: 'none',
                      fontFamily: "'Inter', sans-serif",
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-500)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
                  />
                </div>

                {/* Screenshot Upload */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block', fontSize: '13px', fontWeight: 600,
                    color: 'var(--text-secondary)', marginBottom: '6px',
                  }}>Payment Screenshot</label>
                  <label
                    htmlFor="screenshot-upload"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', padding: '24px', borderRadius: '12px',
                      border: '2px dashed var(--border-default)', cursor: 'pointer',
                      background: screenshotPreview ? 'transparent' : 'var(--bg-primary)',
                      transition: 'all 0.2s', minHeight: '120px',
                    }}
                  >
                    {screenshotPreview ? (
                      <img
                        src={screenshotPreview}
                        alt="Preview"
                        style={{ maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }}
                      />
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                          Click to upload screenshot
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                          PNG, JPG up to 5MB
                        </span>
                      </>
                    )}
                  </label>
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshot}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* Email info */}
                <div style={{
                  padding: '12px 16px', borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.06)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  marginBottom: '20px', fontSize: '12px', color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Registration Email:</strong> {user?.email}
                  <br />
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
                    This email will be used for verification.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: 700, gap: '8px',
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Shield size={18} /> Submit for Verification</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP: Submitted */}
        {step === 'submitted' && (
          <div className="animate-fade-in-up" style={{
            maxWidth: '480px', margin: '40px auto', textAlign: 'center',
          }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.15)',
            }}>
              <CheckCircle size={36} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{
              fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)',
              marginBottom: '8px', letterSpacing: '-0.03em',
            }}>Payment Submitted!</h2>
            <p style={{
              fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6,
              marginBottom: '28px', maxWidth: '360px', margin: '0 auto 28px',
            }}>
              Your payment is being verified by our admin team. You'll receive premium access once approved.
              This typically takes a few hours.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
              style={{ padding: '12px 32px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
