import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const COURSES = {
  SOC03141113: {
    title: 'Social History of Bangladesh',
    teacher: 'Nazia Zabin',
    designation: 'Assistant Professor',
  },
  SOC03141111: {
    title: 'Introduction to Sociology',
    teacher: 'Dr Shah Md Atiqul Haq',
    designation: 'Professor',
  },
  SOC03141115: {
    title: 'History of Human Civilization',
    teacher: 'Mohammad Mostufa Kamal',
    designation: 'Professor',
  },
}

const EMPTY_FORM = { name: '', registration: '', courseCode: '', assignmentTitle: '', submissionDate: '' }

function formatDate(value) {
  if (!value) return 'DD/MM/YYYY'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function safeFilename(value) {
  return (value || 'sust-assignment-cover').trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
}

export default function App() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const coverRef = useRef(null)
  const course = COURSES[form.courseCode]

  const update = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setMessage('')
  }

  const downloadPdf = async () => {
    if (Object.values(form).some((value) => !value.trim())) {
      setMessage('Please complete every field before downloading the cover page.')
      return
    }

    try {
      setIsDownloading(true)
      setMessage('Preparing your one-page A4 PDF…')
      const canvas = await html2canvas(coverRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
      })
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297, undefined, 'FAST')
      pdf.save(`${safeFilename(form.name)}-assignment-cover.pdf`)
      setMessage('Your one-page PDF has been downloaded.')
    } catch {
      setMessage('The PDF could not be prepared. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="form-panel" aria-labelledby="app-title">
        <p className="eyebrow">Department of Sociology · SUST</p>
        <h1 id="app-title">Assignment Cover Generator</h1>
        <p className="intro">Complete the details below, check the live A4 preview, then download your cover page as a PDF.</p>

        <div className="form-fields">
          <label>Student name
            <input name="name" value={form.name} onChange={update} placeholder="Enter your full name" autoComplete="name" />
          </label>
          <label>Registration no.
            <input name="registration" value={form.registration} onChange={update} placeholder="Enter registration number" inputMode="numeric" />
          </label>
          <label>Course code
            <select name="courseCode" value={form.courseCode} onChange={update}>
              <option value="">Choose a course</option>
              {Object.keys(COURSES).map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </label>
          {course && <div className="course-note"><strong>{course.title}</strong><span>{course.teacher}, {course.designation}</span></div>}
          <label>Assignment title
            <input name="assignmentTitle" value={form.assignmentTitle} onChange={update} placeholder="Enter assignment title" />
          </label>
          <label>Submission date
            <input name="submissionDate" value={form.submissionDate} onChange={update} type="date" />
          </label>
        </div>
        <button type="button" onClick={downloadPdf} disabled={isDownloading}>{isDownloading ? 'Preparing PDF…' : 'Download PDF'}</button>
        <button type="button" className="clear-button" onClick={() => { setForm(EMPTY_FORM); setMessage('') }} disabled={isDownloading}>Clear form</button>
        <p className={`status ${message.includes('could not') || message.includes('Please') ? 'error' : ''}`} aria-live="polite">{message}</p>
        <footer className="app-credit">Built by ~<strong>Fahim Rahman</strong><span>CR · Department of Sociology (1/1)</span></footer>
      </section>

      <section className="preview-panel" aria-label="Live assignment cover preview">
        <p className="preview-label">Live A4 preview</p>
        <div className="cover-scale">
          <article className="assignment-cover" ref={coverRef}>
            <header className="cover-header">
              <img src="/assets/sust-logo.png" alt="SUST logo" className="sust-logo" />
              <h2>Shahjalal University of Science and Technology, Sylhet</h2>
            </header>

            <section className="assignment-heading">
              <p>An Assignment on</p>
              <h3>{form.assignmentTitle || 'Assignment Title'}</h3>
            </section>

            <section className="course-details">
              <p>Course Title : <span>{course?.title || 'Course Title'}</span></p>
              <p>Course Code: <span>{form.courseCode || 'Course Code'}</span></p>
            </section>

            <div className="submission-area">
              <section className="recipient-info">
                <p className="section-label">Submitted to-</p>
                <p>{course?.teacher || 'Teacher Name'}</p>
                <p>{course?.designation || 'Designation'}</p>
                <p>Department of Sociology,</p>
                <p>SUST, Sylhet</p>
              </section>
              <div className="vertical-divider" aria-hidden="true"><i /><i /><i /></div>
              <section className="student-info">
                <p className="section-label">Submitted By-</p>
                <p>{form.name || 'Student Name'}</p>
                <p>Reg No: {form.registration || 'Registration Number'}</p>
                <p>1<sup>st</sup> Year, 1<sup>st</sup> Semester</p>
                <p>Session: 2025-26</p>
                <p>Department of Sociology</p>
                <p>SUST, Sylhet</p>
              </section>
            </div>

            <footer className="cover-footer">
              <p>Submission Date: {formatDate(form.submissionDate)}</p>
              <small>©fahim.app</small>
            </footer>
          </article>
        </div>
      </section>
    </main>
  )
}
