/**
 * ResumeBuilder — Multi-section form with live preview and AI features.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Save, Download, Eye, Plus, Trash2, ChevronDown, ChevronUp,
  GripVertical, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import FormInput from '../components/common/FormInput';
import { TextAreaInput } from '../components/common/FormInput';
import AIButton from '../components/ai/AIButton';
import TemplateCard from '../components/resume/TemplateCard';
import ResumePreviewPanel from '../components/resume/ResumePreviewPanel';
import Loader from '../components/common/Loader';
import {
  fetchResumeById, createResume, updateResume,
  setCurrentResume, clearCurrentResume
} from '../redux/resumeSlice';
import aiService from '../services/aiService';
import pdfService from '../services/pdfService';
import { RESUME_TEMPLATES, EMPTY_RESUME, EMPTY_EXPERIENCE, EMPTY_EDUCATION, EMPTY_PROJECT } from '../utils/constants';
import { debounce } from '../utils/helpers';

export default function ResumeBuilder() {
  const { id } = useParams();
  const isEditing = !!id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentResume, isLoading, isSaving } = useSelector((s) => s.resume);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_RESUME });
  const [collapsed, setCollapsed] = useState({});
  const [aiLoading, setAiLoading] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  // Load resume if editing
  useEffect(() => {
    if (isEditing) {
      dispatch(fetchResumeById(id));
    } else {
      dispatch(clearCurrentResume());
      setForm({ ...EMPTY_RESUME });
    }
    return () => dispatch(clearCurrentResume());
  }, [id, isEditing, dispatch]);

  // Sync loaded resume into form
  useEffect(() => {
    if (currentResume && isEditing) {
      setForm({
        title: currentResume.title || '',
        template_name: currentResume.template_name || 'modern',
        full_name: currentResume.full_name || '',
        email: currentResume.email || '',
        phone: currentResume.phone || '',
        location: currentResume.location || '',
        linkedin: currentResume.linkedin || '',
        website: currentResume.website || '',
        summary: currentResume.summary || '',
        skills: currentResume.skills || [],
        experiences: currentResume.experiences || [],
        educations: currentResume.educations || [],
        projects: currentResume.projects || [],
      });
    }
  }, [currentResume, isEditing]);

  // Field updater
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save resume
  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please add a resume title');
      return;
    }
    let res;
    if (isEditing) {
      res = await dispatch(updateResume({ id, data: form }));
      if (updateResume.fulfilled.match(res)) toast.success('Resume saved!');
    } else {
      res = await dispatch(createResume(form));
      if (createResume.fulfilled.match(res)) {
        toast.success('Resume created!');
        navigate(`/resume/edit/${res.payload.id}`, { replace: true });
      }
    }
  };

  // Download PDF (client-side)
  const handleDownload = async () => {
    if (previewRef.current) {
      toast.loading('Generating PDF...', { id: 'pdf' });
      try {
        await pdfService.generateClientPDF(previewRef.current, `${form.title || 'resume'}.pdf`);
        toast.success('PDF downloaded!', { id: 'pdf' });
      } catch {
        toast.error('PDF generation failed', { id: 'pdf' });
      }
    }
  };

  // AI: Improve text
  const handleImproveText = async (field, index, subField) => {
    const key = `${field}-${index}-${subField}`;
    let text = '';
    if (field === 'summary') {
      text = form.summary;
    } else if (field === 'experiences' && subField === 'description') {
      text = form.experiences[index]?.description;
    } else if (field === 'projects' && subField === 'description') {
      text = form.projects[index]?.description;
    }
    if (!text) { toast.error('Add text first'); return; }

    setAiLoading((p) => ({ ...p, [key]: true }));
    try {
      const result = await aiService.improveText(text, field, currentResume?.id);
      if (result.improved) {
        if (field === 'summary') {
          updateField('summary', result.improved);
        } else {
          const arr = [...form[field]];
          arr[index] = { ...arr[index], [subField]: result.improved };
          updateField(field, arr);
        }
        toast.success('Text improved!');
      }
    } catch { toast.error('AI improvement failed'); }
    setAiLoading((p) => ({ ...p, [key]: false }));
  };

  // AI: Generate summary
  const handleGenerateSummary = async () => {
    if (!currentResume?.id) { toast.error('Save your resume first'); return; }
    setAiLoading((p) => ({ ...p, summary: true }));
    try {
      const result = await aiService.generateSummary(currentResume.id);
      if (result.summary) {
        updateField('summary', result.summary);
        toast.success('Summary generated!');
      }
    } catch { toast.error('Failed to generate summary'); }
    setAiLoading((p) => ({ ...p, summary: false }));
  };

  // Skills management
  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      updateField('skills', [...form.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  const removeSkill = (i) => {
    updateField('skills', form.skills.filter((_, idx) => idx !== i));
  };

  // Section helpers
  const addItem = (field, template) => {
    const arr = [...form[field], { ...template, order: form[field].length }];
    updateField(field, arr);
  };
  const removeItem = (field, index) => {
    updateField(field, form[field].filter((_, i) => i !== index));
  };
  const updateItem = (field, index, key, value) => {
    const arr = [...form[field]];
    arr[index] = { ...arr[index], [key]: value };
    updateField(field, arr);
  };
  const toggleCollapse = (key) => {
    setCollapsed((p) => ({ ...p, [key]: !p[key] }));
  };

  // Tech stack input for projects
  const [techInputs, setTechInputs] = useState({});
  const addTech = (index) => {
    const val = (techInputs[index] || '').trim();
    if (val) {
      const arr = [...form.projects];
      arr[index] = { ...arr[index], tech_stack: [...(arr[index].tech_stack || []), val] };
      updateField('projects', arr);
      setTechInputs((p) => ({ ...p, [index]: '' }));
    }
  };
  const removeTech = (pi, ti) => {
    const arr = [...form.projects];
    arr[pi] = { ...arr[pi], tech_stack: arr[pi].tech_stack.filter((_, i) => i !== ti) };
    updateField('projects', arr);
  };

  if (isLoading && isEditing) return <Loader fullPage text="Loading resume..." />;

  return (
    <div className="page-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="content-area">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-secondary)' }}>
          <input value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Resume Title" className="text-lg font-semibold bg-transparent border-none outline-none" style={{ color: 'var(--text-primary)', maxWidth: '300px' }} id="resume-title" />
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)} className="btn btn-ghost text-sm" id="toggle-preview">
              <Eye size={16} /> {showPreview ? 'Editor' : 'Preview'}
            </button>
            <button onClick={handleSave} disabled={isSaving} className="btn btn-primary text-sm" id="save-resume">
              {isSaving ? <div className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} /> : <Save size={16} />}
              Save
            </button>
            <button onClick={handleDownload} className="btn btn-secondary text-sm" id="download-pdf">
              <Download size={16} /> PDF
            </button>
          </div>
        </div>

        <div className="flex" style={{ height: 'calc(100vh - var(--navbar-height) - 52px)' }}>
          {/* Left: Form */}
          <div className={`${showPreview ? 'hidden md:block' : ''} w-full md:w-1/2 overflow-y-auto p-6 space-y-6`} style={{ borderRight: '1px solid var(--border-default)' }}>

            {/* Template Selection */}
            <Section title="Template">
              <div className="grid grid-cols-3 gap-3">
                {RESUME_TEMPLATES.map((t) => (
                  <TemplateCard key={t.id} template={t} isSelected={form.template_name === t.id} onSelect={(id) => updateField('template_name', id)} />
                ))}
              </div>
            </Section>

            {/* Personal Info */}
            <Section title="Personal Information">
              <div className="grid grid-cols-2 gap-4">
                <FormInput label="Full Name" id="full_name" value={form.full_name} onChange={(e) => updateField('full_name', e.target.value)} placeholder="John Doe" />
                <FormInput label="Email" id="resume_email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="john@example.com" />
                <FormInput label="Phone" id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+1 234 567 890" />
                <FormInput label="Location" id="location" value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="New York, NY" />
                <FormInput label="LinkedIn" id="linkedin" value={form.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                <FormInput label="Website" id="website" value={form.website} onChange={(e) => updateField('website', e.target.value)} placeholder="johndoe.com" />
              </div>
            </Section>

            {/* Summary */}
            <Section title="Professional Summary" action={
              <div className="flex gap-2">
                <AIButton size="sm" onClick={handleGenerateSummary} isLoading={aiLoading.summary}>Generate</AIButton>
                <AIButton size="sm" onClick={() => handleImproveText('summary')} isLoading={aiLoading['summary-undefined-undefined']}>Improve</AIButton>
              </div>
            }>
              <TextAreaInput id="summary" value={form.summary} onChange={(e) => updateField('summary', e.target.value)} placeholder="Write a compelling summary..." rows={4} />
            </Section>

            {/* Skills */}
            <Section title="Skills">
              <div className="flex gap-2 mb-3">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="Add a skill..." className="input flex-1" id="skill-input" />
                <button onClick={addSkill} className="btn btn-secondary text-sm"><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill, i) => (
                  <span key={i} className="badge flex items-center gap-1 pr-1">
                    {skill}
                    <button onClick={() => removeSkill(i)} className="ml-1 hover:opacity-70"><X size={12} /></button>
                  </span>
                ))}
              </div>
            </Section>

            {/* Experience */}
            <Section title="Experience" action={
              <button onClick={() => addItem('experiences', EMPTY_EXPERIENCE)} className="btn btn-ghost text-xs"><Plus size={14} /> Add</button>
            }>
              {form.experiences.map((exp, i) => (
                <div key={i} className="card p-4 mb-3">
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleCollapse(`exp-${i}`)}>
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} style={{ color: 'var(--text-tertiary)' }} />
                      <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{exp.role || exp.company_name || `Experience ${i + 1}`}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AIButton size="sm" onClick={(e) => { e.stopPropagation(); handleImproveText('experiences', i, 'description'); }} isLoading={aiLoading[`experiences-${i}-description`]}>Improve</AIButton>
                      <button onClick={(e) => { e.stopPropagation(); removeItem('experiences', i); }} className="btn-ghost p-1 rounded" style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                      {collapsed[`exp-${i}`] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                  </div>
                  {!collapsed[`exp-${i}`] && (
                    <div className="space-y-1">
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Company" id={`company-${i}`} value={exp.company_name} onChange={(e) => updateItem('experiences', i, 'company_name', e.target.value)} placeholder="Google" />
                        <FormInput label="Role" id={`role-${i}`} value={exp.role} onChange={(e) => updateItem('experiences', i, 'role', e.target.value)} placeholder="Software Engineer" />
                        <FormInput label="Start Date" id={`start-${i}`} type="date" value={exp.start_date} onChange={(e) => updateItem('experiences', i, 'start_date', e.target.value)} />
                        <FormInput label="End Date" id={`end-${i}`} type="date" value={exp.end_date} onChange={(e) => updateItem('experiences', i, 'end_date', e.target.value)} disabled={exp.is_current} />
                      </div>
                      <label className="flex items-center gap-2 text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={exp.is_current} onChange={(e) => updateItem('experiences', i, 'is_current', e.target.checked)} /> Currently working here
                      </label>
                      <TextAreaInput label="Description" id={`desc-${i}`} value={exp.description} onChange={(e) => updateItem('experiences', i, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." rows={3} />
                    </div>
                  )}
                </div>
              ))}
            </Section>

            {/* Education */}
            <Section title="Education" action={
              <button onClick={() => addItem('educations', EMPTY_EDUCATION)} className="btn btn-ghost text-xs"><Plus size={14} /> Add</button>
            }>
              {form.educations.map((edu, i) => (
                <div key={i} className="card p-4 mb-3">
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleCollapse(`edu-${i}`)}>
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{edu.degree || `Education ${i + 1}`}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); removeItem('educations', i); }} className="btn-ghost p-1 rounded" style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                      {collapsed[`edu-${i}`] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                  </div>
                  {!collapsed[`edu-${i}`] && (
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Institution" id={`college-${i}`} value={edu.college_name} onChange={(e) => updateItem('educations', i, 'college_name', e.target.value)} placeholder="MIT" />
                      <FormInput label="Degree" id={`degree-${i}`} value={edu.degree} onChange={(e) => updateItem('educations', i, 'degree', e.target.value)} placeholder="B.Tech" />
                      <FormInput label="Field of Study" id={`field-${i}`} value={edu.field_of_study} onChange={(e) => updateItem('educations', i, 'field_of_study', e.target.value)} placeholder="Computer Science" />
                      <FormInput label="CGPA" id={`cgpa-${i}`} value={edu.cgpa} onChange={(e) => updateItem('educations', i, 'cgpa', e.target.value)} placeholder="9.0" />
                      <FormInput label="Start Year" id={`sy-${i}`} value={edu.start_year} onChange={(e) => updateItem('educations', i, 'start_year', e.target.value)} placeholder="2020" />
                      <FormInput label="End Year" id={`ey-${i}`} value={edu.end_year} onChange={(e) => updateItem('educations', i, 'end_year', e.target.value)} placeholder="2024" />
                    </div>
                  )}
                </div>
              ))}
            </Section>

            {/* Projects */}
            <Section title="Projects" action={
              <button onClick={() => addItem('projects', EMPTY_PROJECT)} className="btn btn-ghost text-xs"><Plus size={14} /> Add</button>
            }>
              {form.projects.map((proj, i) => (
                <div key={i} className="card p-4 mb-3">
                  <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleCollapse(`proj-${i}`)}>
                    <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{proj.project_name || `Project ${i + 1}`}</span>
                    <div className="flex items-center gap-1">
                      <AIButton size="sm" onClick={(e) => { e.stopPropagation(); handleImproveText('projects', i, 'description'); }} isLoading={aiLoading[`projects-${i}-description`]}>Improve</AIButton>
                      <button onClick={(e) => { e.stopPropagation(); removeItem('projects', i); }} className="btn-ghost p-1 rounded" style={{ color: 'var(--error)' }}><Trash2 size={14} /></button>
                      {collapsed[`proj-${i}`] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </div>
                  </div>
                  {!collapsed[`proj-${i}`] && (
                    <div className="space-y-1">
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Project Name" id={`pname-${i}`} value={proj.project_name} onChange={(e) => updateItem('projects', i, 'project_name', e.target.value)} placeholder="My Project" />
                        <FormInput label="GitHub" id={`github-${i}`} value={proj.github_link} onChange={(e) => updateItem('projects', i, 'github_link', e.target.value)} placeholder="https://github.com/..." />
                      </div>
                      <TextAreaInput label="Description" id={`pdesc-${i}`} value={proj.description} onChange={(e) => updateItem('projects', i, 'description', e.target.value)} placeholder="Describe the project..." rows={3} />
                      <div>
                        <label className="label">Tech Stack</label>
                        <div className="flex gap-2 mb-2">
                          <input value={techInputs[i] || ''} onChange={(e) => setTechInputs((p) => ({ ...p, [i]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech(i))} placeholder="React, Node.js..." className="input flex-1" />
                          <button onClick={() => addTech(i)} className="btn btn-secondary text-sm"><Plus size={14} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(proj.tech_stack || []).map((tech, j) => (
                            <span key={j} className="badge flex items-center gap-1 pr-1">{tech}<button onClick={() => removeTech(i, j)}><X size={12} /></button></span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Section>

          </div>

          {/* Right: Preview */}
          <div className={`${showPreview ? '' : 'hidden md:block'} w-full md:w-1/2 overflow-y-auto p-6`} style={{ background: 'var(--bg-tertiary)' }}>
            <div style={{ transform: 'scale(0.55)', transformOrigin: 'top center' }}>
              <ResumePreviewPanel ref={previewRef} resume={form} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Collapsible form section */
function Section({ title, action, children }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
