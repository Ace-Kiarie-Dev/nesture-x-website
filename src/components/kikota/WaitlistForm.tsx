import SharedWaitlistForm, { type WaitlistFormClasses } from '@/components/product-landing/WaitlistForm';

const SUCCESS_MESSAGE = "You're on the list. Check your inbox for a confirmation.";
const DUPLICATE_MESSAGE = "You're already on the list. We'll let you know when Kikota launches.";

const CLASSES: WaitlistFormClasses = {
  form:      'kk-form',
  row:       'kk-form-row',
  inputWrap: 'kk-input-wrap',
  input:     'kk-input',
  button:    'kk-btn kk-btn--primary',
  spinner:   'kk-spinner',
  error:     'kk-form-error',
  note:      'kk-form-note',
  success:   'kk-form-success',
};

interface WaitlistFormProps {
  note?: string;
}

// The shared form appends its own arrow icon, so the label has no "→".
export default function WaitlistForm({ note }: WaitlistFormProps) {
  return (
    <SharedWaitlistForm
      projectSlug="kikota"
      projectName="Kikota"
      buttonLabel="JOIN THE WAITLIST"
      note={note}
      placeholder="Enter your email"
      successMessage={SUCCESS_MESSAGE}
      duplicateMessage={DUPLICATE_MESSAGE}
      classes={CLASSES}
    />
  );
}
