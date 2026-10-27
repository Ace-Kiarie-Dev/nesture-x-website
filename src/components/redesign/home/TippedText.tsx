// Letters statically tipped as if they had fallen, like the hub's START. This is the
// spot a GravityText effect would take over; until then it is purely visual, so the
// letters are aria-hidden and the heading carries the real text in its aria-label.
// tips[i] = [translateY em, rotate deg]; letters past the list stay upright.
export default function TippedText({ text, tips }: { text: string; tips: [number, number][] }) {
  return (
    <span className="nxhp-tipped" aria-hidden="true">
      {text.split('').map((ch, i) => {
        const [y, r] = tips[i] ?? [0, 0];
        return (
          <span key={i} style={y || r ? { transform: `translateY(${y}em) rotate(${r}deg)` } : undefined}>
            {ch === ' ' ? ' ' : ch}
          </span>
        );
      })}
    </span>
  );
}
