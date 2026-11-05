import { useState } from 'react';
import { Star, Send, MessageSquare, CheckCircle } from 'lucide-react';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [teaching, setTeaching] = useState(0);
  const [content, setContent] = useState(0);
  const [practical, setPractical] = useState(0);
  const [comment, setComment] = useState('');
  const [course, setCourse] = useState('Data Structures');
  const [semester, setSemester] = useState('Semester 5');
  const [submitted, setSubmitted] = useState(false);

  const Rating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          className={star <= value ? 'star selected' : 'star'}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5`}
        >
          <Star size={23} fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!rating || !teaching || !content || !practical || !comment.trim()) {
      alert('Please complete all feedback fields.');
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="feedback-page">
      <div className="welcome-section">
        <div>
          <span className="eyebrow">STUDENT EXPERIENCE</span>
          <h1>Share your perspective.</h1>
          <p>Your feedback helps us create a better learning experience.</p>
        </div>
      </div>

      {submitted ? (
        <div className="success-card">
          <CheckCircle size={50} />
          <h2>Thank you for your feedback!</h2>
          <p>Your response has been recorded in this demo.</p>
          <button
            className="submit-button"
            onClick={() => {
              setSubmitted(false);
              setRating(0);
              setTeaching(0);
              setContent(0);
              setPractical(0);
              setComment('');
            }}
          >
            Submit another response
          </button>
        </div>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <div className="form-icon"><MessageSquare /></div>
            <div>
              <h2>Course feedback form</h2>
              <p>All feedback should be honest and constructive.</p>
            </div>
          </div>

          <div className="form-grid">
            <label>
              Select course
              <select value={course} onChange={e => setCourse(e.target.value)}>
                <option>Data Structures</option>
                <option>Database Management Systems</option>
                <option>Computer Networks</option>
                <option>Artificial Intelligence</option>
                <option>Java Programming</option>
              </select>
            </label>

            <label>
              Academic semester
              <select value={semester} onChange={e => setSemester(e.target.value)}>
                <option>Semester 1</option>
                <option>Semester 2</option>
                <option>Semester 3</option>
                <option>Semester 4</option>
                <option>Semester 5</option>
                <option>Semester 6</option>
                <option>Semester 7</option>
                <option>Semester 8</option>
              </select>
            </label>
          </div>

          <div className="rating-section">
            <h3>Rate your learning experience</h3>
            <p>Choose a rating between 1 and 5 stars.</p>

            <div className="rating-row">
              <div>
                <strong>Teaching quality</strong>
                <span>How clearly are concepts explained?</span>
              </div>
              <Rating value={teaching} onChange={setTeaching} />
            </div>

            <div className="rating-row">
              <div>
                <strong>Course content</strong>
                <span>How relevant is the syllabus?</span>
              </div>
              <Rating value={content} onChange={setContent} />
            </div>

            <div className="rating-row">
              <div>
                <strong>Practical sessions</strong>
                <span>How useful are the lab sessions?</span>
              </div>
              <Rating value={practical} onChange={setPractical} />
            </div>

            <div className="rating-row">
              <div>
                <strong>Overall satisfaction</strong>
                <span>How satisfied are you with this course?</span>
              </div>
              <Rating value={rating} onChange={setRating} />
            </div>
          </div>

          <label className="comment-label">
            Your written feedback
            <textarea
              rows={5}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share what you liked, what can be improved, and your suggestions..."
              required
            />
          </label>

          <div className="anonymous-note">
            <CheckCircle size={17} />
            Your feedback is intended to be anonymous.
          </div>

          <button type="submit" className="submit-button">
            Submit feedback <Send size={17} />
          </button>
        </form>
      )}
    </div>
  );
}
