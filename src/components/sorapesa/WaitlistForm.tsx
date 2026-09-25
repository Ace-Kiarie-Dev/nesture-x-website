import SharedWaitlistForm, { type WaitlistFormClasses } from '@/components/product-landing/WaitlistForm';

const BASE: Omit<WaitlistFormClasses, 'form' | 'button'> = {
  row:       'sp-form-row',
  inputWrap: 'sp-input-wrap',
  input:     'sp-input',
  spinner:   'sp-spinner',
  error:     'sp-form-error',
  note:      'sp-form-note',
  success:   'sp-form-success',
};

const VARIANTS: Record<'default' | 'onGradient', WaitlistFormClasses> = {
  default:    { ...BASE, form: 'sp-form',                         button: 'sp-btn sp-btn--gradient' },
  onGradient: { ...BASE, form: 'sp-form sp-form--on-gradient',    button: 'sp-btn sp-btn--white'    },
};

interface WaitlistFormProps {
  buttonLabel: string;
  note?: string;
  variant?: keyof typeof VARIANTS;
}

export default function WaitlistForm({ buttonLabel, note, variant = 'default' }: WaitlistFormProps) {
  return (
    <SharedWaitlistForm
      projectSlug="sorapesa"
      projectName="SoraPesa"
      buttonLabel={buttonLabel}
      note={note}
      placeholder="Enter your email"
      successMessage="You're on the list. Check your inbox for a confirmation."
      duplicateMessage="You're already on the list. We'll let you know when SoraPesa launches."
      classes={VARIANTS[variant]}
    />
  );
}
