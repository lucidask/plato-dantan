import styles from "./TrouverFlag.module.css";

type TrouverFlagProps = {
  position: "top" | "bottom";
};

export default function TrouverFlag({
  position,
}: TrouverFlagProps) {
  return (
    <div
      className={`${styles.flag} ${
        position === "top"
          ? styles.top
          : styles.bottom
      }`}
    >
      ⚑
    </div>
  );
}