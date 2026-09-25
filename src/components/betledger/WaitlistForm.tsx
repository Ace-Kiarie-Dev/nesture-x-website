import SharedWaitlistForm, { type WaitlistFormClasses } from '@/components/product-landing/WaitlistForm';

const MESSAGE = "You're on the list. We'll let you know when BetLedger launches.";

const CLASSES: WaitlistFormClasses = {
  form:      'bl-form',
  row:       'bl-form-row',
  inputWrap: 'bl-input-wrap',
  input:     'bl-input',
  button:    'bl-btn bl-btn--primary',
  spinner:   'bl-spinner',
  error:     'bl-form-error',
  note:      'bl-form-note',
  success:   'bl-form-success',
};

interface WaitlistFormProps {
  buttonLabel: string;
  note?: string;
}

export default function WaitlistForm({ buttonLabel, note }: WaitlistFormProps) {
  return (
    <SharedWaitlistForm
      projectSlug="betledger"
      projectName="BetLedger"
      buttonLabel={buttonLabel}
      note={note}
      placeholder="Enter your email address"
      successMessage={MESSAGE}
      duplicateMessage={MESSAGE}
      classes={CLASSES}
    />
  );
}
