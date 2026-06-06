import React, { useState, useEffect } from "react";
import { defaultProducts } from "./data/defaultProducts";
import RoomCanvas from "./components/RoomCanvas";
import AdminPanel from "./components/AdminPanel";

import roomImg from "./assets/minimalist_room.png";
import bedroomImg from "./assets/minimalist_bedroom.png";
import kitchenImg from "./assets/minimalist_kitchen.png";

// Import Baan Lae Suan detail assets
import rusticLivingRoom from "./assets/rustic_living_room.png";
import japandiDining from "./assets/japandi_dining.png";
import botanicalBathroom from "./assets/botanical_bathroom.png";
import bohemianTerrace from "./assets/bohemian_terrace.png";
import gardenGreenhouse from "./assets/garden_greenhouse.png";
import industrialStudy from "./assets/industrial_study.png";
import readingNook from "./assets/reading_nook.png";
import countryKitchen from "./assets/country_kitchen.png";
import tropicalBedroom from "./assets/tropical_bedroom.png";
import zenCorner from "./assets/zen_corner.png";

const getLocationLabel = (canvasType) => {
  if (!canvasType || canvasType === "main") return "ภาพห้องหลัก";
  if (canvasType === "collage-1") return "รูปมุมย่อย 1";
  if (canvasType === "collage-2") return "รูปมุมย่อย 2";
  if (canvasType === "collage-3") return "รูปมุมย่อย 3";
  if (canvasType === "collage-4") return "รูปมุมย่อย 4";
  if (canvasType === "collage-5") return "รูปมุมย่อย 5";
  return "รูปมุมย่อย";
};

const defaultRooms = [
  { 
    id: "living-room", 
    name: "HOME OFFICE", 
    image: roomImg,
    styleTitle: "Japandi Workspace (พื้นที่ทำงานกลิ่นอายแจแปนดี้)",
    description: "การผสมผสานระหว่างความเงียบสงบอบอุ่นแบบญี่ปุ่น (Wabi-Sabi) และความเรียบง่ายใช้งานได้จริงสไตล์สแกนดิเนเวียน (Hygge) เน้นเฟอร์นิเจอร์ไม้โทนอุ่นและพื้นที่เปิดโล่งเพื่อสร้างสมาธิในการทำงานที่ดีที่สุด",
    details: {
      concept: "Japandi Style",
      colors: [
        { name: "Cream Silk (ครีมทราย)", hex: "#FAF6F0" },
        { name: "Soft Sky (ฟ้านวล)", hex: "#E0F2FE" },
        { name: "Warm Oak (โอ๊คอบอุ่น)", hex: "#D97706" }
      ],
      features: [
        "เฟอร์นิเจอร์โครงสร้างไม้แท้ ขอบโค้งมนเพื่อความรู้สึกละมุนตา",
        "จัดวางสิ่งของน้อยชิ้นแต่ฟังก์ชันครบครัน (Minimal & Functional)",
        "เพิ่มพื้นที่สีเขียวด้วยพืชใบใหญ่เพื่อช่วยกรองสายตาและผ่อนคลาย"
      ],
      tips: "ลองจับคู่โคมไฟทำงานสีดำด้านเข้ากับโต๊ะไม้ธรรมชาติ จะช่วยสร้างจุดโฟกัสที่โดดเด่นตัดกันได้อย่างลงตัวโดยไม่ทำลายโทนความอบอุ่นของห้อง"
    }
  },
  { 
    id: "bedroom", 
    name: "MINIMAL BEDROOM", 
    image: bedroomImg,
    styleTitle: "Warm Minimalist Cozy (ห้องนอนมินิมอลอบอุ่น)",
    description: "ห้องนอนที่เน้นการตัดทอนสิ่งรบกวนสายตาออกไปให้หมด คงเหลือไว้เพียงองค์ประกอบที่จำเป็นเพื่อสร้างความรู้สึกปลอดภัย เงียบสงบ และช่วยให้ร่างกายได้เข้าสู่สภาวะพักผ่อนอย่างแท้จริง",
    details: {
      concept: "Warm Minimalism",
      colors: [
        { name: "Linen Beige (เบจผ้าลินิน)", hex: "#F3EFE0" },
        { name: "Soft Sand (ทรายนุ่ม)", hex: "#E7E3D4" },
        { name: "Charcoal Slate (เทาชาร์โคล)", hex: "#334155" }
      ],
      features: [
        "โครงเตียงไม้แบบเตี้ยใกล้ชิดพื้น (Low-profile) เพื่อความรู้สึกผ่อนคลายและห้องดูเพดานสูงขึ้น",
        "ชุดเครื่องนอนวัสดุเส้นใยธรรมชาติ เช่น ลินินออร์แกนิก ยิ่งยับยิ่งได้สัมผัสที่ดูสบายเป็นกันเอง",
        "เน้นการกระจายแสงอ้อม (Soft Light) จากโคมไฟกระดาษทดแทนแสงไฟตรงจากเพดาน"
      ],
      tips: "หลีกเลี่ยงแสงไฟประเภท Daylight ในห้องนอนอย่างสิ้นเชิง ลองเลือกติดตั้งไฟ Warm Light ซ่อนไว้ตามหลังหัวเตียงหรือใต้โต๊ะข้างเพื่อสร้างบรรยากาศฟุ้งชวนนอนหลับ"
    }
  },
  { 
    id: "kitchen", 
    name: "SCANDINAVIAN KITCHEN", 
    image: kitchenImg,
    styleTitle: "Scandinavian Bright Kitchen (ห้องครัวนอร์ดิกสว่างไสว)",
    description: "ห้องครัวสไตล์นอร์ดิกที่เน้นความสว่างไสวเป็นหลัก การเปิดรับแสงธรรมชาติ การจัดวางเครื่องใช้ให้หยิบจับง่าย สะดวกสบาย และสร้างบรรยากาศอบอุ่นเป็นศูนย์รวมใจของครอบครัว",
    details: {
      concept: "Scandinavian Design",
      colors: [
        { name: "Bright Light (ขาวสว่าง)", hex: "#FFFFFF" },
        { name: "Honey Oak (โอ๊คน้ำผึ้ง)", hex: "#CA8A04" },
        { name: "Brass Accent (ทองเหลืองวาว)", hex: "#EAB308" }
      ],
      features: [
        "เน้นการเปิดช่องแสงธรรมชาติและการตกแต่งโทนสีขาวเพื่อให้ห้องครัวดูกว้างขวางสะอาดตา",
        "เคาน์เตอร์เกาะกลางอเนกประสงค์ (Island) ที่รวมทั้งพื้นที่จัดเตรียมอาหารและที่นั่งพูดคุย",
        "โคมไฟเพดานทรงกรวยคู่ผิวทองเหลืองเพิ่มสัมผัสหรูหราคลาสสิกให้กับพื้นที่เตรียมอาหาร"
      ],
      tips: "ครัวสไตล์นี้เหมาะกับการโชว์เครื่องครัวสวยๆ เช่น กาน้ำชาเซรามิกคราฟต์หรือเขียงไม้ แนะนำให้วางเฉพาะชิ้นโปรดบนเคาน์เตอร์ และเก็บชิ้นที่เหลือเข้าลิ้นชักเพื่อรักษาความคลีน"
    }
  }
];

const defaultCollages = {
  "living-room": {
    img1: rusticLivingRoom,
    img2: industrialStudy,
    img3: readingNook,
    img4: japandiDining,
    img5: botanicalBathroom,
    title: "มุมรายละเอียดสไตล์ Japandi",
    description: "สัมผัสความอบอุ่นของงานไม้ธรรมชาติผสมผสานกับวัสดุธรรมชาติ ผิวสัมผัสเนื้อแมตต์ และแสงธรรมชาติที่ลอดผ่านหน้าต่าง ช่วยเพิ่มพลังสร้างสรรค์ในมุมทำงานอย่างลงตัว"
  },
  "bedroom": {
    img1: tropicalBedroom,
    img2: zenCorner,
    img3: botanicalBathroom,
    img4: bohemianTerrace,
    img5: gardenGreenhouse,
    title: "รายละเอียดการพักผ่อนอย่างเงียบสงบ",
    description: "การเลือกใช้พรรณไม้สีเขียวขจีในกระถางดินเผา ผสมผสานกับผ้าลินินเนื้อละเอียดสีเอิร์ธโทน และการจัดวางเฟอร์นิเจอร์แบบ Low-profile เพื่อเปิดรับลมธรรมชาติได้อย่างอิสระ"
  },
  "kitchen": {
    img1: countryKitchen,
    img2: gardenGreenhouse,
    img3: japandiDining,
    img4: rusticLivingRoom,
    img5: readingNook,
    title: "ความงดงาม of แสงแดดและงานครัวนอร์ดิก",
    description: "เน้นการโชว์รายละเอียดของเครื่องแก้วใส อุปกรณ์ทำครัวผิวทองเหลืองตอกมือ และพืชสมุนไพรในร่มที่วางรับแดดริมหน้าต่าง ให้บรรยากาศเสมือนคาเฟ่สไตล์ยุโรปตอนเหนือ"
  }
};

function EditorialCollage({ collage, products = [], highlightedId, onSelectProduct }) {

  const handleAreaClick = (product, e) => {
    e.stopPropagation();
    if (product.url) {
      window.open(product.url, "_blank", "noopener,noreferrer");
    }
  };

  const renderHotspots = (canvasType) => {
    const slotProducts = products.filter(p => p.canvasType === canvasType);
    return slotProducts.map((product) => {
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

          <div className="hotspot-tooltip simplified">
            <h4 className="hotspot-tooltip-title">{product.name}</h4>
            <div className="hotspot-tooltip-price">{product.price}</div>
          </div>
        </div>
      );
    });
  };

  const hasCol1 = !!(collage.img1 || collage.img2);
  const hasCol2 = !!collage.img3;
  const hasCol3 = !!(collage.img4 || collage.img5);

  // If no collage images are uploaded at all, we don't render the section
  if (!hasCol1 && !hasCol2 && !hasCol3) return null;

  // Build grid columns dynamically based on active columns
  let gridCols = [];
  if (hasCol1) gridCols.push("1fr");
  if (hasCol2) gridCols.push("1.2fr");
  if (hasCol3) gridCols.push("1fr");

  const gridStyle = {
    gridTemplateColumns: gridCols.join(" "),
  };

  return (
    <div className="editorial-collage-container animate-fade-in">
      <div className="collage-section-header">
        <span className="collage-subtitle">COLLEGE GALLERY</span>
        <h3 className="collage-title">มุมสะท้อนรายละเอียดการจัดบ้าน</h3>
      </div>
      <div className="editorial-collage-grid" style={gridStyle}>
        {/* Left Column (Slots 1 & 2) */}
        {hasCol1 && (
          <div className="collage-col-side">
            {collage.img1 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img1} alt="Detail image 1" className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-1")}
              </div>
            )}
            {collage.img2 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img2} alt="Detail image 2" className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-2")}
              </div>
            )}
          </div>
        )}

        {/* Center Column (Slot 3 - Tall) */}
        {hasCol2 && (
          <div className="collage-col-center">
            <div className="collage-slot tall-slot">
              <div className="collage-img-wrapper">
                <img src={collage.img3} alt="Detail image 3" className="collage-img" loading="lazy" />
              </div>
              {renderHotspots("collage-3")}
            </div>
          </div>
        )}

        {/* Right Column (Slots 4 & 5) */}
        {hasCol3 && (
          <div className="collage-col-side">
            {collage.img4 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img4} alt="Detail image 4" className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-4")}
              </div>
            )}
            {collage.img5 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img5} alt="Detail image 5" className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-5")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // Navigation active view: 'shop' or 'admin'
  const [activeView, setActiveView] = useState("shop");

  // Load rooms from localStorage or use defaults
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem("minimal_room_list_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading rooms from localStorage", e);
      }
    }
    return defaultRooms;
  });

  const handleUpdateRooms = (newRoomsList) => {
    setRooms(newRoomsList);
    localStorage.setItem("minimal_room_list_v1", JSON.stringify(newRoomsList));
  };

  // Collage state per room
  const [roomCollages, setRoomCollages] = useState(() => {
    const saved = localStorage.getItem("minimal_room_collages_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading collages", e);
      }
    }
    return defaultCollages;
  });

  const updateRoomCollage = (roomId, updatedCollage) => {
    const newCollages = { ...roomCollages };
    if (updatedCollage === null) {
      delete newCollages[roomId];
    } else {
      newCollages[roomId] = updatedCollage;
    }
    setRoomCollages(newCollages);
    localStorage.setItem("minimal_room_collages_v1", JSON.stringify(newCollages));
  };
  
  // Load products from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("minimal_room_products_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Inject image if missing for default products
        let updated = false;
        const migrated = parsed.map(p => {
          if (!p.image) {
            const defMatch = defaultProducts.find(dp => dp.name === p.name);
            if (defMatch && defMatch.image) {
              updated = true;
              return { ...p, image: defMatch.image };
            }
          }
          return p;
        });
        if (updated) {
          localStorage.setItem("minimal_room_products_v2", JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        console.error("Error loading products from localStorage, using defaults", e);
      }
    }
    // Save defaults to localStorage initially
    localStorage.setItem("minimal_room_products_v2", JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  // Highlighted hotspot ID (when locating from card list)
  const [highlightedId, setHighlightedId] = useState(null);

  // Preload all room and collage images on mount and when they change
  useEffect(() => {
    rooms.forEach((room) => {
      if (room.image) {
        const img = new Image();
        img.src = room.image;
      }
    });

    Object.values(roomCollages).forEach((collage) => {
      ["img1", "img2", "img3", "img4", "img5"].forEach((key) => {
        if (collage[key]) {
          const img = new Image();
          img.src = collage[key];
        }
      });
    });
  }, [rooms, roomCollages]);

  // Magazine Room Gallery States
  const [currentRoomId, setCurrentRoomId] = useState(() => {
    const saved = localStorage.getItem("minimal_room_list_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return parsed[0].id;
        }
      } catch (e) {
        console.error("Error loading rooms for currentRoomId", e);
      }
    }
    return "living-room";
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [currentRoomId]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset slideshow index when room changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentRoomId]);

  // Filter products for the active room page
  const activeRoomProducts = products.filter(
    (p) => p.roomId === currentRoomId || (!p.roomId && currentRoomId === "living-room")
  );

  // Active room metadata helper
  const currentRoom = rooms.find((r) => r.id === currentRoomId) || rooms[0];

  // Build slideshow collection (main image + available collage images)
  const collage = roomCollages[currentRoomId] || {};
  const slideshowImages = [];
  if (currentRoom.image) {
    slideshowImages.push({
      url: currentRoom.image,
      canvasType: "main"
    });
  }
  ["img1", "img2", "img3", "img4", "img5"].forEach((key, index) => {
    if (collage[key]) {
      slideshowImages.push({
        url: collage[key],
        canvasType: `collage-${index + 1}`
      });
    }
  });

  const handlePrevImage = () => {
    if (slideshowImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);
  };

  const handleNextImage = () => {
    if (slideshowImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length);
  };
  
  // Selected product for mobile detail modal drawer
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Active toast notifications list
  const [toasts, setToasts] = useState([]);

  // Auto-remove highlighted pin after a delay
  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        setHighlightedId(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  // Toast helper function
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Save changes to products list
  const updateProducts = (newProductsList) => {
    setProducts(newProductsList);
    localStorage.setItem("minimal_room_products_v2", JSON.stringify(newProductsList));
  };

  // Helper to normalize name for comparison: trim, lowercase, strip special characters/emojis
  const normalizeProductName = (name) => {
    return (name || "")
      .trim()
      .toLowerCase()
      .replace(/[\s\-_.\u200B-\u200D\uFEFF]+/g, "")
      .replace(/[^\w\u0e00-\u0e7f]/g, "");
  };

  // Helper to determine if two product pin records represent the same catalog product
  const areProductsEqual = (a, b) => {
    if (a.catalogId && b.catalogId && a.catalogId === b.catalogId) {
      return true;
    }
    return normalizeProductName(a.name) === normalizeProductName(b.name);
  };

  // Group active room products by equivalence relation
  const productGroups = [];
  activeRoomProducts.forEach((p) => {
    let matchedGroup = productGroups.find(group => areProductsEqual(p, group[0]));
    if (matchedGroup) {
      matchedGroup.push(p);
    } else {
      productGroups.push([p]);
    }
  });

  const deduplicatedProducts = productGroups.map(group => group[0]);

  const getProductLocations = (product) => {
    const group = productGroups.find(g => areProductsEqual(product, g[0]));
    if (!group) return "";
    const locations = group.map(p => getLocationLabel(p.canvasType));
    
    // Sort locations to make it neat: main room first, then collage slots in order
    const locationOrder = {
      "ภาพห้องหลัก": 1,
      "รูปมุมย่อย 1": 2,
      "รูปมุมย่อย 2": 3,
      "รูปมุมย่อย 3": 4,
      "รูปมุมย่อย 4": 5,
      "รูปมุมย่อย 5": 6
    };
    const uniqueLocations = [...new Set(locations)];
    uniqueLocations.sort((a, b) => (locationOrder[a] || 99) - (locationOrder[b] || 99));
    return uniqueLocations.join(", ");
  };

  // Pin locator trigger
  const handleLocateProduct = (product) => {
    const group = productGroups.find(g => areProductsEqual(product, g[0]));
    if (!group) return;

    // Find if there is a pin in this group on the currently active slide
    const activeCanvasType = slideshowImages[currentImageIndex]?.canvasType || "main";
    let targetPin = group.find(p => {
      const pCanvasType = p.canvasType || "main";
      return pCanvasType === activeCanvasType;
    });

    // If no pin on active slide, fallback to the first pin in the group
    if (!targetPin) {
      targetPin = group[0];
    }

    if (targetPin) {
      setHighlightedId(targetPin.id);
      addToast("ระบุพิกัดตำแหน่งสินค้าบนรูปภาพแล้ว", "info");
      
      const targetCanvasType = targetPin.canvasType || "main";
      const targetIdx = slideshowImages.findIndex(img => img.canvasType === targetCanvasType);
      if (targetIdx !== -1) {
        setCurrentImageIndex(targetIdx);
      }
    }

    const viewport = document.querySelector(".room-viewport-container");
    if (viewport) {
      viewport.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleOpenProductLink = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="app-container">
      {/* Background Decorative Blur Blobs */}
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {toast.type === "success" ? (
              <svg className="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg className="toast-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => setActiveView("shop")}>
          <span>DREAM ROOM</span>
          <span className="nav-brand-dot"></span>
        </div>
        <div className="nav-menu">
          <span
            className={`nav-link ${activeView === "shop" ? "active" : ""}`}
            onClick={() => setActiveView("shop")}
          >
            แรงบันดาลใจแต่งบ้าน
          </span>
          {activeView === "shop" ? (
            <button className="nav-btn-admin icon-only-gear" onClick={() => setActiveView("admin")} title="จัดการระบบหลังบ้าน">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          ) : (
            <button className="nav-btn-admin nav-btn-primary" onClick={() => setActiveView("shop")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>กลับหน้าหลักแกลเลอรี</span>
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeView === "shop" ? (
          <div className="room-section animate-fade-in">
            {/* Header Description */}
            <div className="page-header">
              <h1>Create your dream room</h1>
            </div>

            {/* Editorial Magazine Index Style */}
            <div className="magazine-index">
              <div className="magazine-page-indicator">
                PAGE {rooms.findIndex(r => r.id === currentRoomId) + 1} OF {rooms.length}
              </div>
              <div className="magazine-tabs">
                {rooms.map((room, idx) => (
                  <button
                    key={room.id}
                    className={`magazine-tab-btn ${currentRoomId === room.id ? "active" : ""}`}
                    onClick={() => setCurrentRoomId(room.id)}
                  >
                    <div className="tab-thumb-wrapper">
                      <img src={room.image} alt={room.name} className="tab-thumb-img" />
                      <span className="tab-thumb-number">0{idx + 1}</span>
                    </div>
                    <span className="tab-name">{room.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editorial Main Spread: Canvas on the Left, Style details Card on the Right */}
            <div className="editorial-main-spread">
              <div className="spread-left-canvas">
                <RoomCanvas
                  products={activeRoomProducts.filter(p => {
                    const activeCanvasType = slideshowImages[currentImageIndex]?.canvasType || "main";
                    if (activeCanvasType === "main") {
                      return !p.canvasType || p.canvasType === "main";
                    }
                    return p.canvasType === activeCanvasType;
                  })}
                  highlightedId={highlightedId}
                  onSelectProduct={setSelectedProduct}
                  roomImage={slideshowImages[currentImageIndex]?.url}
                  isTransitioning={isTransitioning}
                  onPrevPage={slideshowImages.length > 1 ? handlePrevImage : null}
                  onNextPage={slideshowImages.length > 1 ? handleNextImage : null}
                />
              </div>

              <div className="spread-right-style">
                {currentRoom && currentRoom.details && (
                  <div className="design-style-section">
                    <div className="style-card">
                      <div className="style-header">
                        <span className="style-badge">{currentRoom.details.concept}</span>
                        <h2>{currentRoom.styleTitle}</h2>
                        <p className="style-desc">{currentRoom.description}</p>
                      </div>
                      
                      <div className="style-grid">
                        {/* Colors */}
                        <div className="style-info-block">
                          <h4>โทนสีหลัก (Color Palette)</h4>
                          <div className="style-colors">
                            {currentRoom.details.colors.map((color, index) => (
                              <div key={index} className="color-item" title={color.name}>
                                <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
                                <div className="color-info">
                                  <span className="color-name">{color.name}</span>
                                  <span className="color-hex">{color.hex}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div className="style-info-block">
                          <h4>เอกลักษณ์สำคัญ (Key Features)</h4>
                          <ul className="style-features-list">
                            {currentRoom.details.features.map((feat, index) => (
                              <li key={index}>{feat}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Tips */}
                        <div className="style-info-block tips-block">
                          <h4>เคล็ดลับจัดห้องแต่งตาม (Design Tips)</h4>
                          <p className="style-tips-text">{currentRoom.details.tips}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Editorial Collage Gallery */}
            {roomCollages[currentRoomId] && (
              roomCollages[currentRoomId].img1 || 
              roomCollages[currentRoomId].img2 || 
              roomCollages[currentRoomId].img3 ||
              roomCollages[currentRoomId].img4 ||
              roomCollages[currentRoomId].img5
            ) && (
              <EditorialCollage
                collage={roomCollages[currentRoomId]}
                products={activeRoomProducts}
                highlightedId={highlightedId}
                onSelectProduct={setSelectedProduct}
              />
            )}

            {/* Products Grid list for Accessibility */}
            <div className="products-list-section">
              <div className="section-title-wrapper">
                <h3 className="section-title">
                  <span>เฟอร์นิเจอร์ทั้งหมดในห้องนี้</span>
                  <span className="product-count-badge">{deduplicatedProducts.length} ชิ้น</span>
                </h3>
              </div>

              {deduplicatedProducts.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  ไม่มีสินค้าจัดแสดงในขณะนี้ เข้าสู่ระบบหลังบ้านเพื่อเพิ่มจุดสินค้าชิ้นแรกของคุณ!
                </p>
              ) : (
                <div className="products-grid">
                  {deduplicatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="product-card"
                      onClick={() => setSelectedProduct(p)}
                    >
                      {p.image && (p.displayType === "both" || p.displayType === "image" || !p.displayType) && (
                        <div className="product-card-img-wrapper">
                          <img src={p.image} alt={p.name} className="product-card-img" loading="lazy" />
                        </div>
                      )}
                      
                      {p.displayType !== "image" ? (
                        <div className="product-card-info">
                          <div className="product-location-badge">
                            {getProductLocations(p)}
                          </div>
                          <h4 className="product-card-title">{p.name}</h4>
                          <p className="product-card-desc">{p.description || "ไม่มีรายละเอียดสินค้า"}</p>
                          <div className="product-card-price">{p.price}</div>
                        </div>
                      ) : (
                        <div className="product-card-info image-only">
                          <div>
                            <div className="product-location-badge">
                              {getProductLocations(p)}
                            </div>
                            <h4 className="product-card-title">{p.name}</h4>
                          </div>
                          <div className="product-card-price">{p.price}</div>
                        </div>
                      )}

                      <div className="product-card-actions">
                        <button
                          className="product-card-btn-locate"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLocateProduct(p);
                          }}
                          title="ค้นหาจุดสินค้าในห้อง"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </button>
                        <button
                          className="product-card-btn-buy"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProductLink(p.url);
                          }}
                        >
                          <span>ช้อปสินค้า</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <AdminPanel
            products={products}
            onUpdateProducts={updateProducts}
            onAddToast={addToast}
            currentRoomId={currentRoomId}
            roomImage={rooms.find((r) => r.id === currentRoomId)?.image}
            roomCollages={roomCollages}
            onUpdateRoomCollage={updateRoomCollage}
            rooms={rooms}
            onUpdateRooms={handleUpdateRooms}
            onRoomChange={setCurrentRoomId}
          />
        )}
      </main>

      {/* Mobile / Tablet Details Modal Drawer */}
      <div
        className={`mobile-modal-overlay ${selectedProduct ? "open" : ""}`}
        onClick={() => setSelectedProduct(null)}
      ></div>
      <div className={`mobile-details-modal ${selectedProduct ? "open" : ""}`}>
        {selectedProduct && (
          <>
            <button className="mobile-modal-close" onClick={() => setSelectedProduct(null)}>
              &times;
            </button>
            <h3 className="mobile-modal-title">{selectedProduct.name}</h3>
            <div className="mobile-modal-price">{selectedProduct.price}</div>
            
            {selectedProduct.image && (selectedProduct.displayType === "both" || selectedProduct.displayType === "image" || !selectedProduct.displayType) && (
               <div className="mobile-modal-img-wrapper">
                 <img src={selectedProduct.image} alt={selectedProduct.name} className="mobile-modal-img" loading="lazy" />
               </div>
            )}

            {selectedProduct.displayType !== "image" && (
              <p className="mobile-modal-desc">{selectedProduct.description || "ไม่มีคำอธิบายเพิ่มเติม"}</p>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn-primary"
                style={{ padding: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                onClick={() => handleOpenProductLink(selectedProduct.url)}
              >
                <span>ไปยังเว็บไซต์สั่งซื้อสินค้า</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
              <button
                className="btn-cancel"
                style={{ flex: 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}
                onClick={() => {
                  handleLocateProduct(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>ระบุตำแหน่ง</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Minimalist Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Minimalist Room Shop. All Rights Reserved.</p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          ออกแบบพื้นที่ของคุณให้น่าอยู่ ในบรรยากาศที่แสนเงียบสงบและมินิมอล
        </p>
        <div className="footer-links">
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveView("shop"); }}>แกลเลอรีหน้าแรก</a>
          <span>&middot;</span>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveView("admin"); }}>ระบบหลังบ้าน</a>
        </div>
      </footer>
    </div>
  );
}
