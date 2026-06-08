import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { defaultProducts } from "./data/defaultProducts";
import { defaultRooms } from "./data/defaultRooms";
import { defaultCollages } from "./data/defaultCollages";
import { defaultCatalog } from "./data/defaultCatalog";
import RoomCanvas from "./components/RoomCanvas";
import AdminPanel from "./components/AdminPanel";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
const getLocationLabel = (canvasType) => {
  if (!canvasType || canvasType === "main") return "ภาพห้องหลัก";
  if (canvasType === "collage-1") return "รูปมุมย่อย 1";
  if (canvasType === "collage-2") return "รูปมุมย่อย 2";
  if (canvasType === "collage-3") return "รูปมุมย่อย 3";
  if (canvasType === "collage-4") return "รูปมุมย่อย 4";
  if (canvasType === "collage-5") return "รูปมุมย่อย 5";
  return "รูปมุมย่อย";
};


function EditorialCollage({ collage, products = [], highlightedId, onSelectProduct, roomName, styleTitle }) {

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

          {/* Direct Price Tag for CTR */}
          <div className="ikea-pin-price-tag">
            {product.price}
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
                  <img src={collage.img1} alt={`พิกัดของแต่งห้องนอน รูปมุมย่อย 1 สไตล์ ${styleTitle || roomName || ''}`} className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-1")}
              </div>
            )}
            {collage.img2 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img2} alt={`พิกัดของแต่งห้องนอน รูปมุมย่อย 2 สไตล์ ${styleTitle || roomName || ''}`} className="collage-img" loading="lazy" />
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
                <img src={collage.img3} alt={`พิกัดของแต่งห้องนอน รูปมุมย่อย 3 สไตล์ ${styleTitle || roomName || ''}`} className="collage-img" loading="lazy" />
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
                  <img src={collage.img4} alt={`พิกัดของแต่งห้องนอน รูปมุมย่อย 4 สไตล์ ${styleTitle || roomName || ''}`} className="collage-img" loading="lazy" />
                </div>
                {renderHotspots("collage-4")}
              </div>
            )}
            {collage.img5 && (
              <div className="collage-slot small-slot">
                <div className="collage-img-wrapper">
                  <img src={collage.img5} alt={`พิกัดของแต่งห้องนอน รูปมุมย่อย 5 สไตล์ ${styleTitle || roomName || ''}`} className="collage-img" loading="lazy" />
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
    const saved = localStorage.getItem("minimal_room_list_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading rooms from localStorage", e);
      }
    }
    return defaultRooms;
  });

  const handleUpdateRooms = async (newRoomsList) => {
    setRooms(newRoomsList);
    localStorage.setItem("minimal_room_list_v2", JSON.stringify(newRoomsList));

    if (isSupabaseConfigured) {
      try {
        const deletedRoomIds = rooms
          .filter(r => !newRoomsList.some(nr => nr.id === r.id))
          .map(r => r.id);

        if (deletedRoomIds.length > 0) {
          const { error: deleteErr } = await supabase
            .from("rooms")
            .delete()
            .in("id", deletedRoomIds);
          if (deleteErr) throw deleteErr;
        }

        if (newRoomsList.length > 0) {
          const roomsToUpsert = newRoomsList.map(r => ({
            id: r.id,
            name: r.name,
            image: r.image,
            styleTitle: r.styleTitle,
            description: r.description,
            details: r.details
          }));

          const { error: upsertErr } = await supabase
            .from("rooms")
            .upsert(roomsToUpsert);
          if (upsertErr) throw upsertErr;
        }
        addToast("บันทึกการเปลี่ยนแปลงห้องไปยัง Supabase สำเร็จ", "success");
      } catch (err) {
        console.error("Error syncing rooms to Supabase:", err);
        addToast("บันทึกข้อมูลไปยัง Supabase ไม่สำเร็จ: " + err.message, "error");
      }
    }
  };

  // Collage state per room
  const [roomCollages, setRoomCollages] = useState(() => {
    const saved = localStorage.getItem("minimal_room_collages_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error loading collages", e);
      }
    }
    return defaultCollages;
  });

  const updateRoomCollage = async (roomId, updatedCollage) => {
    const newCollages = { ...roomCollages };
    if (updatedCollage === null) {
      delete newCollages[roomId];
    } else {
      newCollages[roomId] = updatedCollage;
    }
    setRoomCollages(newCollages);
    localStorage.setItem("minimal_room_collages_v2", JSON.stringify(newCollages));

    if (isSupabaseConfigured) {
      try {
        if (updatedCollage === null) {
          const { error: deleteErr } = await supabase
            .from("room_collages")
            .delete()
            .eq("room_id", roomId);
          if (deleteErr) throw deleteErr;
        } else {
          const collageToUpsert = {
            room_id: roomId,
            img1: updatedCollage.img1 || null,
            img2: updatedCollage.img2 || null,
            img3: updatedCollage.img3 || null,
            img4: updatedCollage.img4 || null,
            img5: updatedCollage.img5 || null
          };
          const { error: upsertErr } = await supabase
            .from("room_collages")
            .upsert(collageToUpsert);
          if (upsertErr) throw upsertErr;
        }
        addToast("บันทึกการเปลี่ยนแปลงภาพมุมย่อยไปยัง Supabase สำเร็จ", "success");
      } catch (err) {
        console.error("Error syncing collage to Supabase:", err);
        addToast("บันทึกข้อมูลมุมย่อยไปยัง Supabase ไม่สำเร็จ: " + err.message, "error");
      }
    }
  };
  
  // Load products from localStorage or use defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("minimal_room_products_v3");
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
          localStorage.setItem("minimal_room_products_v3", JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        console.error("Error loading products from localStorage, using defaults", e);
      }
    }
    // Save defaults to localStorage initially
    localStorage.setItem("minimal_room_products_v3", JSON.stringify(defaultProducts));
    return defaultProducts;
  });

  // Load catalog from localStorage or use defaults
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem("minimal_room_catalog_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Inject image if missing for default catalog items
        let updated = false;
        const migrated = parsed.map(item => {
          if (!item.image) {
            const defMatch = defaultCatalog.find(dc => dc.name === item.name);
            if (defMatch && defMatch.image) {
              updated = true;
              return { ...item, image: defMatch.image };
            }
          }
          return item;
        });
        if (updated) {
          localStorage.setItem("minimal_room_catalog_v2", JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        console.error("Error loading catalog from localStorage, using defaults", e);
      }
    }
    // Save defaults to localStorage initially
    localStorage.setItem("minimal_room_catalog_v2", JSON.stringify(defaultCatalog));
    return defaultCatalog;
  });

  const updateCatalog = async (newCatalog) => {
    setCatalog(newCatalog);
    localStorage.setItem("minimal_room_catalog_v2", JSON.stringify(newCatalog));

    if (isSupabaseConfigured) {
      try {
        const deletedCatalogIds = catalog
          .filter(c => !newCatalog.some(nc => nc.id === c.id))
          .map(c => c.id);

        if (deletedCatalogIds.length > 0) {
          const { error: deleteErr } = await supabase
            .from("catalog")
            .delete()
            .in("id", deletedCatalogIds);
          if (deleteErr) throw deleteErr;
        }

        if (newCatalog.length > 0) {
          const catalogToUpsert = newCatalog.map(c => ({
            id: c.id,
            name: c.name,
            price: c.price || null,
            url: c.url || null,
            image: c.image || null,
            description: c.description || null
          }));

          const { error: upsertErr } = await supabase
            .from("catalog")
            .upsert(catalogToUpsert);
          if (upsertErr) throw upsertErr;
        }
        addToast("บันทึกแคตตาล็อกสินค้าไปยัง Supabase สำเร็จ", "success");
      } catch (err) {
        console.error("Error syncing catalog to Supabase:", err);
        addToast("บันทึกแคตตาล็อกไปยัง Supabase ไม่สำเร็จ: " + err.message, "error");
      }
    }
  };

  // Auto-sync with local disk in development environment
  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/save-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rooms,
          roomCollages,
          products,
          catalog
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          console.log('Saved changes directly to disk!');
        }
      })
      .catch(err => {
        // Silently fail in production
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [rooms, roomCollages, products, catalog]);

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
    const saved = localStorage.getItem("minimal_room_list_v2");
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
    return defaultRooms[0]?.id || "room-1780739717638";
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
    (p) => p.roomId === currentRoomId || (!p.roomId && currentRoomId === (defaultRooms[0]?.id || "room-1780739717638"))
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

  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaqIndex(activeFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "อยากแต่งห้องนอนมินิมอล ต้องเริ่มเลือกเฟอร์นิเจอร์และของตกแต่งชิ้นไหนก่อน?",
      answer: "เริ่มต้นแนะนำให้เลือกเตียงนอนและตู้เก็บของขนาดเล็กที่คุมโทนสีขาวหรือไม้ธรรมชาติเป็นหลัก จากนั้นจึงเสริมของตกแต่งที่มีดีไซน์เรียบง่าย เช่น โคมไฟตั้งโต๊ะแสงโทนอุ่น (Warm Light) พรมปูพื้นทรงกลม และต้นไม้ปลอมเพื่อเพิ่มพื้นที่สีเขียว การเลือกใช้พิกัดของแต่งห้องที่มีราคาคุ้มค่าจะช่วยคุมงบประมาณได้เป็นอย่างดี"
    },
    {
      question: "การจัดห้องนอนขนาดเล็กให้ดูโปร่งและกว้าง มีเทคนิคอย่างไรบ้าง?",
      answer: "เคล็ดลับสำคัญคือการจัดวางโต๊ะทำงานและเฟอร์นิเจอร์หลักขนานเข้าหาผนังเพื่อเปิดพื้นที่ทางเดินตรงกลางให้โล่งที่สุด เลือกใช้ชั้นวางของแบบโปร่งหรือชั้นลอยติดผนัง (เช่น Pegboard) แทนตู้เก็บของทึบ และใช้กระจกเงาเพื่อสะท้อนแสงธรรมชาติจากหน้าต่าง ซึ่งจะช่วยหลอกตาให้ห้องดูมีมิติและกว้างขึ้นอย่างเห็นได้ชัด"
    },
    {
      question: "ช้อปเฟอร์นิเจอร์และพิกัดของแต่งห้องผ่าน DREAM ROOM มีข้อดีอย่างไร?",
      answer: "DREAM ROOM ช่วยรวบรวมไอเดียจัดห้องในสไตล์ต่างๆ ไม่ว่าจะเป็น Cozy Gamer หรือ Pastel Vintage พร้อมปักหมุด 'พิกัดแต่งห้อง' บนภาพจำลอง 3D ให้คุณเห็นภาพการจัดวางจริงและราคาที่จับต้องได้ เมื่อถูกใจก็สามารถคลิกไปยังช่องทางสั่งซื้ออย่าง Shopee/Lazada ได้ทันที ช่วยประหยัดเวลาในการค้นหาและลดความผิดพลาดในการเลือกขนาดและสไตล์ของแต่งบ้าน"
    },
    {
      question: "การจัดห้องคอมหรือมุมเล่นเกม (Gamer Room) ควรคุมโทนสีและแสงไฟอย่างไร?",
      answer: "แนะนำให้เลือกใช้โต๊ะคอมสีเข้มหรือสีขาวเพื่อเป็นพื้นฐาน จากนั้นใช้ระบบจัดเก็บสายไฟให้เรียบร้อย และเพิ่มลูกเล่นด้วยไฟแถบ RGB หรือโคมไฟดีไซน์โมเดิร์น โทนสีอาจใช้สีเย็นอย่างน้ำเงิน-เทา แล้วสอดแทรกสีสันสดใสอย่างเหลืองหรือเขียวจากตู้หรือรถเข็นเก็บของ เพื่อช่วยสร้างพลังงานบวกและเป็นจุดนำสายตาที่น่าสนใจ"
    }
  ];



  // Save changes to products list
  const updateProducts = async (newProductsList) => {
    setProducts(newProductsList);
    localStorage.setItem("minimal_room_products_v3", JSON.stringify(newProductsList));

    if (isSupabaseConfigured) {
      try {
        const deletedProductIds = products
          .filter(p => !newProductsList.some(np => np.id === p.id))
          .map(p => p.id);

        if (deletedProductIds.length > 0) {
          const { error: deleteErr } = await supabase
            .from("products")
            .delete()
            .in("id", deletedProductIds);
          if (deleteErr) throw deleteErr;
        }

        if (newProductsList.length > 0) {
          const productsToUpsert = newProductsList.map(p => ({
            id: p.id,
            roomId: p.roomId || null,
            name: p.name,
            price: p.price || null,
            url: p.url || null,
            description: p.description || null,
            x: p.x !== undefined ? p.x : null,
            y: p.y !== undefined ? p.y : null,
            w: p.w !== undefined ? p.w : null,
            h: p.h !== undefined ? p.h : null,
            image: p.image || null,
            displayType: p.displayType || null,
            canvasType: p.canvasType || null,
            catalogId: p.catalogId || null
          }));

          const { error: upsertErr } = await supabase
            .from("products")
            .upsert(productsToUpsert);
          if (upsertErr) throw upsertErr;
        }
        addToast("บันทึกข้อมูลพิกัดจุดสินค้าไปยัง Supabase สำเร็จ", "success");
      } catch (err) {
        console.error("Error syncing products to Supabase:", err);
        addToast("บันทึกพิกัดสินค้าไปยัง Supabase ไม่สำเร็จ: " + err.message, "error");
      }
    }
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

  // Dynamic SEO Updates (Title, Description, JSON-LD Schema)
  useEffect(() => {
    if (activeView === "shop" && currentRoom) {
      // Update Document Title
      const titleText = `ไอเดียจัดห้องสไตล์ ${currentRoom.styleTitle} - แจกพิกัดของแต่งห้องนอน | DREAM ROOM`;
      document.title = titleText;

      // Update Meta Description
      const descMeta = document.querySelector('meta[name="description"]');
      const descriptionText = `${currentRoom.description || ""} ชมไอเดียพร้อมแจกพิกัดแต่งห้องนอนมินิมอล ช้อปตามได้ทันทีรวม ${activeRoomProducts.length} รายการ เช่น ${deduplicatedProducts.slice(0, 5).map(p => p.name).join(", ")}`;
      if (descMeta) {
        descMeta.setAttribute("content", descriptionText);
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDesc = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogTitle) ogTitle.setAttribute("content", titleText);
      if (ogDesc) ogDesc.setAttribute("content", descriptionText);
      if (ogImage && currentRoom.image) ogImage.setAttribute("content", currentRoom.image);

      // Update or Create JSON-LD Script
      let jsonLdScript = document.getElementById("room-jsonld");
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = "room-jsonld";
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }

      // Construct ItemList Schema for Products in the room
      const productItems = deduplicatedProducts.map((p, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": p.name,
          "image": p.image || currentRoom.image,
          "description": p.description || `พิกัดของแต่งห้อง ${p.name} ราคาดี ช้อปง่ายๆ จากลิ้งก์สั่งซื้อ`,
          "offers": {
            "@type": "Offer",
            "price": p.price ? p.price.replace(/[^\d.]/g, "") : "0",
            "priceCurrency": "THB",
            "url": p.url || window.location.href,
            "availability": "https://schema.org/InStock"
          }
        }
      }));

      const schemaData = [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `ไอเดียจัดห้องแบบ ${currentRoom.styleTitle} | พิกัดของแต่งห้องมินิมอล`,
          "description": currentRoom.description,
          "itemListElement": productItems
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        }
      ];

      jsonLdScript.text = JSON.stringify(schemaData);
    } else {
      // Reset to defaults
      document.title = "แจกพิกัดแต่งห้องมินิมอล ไอเดียจัดห้องนอนจำลอง 3D ช้อปตามได้ทันที | DREAM ROOM";
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) {
        descMeta.setAttribute(
          "content",
          "DREAM ROOM - รวมไอเดียแต่งห้องนอน จัดห้องนอนขนาดเล็ก พร้อมแจกพิกัดของแต่งห้องมินิมอล โต๊ะคอมเกมเมอร์ โต๊ะเครื่องแป้ง และเฟอร์นิเจอร์น่ารักๆ ช้อปตามรูปภาพห้องจำลองได้ทันที!"
        );
      }
      const jsonLdScript = document.getElementById("room-jsonld");
      if (jsonLdScript) {
        jsonLdScript.remove();
      }
    }
  }, [currentRoomId, currentRoom, activeRoomProducts, deduplicatedProducts, activeView]);

  const [selectedShopItems, setSelectedShopItems] = useState([]);

  // Auto-initialize selected items when room changes
  useEffect(() => {
    const activeProds = products.filter(
      (p) => p.roomId === currentRoomId || (!p.roomId && currentRoomId === (defaultRooms[0]?.id || "room-1780739717638"))
    );
    const groups = [];
    activeProds.forEach((p) => {
      let matched = groups.find(g => areProductsEqual(p, g[0]));
      if (matched) matched.push(p);
      else groups.push([p]);
    });
    const dedupedIds = groups.map(g => g[0].id);
    setSelectedShopItems(dedupedIds);
  }, [currentRoomId, products]);

  const toggleShopItem = (productId) => {
    setSelectedShopItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const calculateTotalCost = () => {
    return deduplicatedProducts
      .filter(p => selectedShopItems.includes(p.id))
      .reduce((sum, p) => {
        const val = parseInt(p.price.replace(/[^\d]/g, ""), 10) || 0;
        return sum + val;
      }, 0);
  };

  const copySelectedCoordinates = () => {
    const selectedProds = deduplicatedProducts.filter(p => selectedShopItems.includes(p.id));
    if (selectedProds.length === 0) {
      addToast("โปรดเลือกสินค้าอย่างน้อย 1 ชิ้นเพื่อคัดลอกพิกัด", "info");
      return;
    }
    const text = selectedProds.map(p => `- ${p.name} (${p.price}): ${p.url || 'ไม่มีลิงก์'}`).join("\n");
    navigator.clipboard.writeText(`แจกพิกัดของแต่งห้องนอนมินิมอล จาก DREAM ROOM (${currentRoom?.name} สไตล์ ${currentRoom?.styleTitle}):\n${text}\n\nเข้าชมภาพจำลอง 3D และจัดงบประมาณด้วยตนเองได้ที่: https://shop-sell-peach.vercel.app/`);
    addToast("คัดลอกพิกัดสินค้าและลิงก์เรียบร้อยแล้ว!", "success");
  };

  const [isSupabaseLoading, setIsSupabaseLoading] = useState(false);

  const seedSupabaseDatabase = async () => {
    try {
      const roomsToInsert = defaultRooms.map(r => ({
        id: r.id,
        name: r.name,
        image: r.image,
        styleTitle: r.styleTitle,
        description: r.description,
        details: r.details
      }));
      
      const { error: roomsErr } = await supabase
        .from("rooms")
        .insert(roomsToInsert);
      if (roomsErr) throw roomsErr;

      const collagesToInsert = [];
      Object.entries(defaultCollages).forEach(([roomId, collage]) => {
        collagesToInsert.push({
          room_id: roomId,
          img1: collage.img1 || null,
          img2: collage.img2 || null,
          img3: collage.img3 || null,
          img4: collage.img4 || null,
          img5: collage.img5 || null
        });
      });
      if (collagesToInsert.length > 0) {
        const { error: collagesErr } = await supabase
          .from("room_collages")
          .insert(collagesToInsert);
        if (collagesErr) throw collagesErr;
      }

      const productsToInsert = defaultProducts.map(p => ({
        id: p.id,
        roomId: p.roomId || null,
        name: p.name,
        price: p.price || null,
        url: p.url || null,
        description: p.description || null,
        x: p.x !== undefined ? p.x : null,
        y: p.y !== undefined ? p.y : null,
        w: p.w !== undefined ? p.w : null,
        h: p.h !== undefined ? p.h : null,
        image: p.image || null,
        displayType: p.displayType || null,
        canvasType: p.canvasType || null,
        catalogId: p.catalogId || null
      }));
      const { error: productsErr } = await supabase
        .from("products")
        .insert(productsToInsert);
      if (productsErr) throw productsErr;

      const catalogToInsert = defaultCatalog.map(c => ({
        id: c.id,
        name: c.name,
        price: c.price || null,
        url: c.url || null,
        image: c.image || null,
        description: c.description || null
      }));
      const { error: catalogErr } = await supabase
        .from("catalog")
        .insert(catalogToInsert);
      if (catalogErr) throw catalogErr;

      addToast("นำเข้าข้อมูลเริ่มต้นไปยัง Supabase สำเร็จ!", "success");

      setRooms(defaultRooms);
      setRoomCollages(defaultCollages);
      setProducts(defaultProducts);
      setCatalog(defaultCatalog);

      localStorage.setItem("minimal_room_list_v2", JSON.stringify(defaultRooms));
      localStorage.setItem("minimal_room_collages_v2", JSON.stringify(defaultCollages));
      localStorage.setItem("minimal_room_products_v3", JSON.stringify(defaultProducts));
      localStorage.setItem("minimal_room_catalog_v2", JSON.stringify(defaultCatalog));

    } catch (err) {
      console.error("Failed to seed Supabase database:", err);
      addToast("นำเข้าข้อมูลเริ่มต้นไม่สำเร็จ: " + err.message, "error");
    }
  };

  useEffect(() => {
    const loadDataFromSupabase = async () => {
      if (!isSupabaseConfigured) return;
      setIsSupabaseLoading(true);
      try {
        const { data: roomsData, error: roomsError } = await supabase
          .from("rooms")
          .select("*")
          .order("created_at", { ascending: true });

        if (roomsError) throw roomsError;

        const { data: collagesData, error: collagesError } = await supabase
          .from("room_collages")
          .select("*");

        if (collagesError) throw collagesError;

        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: true });

        if (productsError) throw productsError;

        const { data: catalogData, error: catalogError } = await supabase
          .from("catalog")
          .select("*")
          .order("created_at", { ascending: true });

        if (catalogError) throw catalogError;

        if (!roomsData || roomsData.length === 0) {
          addToast("ระบบตรวจพบฐานข้อมูลว่าง กำลังนำเข้าข้อมูลเริ่มต้นไปยัง Supabase...", "info");
          await seedSupabaseDatabase();
          return;
        }

        const mappedRooms = roomsData.map(r => ({
          id: r.id,
          name: r.name,
          image: r.image,
          styleTitle: r.styleTitle,
          description: r.description,
          details: typeof r.details === "string" ? JSON.parse(r.details) : r.details
        }));

        const mappedCollages = {};
        collagesData.forEach(c => {
          mappedCollages[c.room_id] = {
            img1: c.img1,
            img2: c.img2,
            img3: c.img3,
            img4: c.img4,
            img5: c.img5
          };
        });

        const mappedProducts = productsData.map(p => ({
          id: p.id,
          roomId: p.roomId,
          name: p.name,
          price: p.price,
          url: p.url,
          description: p.description,
          x: p.x,
          y: p.y,
          w: p.w,
          h: p.h,
          image: p.image,
          displayType: p.displayType,
          canvasType: p.canvasType,
          catalogId: p.catalogId
        }));

        const mappedCatalog = catalogData.map(c => ({
          id: c.id,
          name: c.name,
          price: c.price,
          url: c.url,
          image: c.image,
          description: c.description
        }));

        setRooms(mappedRooms);
        setRoomCollages(mappedCollages);
        setProducts(mappedProducts);
        setCatalog(mappedCatalog);

        localStorage.setItem("minimal_room_list_v2", JSON.stringify(mappedRooms));
        localStorage.setItem("minimal_room_collages_v2", JSON.stringify(mappedCollages));
        localStorage.setItem("minimal_room_products_v3", JSON.stringify(mappedProducts));
        localStorage.setItem("minimal_room_catalog_v2", JSON.stringify(mappedCatalog));

        if (mappedRooms.length > 0 && !mappedRooms.some(r => r.id === currentRoomId)) {
          setCurrentRoomId(mappedRooms[0].id);
        }

        addToast("โหลดข้อมูลเรียลไทม์จาก Supabase เรียบร้อยแล้ว", "success");
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
        addToast("ไม่สามารถโหลดข้อมูลจาก Supabase ได้ (สลับเป็นโหมดออฟไลน์)", "warning");
      } finally {
        setIsSupabaseLoading(false);
      }
    };

    loadDataFromSupabase();
  }, []);

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
              <p className="page-seo-title">แจกพิกัดแต่งห้องนอนมินิมอล & ไอเดียจัดห้องจำลอง 3D</p>
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
                  roomAlt={`ไอเดียจัดห้องนอน - แต่งห้องสไตล์ ${currentRoom?.styleTitle || ''} - ${currentRoom?.name || ''}`}
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
                roomName={currentRoom?.name}
                styleTitle={currentRoom?.styleTitle}
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

              {deduplicatedProducts.length > 0 && (
                <div className="budget-calculator-card animate-fade-in">
                  <div className="calc-left">
                    <span className="calc-badge">BUDGET ESTIMATOR</span>
                    <h4 className="calc-title">เครื่องคำนวณงบประมาณจัดห้องนอน</h4>
                    <p className="calc-desc">
                      เลือกของแต่งห้องที่คุณต้องการเพื่อคำนวณงบประมาณ และคลิกคัดลอกพิกัด Shopee/Lazada ทั้งหมดได้ทันทีในคลิกเดียว เพื่อแชร์หรือเซฟเก็บไว้
                    </p>
                  </div>
                  <div className="calc-right">
                    <div className="calc-stats">
                      <div className="stat-box">
                        <span className="stat-label">สินค้าที่เลือก</span>
                        <span className="stat-value">{selectedShopItems.length} / {deduplicatedProducts.length} ชิ้น</span>
                      </div>
                      <div className="stat-box highlighted">
                        <span className="stat-label">งบประมาณรวม</span>
                        <span className="stat-value">฿{calculateTotalCost().toLocaleString()}</span>
                      </div>
                    </div>
                    <button 
                      className="btn-copy-coords"
                      onClick={copySelectedCoordinates}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span>คัดลอกพิกัดสินค้าที่เลือกทั้งหมด ({selectedShopItems.length})</span>
                    </button>
                  </div>
                </div>
              )}

              {deduplicatedProducts.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem" }}>
                  ไม่มีสินค้าจัดแสดงในขณะนี้ เข้าสู่ระบบหลังบ้านเพื่อเพิ่มจุดสินค้าชิ้นแรกของคุณ!
                </p>
              ) : (
                <div className="products-grid">
                  {deduplicatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className={`product-card ${selectedShopItems.includes(p.id) ? 'selected-for-shopping' : ''}`}
                      onClick={() => setSelectedProduct(p)}
                    >
                      <div className="product-card-selection" onClick={(e) => { e.stopPropagation(); toggleShopItem(p.id); }}>
                        <div className={`product-checkbox ${selectedShopItems.includes(p.id) ? 'checked' : ''}`}>
                          {selectedShopItems.includes(p.id) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <span className="checkbox-label">ใส่ตะกร้าพิกัด</span>
                      </div>
                      {p.image && (p.displayType === "both" || p.displayType === "image" || !p.displayType) && (
                        <div className="product-card-img-wrapper">
                          <img src={p.image} alt={`พิกัดของแต่งห้องมินิมอล - ${p.name}`} className="product-card-img" loading="lazy" />
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

            {/* SEO Article & FAQ Section */}
            <div className="seo-articles-faq">
              <div className="seo-divider"></div>
              
              <section className="seo-intro-content">
                <h3 className="seo-section-title">ไอเดียแต่งห้อง & เทคนิคจัดห้องนอน พร้อมแจกพิกัดของแต่งบ้านยอดนิยม | DREAM ROOM</h3>
                <p>
                  ยินดีต้อนรับสู่ <strong>DREAM ROOM</strong> แหล่งรวบรวม <strong>ไอเดียแต่งห้อง</strong> และแรงบันดาลใจในการ <strong>จัดห้อง</strong> ที่คัดสรรมาเป็นพิเศษสำหรับคนรักบ้านและชาวคอนโด 
                  สำหรับใครที่กำลังหาวิธีการ <strong>แต่งห้องนอนมินิมอล</strong> ขนาดเล็กให้ดูโปร่ง โล่ง สบายตา หรือมองหาไอเดียจัดโต๊ะคอมเท่ๆ ด้วย <strong>โต๊ะคอมเกมเมอร์</strong> สำหรับเล่นเกมและทำงาน 
                  เราได้รวบรวมภาพจำลองแบบ 3D และชี้เป้า <strong>พิกัดของแต่งห้องมินิมอล</strong> จากร้านค้ายอดนิยมใน Shopee และ Lazada มาให้คุณช้อปตามได้ทันที
                </p>
                <p>
                  ที่ <strong>DREAM ROOM</strong> เราเชื่อว่าการแต่งห้องนอนสไตล์เกาหลี วินเทจร่วมสมัย หรือมินิมอลแบบอบอุ่น สามารถจัดตามได้จริง 
                  คุณสามารถศึกษาการใช้โทนสี (Color Palette) การเลือกซื้อ <strong>โต๊ะคอมเกมเมอร์</strong> และเก้าอี้เพื่อสุขภาพ การจัดวางรูปแบบเฟอร์นิเจอร์ (Zoning) 
                  และเคล็ดลับการแต่งหน้าต่างเพื่อเพิ่มแสงแดดธรรมชาติ เพื่อให้ได้การ <strong>แต่งห้องนอนมินิมอล</strong> ที่ออกมาสวยงามและมีฟังก์ชันการใช้งานที่ดีที่สุด
                </p>
              </section>

              <section className="seo-faq-section">
                <h3 className="seo-section-title">คำถามที่พบบ่อย (FAQ) เกี่ยวกับการจัดแต่งห้องนอน</h3>
                <div className="faq-list">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaqIndex === index;
                    return (
                      <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button 
                          className="faq-question-btn" 
                          onClick={() => toggleFaq(index)}
                          aria-expanded={isOpen}
                        >
                          <span className="faq-question-text">{faq.question}</span>
                          <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                        </button>
                        <div className="faq-answer-container" style={{ maxHeight: isOpen ? '200px' : '0' }}>
                          <p className="faq-answer-text">{faq.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
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
            catalog={catalog}
            onUpdateCatalog={updateCatalog}
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
      <Analytics />
    </div>
  );
}
