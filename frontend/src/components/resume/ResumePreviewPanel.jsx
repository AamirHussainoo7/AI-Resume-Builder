/**
 * ResumePreviewPanel — Live resume preview component.
 * Renders resume data in the selected template style.
 */

import { forwardRef } from 'react';

const ResumePreviewPanel = forwardRef(({ resume }, ref) => {
  const template = resume?.template_name || 'modern';

  if (!resume) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <p>Start filling in your resume details to see a preview</p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="resume-preview-container"
      style={{
        background: 'white',
        color: '#1a1a2e',
        fontFamily: template === 'classic'
          ? "'Georgia', 'Times New Roman', serif"
          : "'Helvetica Neue', 'Arial', sans-serif",
        fontSize: template === 'minimal' ? '10px' : '10.5px',
        lineHeight: '1.5',
        width: '210mm',
        minHeight: '297mm',
        padding: template === 'modern' ? '0' : '25mm 20mm',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      {template === 'modern' && <ModernTemplate resume={resume} />}
      {template === 'classic' && <ClassicTemplate resume={resume} />}
      {template === 'minimal' && <MinimalTemplate resume={resume} />}
    </div>
  );
});

ResumePreviewPanel.displayName = 'ResumePreviewPanel';

/* ============================================================================
   MODERN TEMPLATE — Two-column with dark sidebar
   ============================================================================ */
function ModernTemplate({ resume }) {
  return (
    <div style={{ display: 'flex', minHeight: '297mm' }}>
      {/* Sidebar */}
      <div style={{
        width: '35%',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        color: '#e0e0e0',
        padding: '30px 20px',
      }}>
        <h1 style={{ fontSize: '20px', color: '#fff', fontWeight: 700, marginBottom: '4px', lineHeight: 1.2 }}>
          {resume.full_name || 'Your Name'}
        </h1>
        <div style={{ color: '#7c83ff', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>
          Professional Resume
        </div>

        {/* Contact */}
        <SectionTitle sidebar>Contact</SectionTitle>
        {resume.email && <ContactItem>📧 {resume.email}</ContactItem>}
        {resume.phone && <ContactItem>📱 {resume.phone}</ContactItem>}
        {resume.location && <ContactItem>📍 {resume.location}</ContactItem>}
        {resume.linkedin && <ContactItem>🔗 LinkedIn</ContactItem>}
        {resume.website && <ContactItem>🌐 Portfolio</ContactItem>}

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <>
            <SectionTitle sidebar>Skills</SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {resume.skills.map((skill, i) => (
                <span key={i} style={{
                  display: 'inline-block',
                  background: 'rgba(124,131,255,0.15)',
                  color: '#a5aaff',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '8px',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {/* Education */}
        {resume.educations?.length > 0 && (
          <>
            <SectionTitle sidebar>Education</SectionTitle>
            {resume.educations.map((edu, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '9px' }}>{edu.degree}</div>
                {edu.field_of_study && <div style={{ fontSize: '8px', color: '#a5aaff' }}>{edu.field_of_study}</div>}
                <div style={{ fontSize: '8px' }}>{edu.college_name}</div>
                <div style={{ fontSize: '7px', color: '#888' }}>{edu.start_year} — {edu.end_year || 'Present'}</div>
                {edu.cgpa && <div style={{ fontSize: '7px', color: '#888' }}>CGPA: {edu.cgpa}</div>}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ width: '65%', padding: '30px 25px' }}>
        {resume.summary && (
          <>
            <SectionTitleMain>Professional Summary</SectionTitleMain>
            <p style={{ fontSize: '9px', color: '#444', lineHeight: '1.6', marginBottom: '10px' }}>
              {resume.summary}
            </p>
          </>
        )}

        {resume.experiences?.length > 0 && (
          <>
            <SectionTitleMain>Experience</SectionTitleMain>
            {resume.experiences.map((exp, i) => (
              <EntryBlock key={i}>
                <EntryHeader title={exp.role} date={`${exp.start_date || ''} — ${exp.end_date || 'Present'}`} />
                <div style={{ fontSize: '9px', color: '#555', marginTop: '1px' }}>{exp.company_name}</div>
                {exp.description && (
                  <div style={{ fontSize: '8.5px', color: '#555', marginTop: '4px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </div>
                )}
              </EntryBlock>
            ))}
          </>
        )}

        {resume.projects?.length > 0 && (
          <>
            <SectionTitleMain>Projects</SectionTitleMain>
            {resume.projects.map((proj, i) => (
              <EntryBlock key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600, fontSize: '10px', color: '#1a1a2e' }}>{proj.project_name}</span>
                  {proj.github_link && (
                    <span style={{ color: '#7c83ff', fontSize: '7px' }}>GitHub ↗</span>
                  )}
                </div>
                {proj.description && (
                  <div style={{ fontSize: '8.5px', color: '#555', marginTop: '3px', lineHeight: '1.5' }}>
                    {proj.description}
                  </div>
                )}
                {proj.tech_stack?.length > 0 && (
                  <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {proj.tech_stack.map((tech, j) => (
                      <span key={j} style={{
                        background: '#f0f0ff',
                        color: '#5a5fcc',
                        padding: '1px 6px',
                        borderRadius: '3px',
                        fontSize: '7px',
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </EntryBlock>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   CLASSIC TEMPLATE — Single-column, serif
   ============================================================================ */
function ClassicTemplate({ resume }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '15px', paddingBottom: '12px', borderBottom: '2px solid #222' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
          {resume.full_name || 'Your Name'}
        </h1>
        <div style={{ fontSize: '9px', color: '#555' }}>
          {[resume.email, resume.phone, resume.location].filter(Boolean).join(' | ')}
        </div>
      </div>

      {resume.summary && (
        <Section title="Professional Summary">
          <p style={{ fontSize: '9px', color: '#333', fontStyle: 'italic', lineHeight: '1.6' }}>{resume.summary}</p>
        </Section>
      )}

      {resume.experiences?.length > 0 && (
        <Section title="Professional Experience">
          {resume.experiences.map((exp, i) => (
            <EntryBlock key={i}>
              <EntryHeader title={exp.role} date={`${exp.start_date || ''} — ${exp.end_date || 'Present'}`} />
              <div style={{ fontSize: '9px', color: '#444', fontStyle: 'italic' }}>{exp.company_name}</div>
              {exp.description && <div style={{ fontSize: '8.5px', color: '#444', marginTop: '3px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </EntryBlock>
          ))}
        </Section>
      )}

      {resume.educations?.length > 0 && (
        <Section title="Education">
          {resume.educations.map((edu, i) => (
            <EntryBlock key={i}>
              <EntryHeader title={`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}`} date={`${edu.start_year} — ${edu.end_year || 'Present'}`} />
              <div style={{ fontSize: '9px', color: '#444', fontStyle: 'italic' }}>{edu.college_name}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</div>
            </EntryBlock>
          ))}
        </Section>
      )}

      {resume.projects?.length > 0 && (
        <Section title="Projects">
          {resume.projects.map((proj, i) => (
            <EntryBlock key={i}>
              <div style={{ fontWeight: 700, fontSize: '10px', color: '#111' }}>{proj.project_name}</div>
              {proj.description && <div style={{ fontSize: '8.5px', color: '#444', marginTop: '3px', lineHeight: '1.5' }}>{proj.description}</div>}
              {proj.tech_stack?.length > 0 && <div style={{ fontSize: '8px', color: '#666', marginTop: '3px' }}>Technologies: {proj.tech_stack.join(', ')}</div>}
            </EntryBlock>
          ))}
        </Section>
      )}

      {resume.skills?.length > 0 && (
        <Section title="Skills">
          <p style={{ fontSize: '9px', color: '#333' }}>{resume.skills.join(' • ')}</p>
        </Section>
      )}
    </div>
  );
}

/* ============================================================================
   MINIMAL TEMPLATE — Ultra-clean
   ============================================================================ */
function MinimalTemplate({ resume }) {
  return (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#111', letterSpacing: '-0.5px' }}>
          {resume.full_name || 'Your Name'}
        </h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px', fontSize: '8px', color: '#888' }}>
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
          {resume.location && <span>{resume.location}</span>}
        </div>
      </div>

      {resume.summary && (
        <MinimalSection title="About">
          <p style={{ fontSize: '9px', color: '#444', lineHeight: '1.7' }}>{resume.summary}</p>
        </MinimalSection>
      )}

      {resume.experiences?.length > 0 && (
        <MinimalSection title="Experience">
          {resume.experiences.map((exp, i) => (
            <EntryBlock key={i}>
              <EntryHeader title={exp.role} date={`${exp.start_date || ''} — ${exp.end_date || 'Present'}`} />
              <div style={{ fontSize: '8.5px', color: '#777', marginTop: '1px' }}>{exp.company_name}</div>
              {exp.description && <div style={{ fontSize: '8.5px', color: '#555', marginTop: '3px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</div>}
            </EntryBlock>
          ))}
        </MinimalSection>
      )}

      {resume.educations?.length > 0 && (
        <MinimalSection title="Education">
          {resume.educations.map((edu, i) => (
            <EntryBlock key={i}>
              <EntryHeader title={`${edu.degree}${edu.field_of_study ? `, ${edu.field_of_study}` : ''}`} date={`${edu.start_year} — ${edu.end_year || 'Present'}`} />
              <div style={{ fontSize: '8.5px', color: '#777' }}>{edu.college_name}{edu.cgpa ? ` · ${edu.cgpa}` : ''}</div>
            </EntryBlock>
          ))}
        </MinimalSection>
      )}

      {resume.projects?.length > 0 && (
        <MinimalSection title="Projects">
          {resume.projects.map((proj, i) => (
            <EntryBlock key={i}>
              <div style={{ fontWeight: 600, fontSize: '10px', color: '#111' }}>{proj.project_name}</div>
              {proj.description && <div style={{ fontSize: '8.5px', color: '#555', marginTop: '3px', lineHeight: '1.5' }}>{proj.description}</div>}
              {proj.tech_stack?.length > 0 && <div style={{ fontSize: '7.5px', color: '#999', marginTop: '3px' }}>{proj.tech_stack.join(' · ')}</div>}
            </EntryBlock>
          ))}
        </MinimalSection>
      )}

      {resume.skills?.length > 0 && (
        <MinimalSection title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {resume.skills.map((skill, i) => (
              <span key={i} style={{ fontSize: '8px', color: '#555' }}>
                {skill}{i < resume.skills.length - 1 ? ' ·' : ''}
              </span>
            ))}
          </div>
        </MinimalSection>
      )}
    </div>
  );
}

/* ============================================================================
   SHARED SUB-COMPONENTS
   ============================================================================ */
function SectionTitle({ sidebar, children }) {
  if (sidebar) {
    return (
      <div style={{
        color: '#7c83ff',
        fontSize: '8px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        marginTop: '18px',
        marginBottom: '8px',
        paddingBottom: '4px',
        borderBottom: '1px solid rgba(124,131,255,0.3)',
      }}>
        {children}
      </div>
    );
  }
  return null;
}

function SectionTitleMain({ children }) {
  return (
    <div style={{
      fontSize: '11px',
      color: '#1a1a2e',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginTop: '18px',
      marginBottom: '8px',
      paddingBottom: '4px',
      borderBottom: '2px solid #7c83ff',
      fontWeight: 600,
    }}>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#111',
        borderBottom: '1px solid #999',
        paddingBottom: '2px',
        marginBottom: '8px',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function MinimalSection({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        fontSize: '7px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '3px',
        color: '#999',
        marginBottom: '8px',
      }}>
        {title}
      </div>
      {children}
      <div style={{ borderTop: '1px solid #eee', marginTop: '15px' }} />
    </div>
  );
}

function ContactItem({ children }) {
  return <div style={{ fontSize: '8px', marginBottom: '4px', color: '#c0c0c0' }}>{children}</div>;
}

function EntryBlock({ children }) {
  return <div style={{ marginBottom: '12px' }}>{children}</div>;
}

function EntryHeader({ title, date }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontWeight: 600, fontSize: '10px', color: '#1a1a2e' }}>{title}</span>
      <span style={{ fontSize: '8px', color: '#7c83ff', whiteSpace: 'nowrap' }}>{date}</span>
    </div>
  );
}

export default ResumePreviewPanel;
