import React from "react";
import roomImg from "../assets/minimalist_room.png";

export default function RoomCanvas({ 
  products, 
  highlightedId, 
  onSelectProduct,
  roomImage,
  isTransitioning,
  onPrevPage,
  onNextPage
}) {

  const handleAreaClick = (product, e) => {
    e.stopPropagation();
    if (product.url) {
      window.open(product.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="room-viewport-container">
      <div className={`room-canvas-wrapper ${isTransitioning ? "transitioning" : ""}`}>
        {/* Navigation Arrows */}
        {onPrevPage && (
          <button 
            className="canvas-nav-arrow prev" 
            onClick={(e) => { e.stopPropagation(); onPrevPage(); }} 
            title="หน้าก่อนหน้า"
          >
            ‹
          </button>
        )}
        {onNextPage && (
          <button 
            className="canvas-nav-arrow next" 
            onClick={(e) => { e.stopPropagation(); onNextPage(); }} 
            title="หน้าถัดไป"
          >
            ›
          </button>
        )}

        {/* Room Background Image */}
        <img
          src={roomImage || roomImg}
          alt="Minimalist Room"
          className="room-bg-image"
          draggable="false"
        />

        {/* Hotspots pulsing pin (dot) layer */}
        {products.map((product) => {
          const isHighlighted = highlightedId === product.id;

          return (
            <div
              key={product.id}
              className={`product-hotspot-area ${isHighlighted ? "active-highlight" : ""}`}
              style={{
                left: `${product.x}%`,
                top: `${product.y}%`,
              }}
              onClick={(e) => handleAreaClick(product, e)}
              title={product.name}
            >
              {/* Pulsing Pin Dot */}
              <div className="ikea-pin">
                <div className="ikea-pin-inner"></div>
              </div>

              {/* Tooltip Card (Desktop Hover handled purely via CSS :hover) */}
              <div className="hotspot-tooltip simplified">
                <h4 className="hotspot-tooltip-title">{product.name}</h4>
                <div className="hotspot-tooltip-price">{product.price}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
