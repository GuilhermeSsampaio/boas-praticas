import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ChapterSearch from "./ChapterSearch";
import { useState } from "react";
const Sidebar = ({
  isOffcanvasOpen,
  setIsOffcanvasOpen,
  onSelectCollection,
  activeCollection,
  collections,
}) => {
  const router = useRouter();
  const [activeChapter, setActiveChapter] = useState(null);
  const [showSummary, setShowSummary] = useState(true);
  var LogoIFEmbrapa = require("../public/logo-if-embrapa.png");

  const handleToggle = useCallback(
    (collectionId) => {
      onSelectCollection(collectionId);
      setActiveChapter(null);
    },
    [onSelectCollection]
  );

  const handleChapterClick = useCallback(
    (collectionId, chapterId) => {
      onSelectCollection(collectionId);
      setActiveChapter(chapterId);
      router.push(
        `#collection_${collectionId}#capitulo_${chapterId}`,
        undefined,
        { shallow: true }
      );
      setIsOffcanvasOpen(false);
    },
    [onSelectCollection, router, setIsOffcanvasOpen]
  );

  const sortedCollections = useMemo(() => {
    return collections.map((collection) => ({
      ...collection,
      data: {
        ...collection.data,
        data: collection.data.data.sort((a, b) => a.id - b.id),
      },
    }));
  }, [collections]);

  return (
    <div>
      <nav
        id="sidebarMenu"
        className={`collapse d-lg-block sidebar bg-white thin-scrollbar ${
          isOffcanvasOpen ? "show" : ""
        }`}
        tabIndex="-1"
      >
        <div className="position-sticky">
          <div></div>
          <div
            id="summary"
            className="list-group list-group-flush mt-2 py-2 menu_SIkG"
            style={{ display: showSummary ? "block" : "none" }}
          >
            <div className="logo-container-fixed">
              <div className="logo-container d-flex align-items-center justify-content-between">
                <Link href="/home">
                  <Image
                    className="img-sidebar-top mx-3"
                    src={LogoIFEmbrapa}
                    alt="logo Embrapa com letras em azul com um símbolo verde, sendo que as letras em cima do símbolo são brancas"
                    width="45%"
                    height={46}
                    priority
                  />
                </Link>
                <button
                  id="btn-close-sidebar"
                  type="button"
                  className="btn-close btn-close-dark btn-close-cap"
                  aria-label="Close"
                  onClick={() => {
                    setIsOffcanvasOpen(false);
                    setShowSummary(true);
                  }}
                ></button>
              </div>
            </div>
            <hr className="featurette-divider line-menu"></hr>

            <div>
              <div className="mt-1" style={{ marginBottom: "8px" }}>
                <a
                  className="d-flex align-items-center"
                  style={{
                    padding: "0.4rem 1rem",
                    backgroundColor: "#0000000d",
                    fontWeight: "500",
                  }}
                >
                  Introdução
                </a>
              </div>
              {sortedCollections.map((collection) => (
                <div key={collection.id}>
                  <p
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center dropdown-background ${
                      activeCollection === collection.id ? "" : "collapsed"
                    }`}
                    onClick={() => handleToggle(collection.id)}
                    style={{ cursor: "pointer", marginBottom: "10px" }}
                  >
                    <span
                      className="w-100 text-primary"
                      style={{ fontWeight: "500" }}
                    >
                      {collection.title}
                    </span>{" "}
                    <i
                      className={`fas fa-chevron-${
                        activeCollection === collection.id ? "down" : "right"
                      } 
                                            ${
                                              activeCollection === collection.id
                                                ? "icon-deg-active"
                                                : "icon-deg-right"
                                            }`}
                    ></i>
                  </p>
                  {activeCollection === collection.id && (
                    <ul className="list-group list-group-flush mx-1">
                      {collection.data.data.map((item) => (
                        <li
                          key={item.id}
                          className={`list-group-item py-2 ${
                            item.attributes.subnivel &&
                            item.attributes.subnivel.length > 0
                              ? "chapter-with-subchapters"
                              : ""
                          }`}
                          style={{
                            cursor: "pointer",
                            marginBottom: "8px",
                            fontSize: "15px",
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <a
                              href={`#collection_${collection.id}#capitulo_${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleChapterClick(collection.id, item.id);
                              }}
                              className="d-flex align-items-center"
                              style={{
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              {item.attributes.titulo}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default React.memo(Sidebar);
