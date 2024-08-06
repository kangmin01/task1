import { useState } from "react";
import styles from "../styles/Title.module.css";
import Modal from "./Modal";

export default function Title() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.section}>
      <h1 className={styles.title}>소재 라이브러리</h1>
      <button className={styles.button} onClick={() => setIsModalOpen(true)}>
        + 새 이미지 추가
      </button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>모달창</p>
        <button onClick={() => setIsModalOpen(false)}>Close Modal</button>
      </Modal>
    </div>
  );
}
