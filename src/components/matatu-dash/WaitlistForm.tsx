import SharedWaitlistForm, { type WaitlistFormClasses } from '@/components/product-landing/WaitlistForm';

const SUCCESS_MESSAGE = "You're on the list. Check your inbox for a confirmation.";
const DUPLICATE_MESSAGE = "You're already on the list. We'll let you know when Matatu Dash launches.";

const CLASSES: WaitlistFormClasses = {
  form:      'md-form',
  row:       'md-form-row',
  inputWrap: 'md-input-wrap',
  input:     'md-input',
  button:    'md-btn md-btn--gold',
  spinner:   'md-spinner',
  error:     'md-form-error',
  note:      'md-form-note',
  success:   'md-form-success',
};

interface WaitlistFormProps {
  note?: string;
}

// The shared form appends its own arrow icon, so the label has none.
export default function WaitlistForm({ note }: WaitlistFormProps) {
  return (
    <SharedWaitlistForm
      projectSlug="matatu-dash"
      projectName="Matatu Dash"
      buttonLabel="GET NOTIFIED"
      note={note}
      placeholder="Enter your email"
      successMessage={SUCCESS_MESSAGE}
      duplicateMessage={DUPLICATE_MESSAGE}
      classes={CLASSES}
    />
  );
}
