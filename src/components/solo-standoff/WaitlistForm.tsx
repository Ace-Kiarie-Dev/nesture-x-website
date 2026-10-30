import SharedWaitlistForm, { type WaitlistFormClasses } from '@/components/product-landing/WaitlistForm';

const SUCCESS_MESSAGE = "You're on the list. Check your inbox for a confirmation.";
const DUPLICATE_MESSAGE = "You're already on the list. We'll let you know when Solo Standoff launches.";

const CLASSES: WaitlistFormClasses = {
  form:      'ss-form',
  row:       'ss-form-row',
  inputWrap: 'ss-input-wrap',
  input:     'ss-input',
  button:    'ss-btn ss-btn--amber',
  spinner:   'ss-spinner',
  error:     'ss-form-error',
  note:      'ss-form-note',
  success:   'ss-form-success',
};

interface WaitlistFormProps {
  note?: string;
}

// The shared form appends its own arrow icon, so the label has none.
export default function WaitlistForm({ note }: WaitlistFormProps) {
  return (
    <SharedWaitlistForm
      projectSlug="solo-standoff"
      projectName="Solo Standoff"
      buttonLabel="GET NOTIFIED"
      note={note}
      placeholder="Enter your email"
      successMessage={SUCCESS_MESSAGE}
      duplicateMessage={DUPLICATE_MESSAGE}
      classes={CLASSES}
    />
  );
}
