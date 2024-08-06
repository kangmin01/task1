import { Item } from "../types";
import styles from "../styles/ItemBox.module.css";

type Props = {
  item: Item;
};

export default function ItemBox({ item }: Props) {
  const { title, thumbnail } = item;

  return (
    <div>
      <img src={thumbnail} alt={title} className={styles.img} />
    </div>
  );
}
