import { getPlayerLabel } from "../../mappers/playerLabels";
import styles from "./TrouverBanner.module.css";

type TrouverBannerProps = {
  playerId: string;
};

export default function TrouverBanner({ playerId }: TrouverBannerProps) {
  return (
    <div className={styles.banner}>
      <strong>Trouver !</strong>
      <span>{getPlayerLabel(playerId)} a trouvé.</span>
    </div>
  );
}