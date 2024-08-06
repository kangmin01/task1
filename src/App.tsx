import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/App.module.css";
import Title from "./components/Title";
import axios from "axios";
import { Item } from "./types";
import ItemBox from "./components/ItemBox";
import { useQuery } from "@tanstack/react-query";
import Pagination from "./components/Pagination";
import { useSearchParams } from "react-router-dom";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [display, setDisplay] = useState<number>(12);

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("sim");
  const [keyword, setKeyword] = useState("티셔츠");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [currentPage, setCurrentPage] = useState(page);
  const [totalItem, setTotalItem] = useState(100);
  const totalPage = Math.ceil(totalItem / display);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    if (width < 1200) {
      setDisplay(12);
    } else if (width >= 1200 && width < 1440) {
      setDisplay(20);
    } else if (width >= 1440 && width < 1900) {
      setDisplay(28);
    } else {
      setDisplay(40);
    }
    window.addEventListener("resize", handleResize);

    if (totalPage < page) {
      setSearchParams({ page: totalPage.toString() });
      setCurrentPage(totalPage);
    }
    return () => window.removeEventListener("resize", handleResize);
  }, [width, page]);

  const { isPending, error, data } = useQuery({
    queryKey: ["imageData", keyword, display, page, filter, sort],
    queryFn: () => fetchImages(keyword, display, page, filter, sort)
  });

  const fetchImages = async (
    query: string,
    display: number,
    start?: number,
    filter?: string,
    sort?: string
  ) => {
    const res = await axios.get("/api/v1/search/image", {
      params: {
        query,
        display,
        start: start ? display * (start - 1) + 1 : 1,
        filter: filter ? filter : "all",
        sort: sort ? sort : "sim"
      },
      headers: {
        "X-Naver-Client-Id": process.env.REACT_APP_NAVER_ID,
        "X-Naver-Client-Secret": process.env.REACT_APP_NAVER_SECRET
      }
    });
    setItems(res.data.items);

    if (res.data.total >= 100) {
      setTotalItem(100);
    } else {
      setTotalItem(res.data.total);
    }
    return res.data.items;
  };

  const handleSearch = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (inputRef.current) {
      setKeyword(inputRef.current.value.toLowerCase());
      fetchImages(inputRef.current.value.toLowerCase(), display);
      setSearchParams({ page: "1" });
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "filter") {
      setFilter(value);
    } else if (name === "sort") {
      setSort(value);
    }
  };

  return (
    <div className={`${styles.App} App`}>
      <Title />

      {/* Search */}
      <section>
        <div>
          <form onSubmit={handleSearch}>
            <select
              name="filter"
              id="filter"
              onChange={handleSelect}
              value={filter}
            >
              <option value="all">모든 이미지 타입</option>
              <option value="large">큰 이미지 타입</option>
              <option value="medium">중간 크기 이미지 타입</option>
              <option value="small">작은 크기 이미지 타입</option>
            </select>

            <select name="sort" id="sort" onChange={handleSelect} value={sort}>
              <option value="accuracy">정확도순</option>
              <option value="date">날짜순</option>
            </select>

            <input
              ref={inputRef}
              type="text"
              placeholder="사진 이름, 이미지 태그, 스타일코드를 입력해주세요."
            />
            <button onClick={handleSearch}>검색</button>
          </form>
        </div>
      </section>

      {/* Grid*/}
      <section className={styles.grid_section}>
        {isPending && <span className={styles.data_text}>Loading...</span>}
        {!isPending && items.length === 0 && (
          <span className={styles.data_text}>존재하는 아이템이 없습니다.</span>
        )}
        {error && <span className={styles.data_text}>새로고침 해주세요.</span>}
        {!isPending && (
          <div className={styles.grid}>
            {items.map((item, index) => (
              <ItemBox item={item} key={index} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination*/}
      {!isPending && items.length !== 0 && totalPage !== 1 && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
          setSearchParams={setSearchParams}
        />
      )}
    </div>
  );
}

export default App;
