import drawStyles from "../DrawPile/DrawPile.module.css";

type InitialDeckProps = {
  disabled?: boolean;
  onClick?: () => void;
  label?: string;
};

export default function InitialDeck({
  disabled = false,
  onClick,
  label = "Lever",
}: InitialDeckProps) {
  return (
    <button
      type="button"
      className={drawStyles.drawPile}
      disabled={disabled}
      onClick={onClick}
      title={label}
    >
      <span className={drawStyles.count}>?</span>
    </button>
  );
}