import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../public/logo.svg";
import TextCapitulos from "./TextCapitulos";
import Sidebar from "./Sidebar.jsx";
import BreadcrumbsItem from "./BreadCrumbsItem.jsx";
import { Footer } from "./Footer.jsx";
import { Navbar } from "./Navbar.jsx";
import useFetchCollections from "../hooks/useFetchCollections.js";

export const Capitulos = () => {
  const LogoIF = require("../public/ifms-dr-marca-2015.png");
  const LogoEmbrapa = require("../public/logo-embrapa-400.png");
  const router = useRouter();
  const { asPath } = router;
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [data, setData] = useState([]);
  const [activeTitle, setActiveTitle] = useState(null);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [isChapterLoading, setIsChapterLoading] = useState(false);
  const [collectionsData, setCollectionsData] = useState({});
  const { collections, activeCollection, setActiveCollection } =
    useFetchCollections();

  const handleToggleBackDrop = () => {
    setIsOffcanvasOpen((prevState) => !prevState);
  };

  const fetchCapitulosRef = useRef(null);

  useEffect(() => {
    return () => {
      if (fetchCapitulosRef.current) {
        fetchCapitulosRef.current.abort();
      }
    };
  }, []);

  const extractChapterNumberFromAnchor = (path) => {
    const match = path.match(/#capitulo_(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  useEffect(() => {
    const loadCapitulos = async () => {
      if (!currentCollection) return;

      if (collectionsData[currentCollection]) {
        setData(collectionsData[currentCollection]);
        return;
      }

      setIsChapterLoading(true);
      fetchCapitulosRef.current = new AbortController();

      const url = `https://api-cartilha.squareweb.app/api/${currentCollection}?populate=*`;

      try {
        const response = await fetch(url, {
          signal: fetchCapitulosRef.current.signal,
        });
        if (response.ok) {
          const json = await response.json();
          const data = json.data;
          setData(data);

          setCollectionsData((prevData) => ({
            ...prevData,
            [currentCollection]: data,
          }));
        } else {
          throw new Error(
            "Falha na requisição. Código de status: " + response.status
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        setIsChapterLoading(false);
      }
    };

    loadCapitulos();
  }, [currentCollection]);

  useEffect(() => {
    const chapterNumber = extractChapterNumberFromAnchor(asPath);
    if (chapterNumber !== null) {
      setActiveTitle(chapterNumber);
    }
  }, [asPath]);

  useEffect(() => {
    if (activeTitle !== null) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [activeTitle]);

  const handleSelectCollection = (collectionId) => {
    const collectionsMap = {
      1: "pesticida-abelhas",
      2: "boa-pratica-agroes",
      3: "boa-pratica-apicolas",
      4: "boa-pratica-comunicacaos",
    };
    setCurrentCollection(collectionsMap[collectionId]);
    setActiveTitle(null);
    setActiveCollection(collectionId);
  };

  const activeChapter = data.find((item) => item.id === activeTitle);
  const displayedTitle = activeChapter
    ? activeChapter.attributes.titulo
    : "Título do Capítulo";

  return (
    <>
      <Head>
        <meta name="referrer" content="no-referrer" />
        <title>Boas Práticas</title>
      </Head>

      <div className="container-wrapper">
        <Sidebar
          isOffcanvasOpen={isOffcanvasOpen}
          setIsOffcanvasOpen={setIsOffcanvasOpen}
          onSelectCollection={handleSelectCollection}
          activeCollection={activeCollection}
          collections={collections}
        />

        <Navbar
          isOffcanvasOpen={isOffcanvasOpen}
          handleToggleBackDrop={handleToggleBackDrop}
          collections={collections}
          handleSelectCollection={handleSelectCollection}
          Logo={Logo}
          LogoIF={LogoIF}
          LogoEmbrapa={LogoEmbrapa}
        />

        <main className="docMainContainer_gTbr">
          <div className="container padding-bottom--lg">
            <div className="col">
              <nav
                className="home-section"
                aria-label="Breadcrumbs"
                style={{ marginTop: 120 }}
              >
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link href="/home" className="breadcrumbs__link">
                      <i
                        className="fas fa-home"
                        style={{ fontSize: "13px" }}
                      ></i>
                    </Link>
                    <i
                      className="fas fa-chevron-right"
                      style={{ fontSize: "10px" }}
                    ></i>
                  </li>
                  <li className="breadcrumbs__item">
                    <span className="breadcrumbs__link">Sumário</span>
                    <meta itemProp="position" content="1" />
                    <i
                      className="fas fa-chevron-right"
                      style={{ fontSize: "10px" }}
                    ></i>
                  </li>
                  <BreadcrumbsItem displayedTitle={displayedTitle} />
                </ul>
              </nav>
              <section
                className="home-section right-sidebar"
                style={{ marginTop: "30px" }}
              >
                <div id="contents" className="bd-content ps-lg-2">
                  {isChapterLoading ? (
                    <p>Carregando...</p>
                  ) : (
                    <TextCapitulos
                      lista={data}
                      activeTitle={activeTitle}
                      setActiveTitle={setActiveTitle}
                      currentCollection={activeCollection}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Capitulos;
