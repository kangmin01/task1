import styles from "../styles/Pagination.module.css";

type Props = {
  currentPage: number;
  setCurrentPage: (x: number) => void;
  totalPage: number;
  setSearchParams: any;
};

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPage,
  setSearchParams
}: Props) {
  const handlePage = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams({ page: newPage.toString() });
  };

  return (
    <section className={styles.pagination}>
      <button
        className={`${styles.button} ${
          currentPage !== 1 ? styles.pointer : ""
        }`}
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      <ol>
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <li key={page}>
            <button
              onClick={() => handlePage(page)}
              className={`${currentPage === page ? styles.active : ""} ${
                styles.page_button
              }`}
            >
              {page}
            </button>
          </li>
        ))}
      </ol>
      <button
        className={`${styles.button} ${
          currentPage !== totalPage ? styles.pointer : ""
        }`}
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPage}
      >
        &gt;
      </button>
    </section>
  );
}
