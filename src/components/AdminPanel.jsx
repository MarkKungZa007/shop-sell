import React, { useState, useRef, useEffect } from "react";
import roomImg from "../assets/minimalist_room.png";
import { defaultProducts } from "../data/defaultProducts";

export default function AdminPanel({
  products,
  onUpdateProducts,
  onAddToast,
  currentRoomId = "living-room",
  roomImage,
  roomCollages = {},
  onUpdateRoomCollage,
  rooms = [],
  onUpdateRooms,
  onRoomChange
}) {
  const [passcode, setPasscode] = useState("");
  
  // Filter products for the active room
  const activeRoomProducts = products.filter(
    (p) => p.roomId === currentRoomId || (!p.roomId && currentRoomId === "living-room")
  );
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("admin_auth") === "true";
  });
  const [passcodeError, setPasscodeError] = useState("");

  // Admin Tab: 'hotspots' or 'collage' or 'rooms'
  const [adminTab, setAdminTab] = useState("hotspots");

  // Bounding Box target canvas: 'main' | 'collage-1' | 'collage-2' | 'collage-3'
  const [activeCanvas, setActiveCanvas] = useState("main");

  // Reset active canvas when switching rooms
  useEffect(() => {
    setActiveCanvas("main");
  }, [currentRoomId]);

  // Room Creator Form states
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomStyleTitle, setNewRoomStyleTitle] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [newRoomImage, setNewRoomImage] = useState("");
  const [newRoomConcept, setNewRoomConcept] = useState("");
  const [newRoomTips, setNewRoomTips] = useState("");
  
  // Color palette (3 colors)
  const [color1Name, setColor1Name] = useState("");
  const [color1Hex, setColor1Hex] = useState("");
  const [color2Name, setColor2Name] = useState("");
  const [color2Hex, setColor2Hex] = useState("");
  const [color3Name, setColor3Name] = useState("");
  const [color3Hex, setColor3Hex] = useState("");

  // Features (3 items)
  const [feat1, setFeat1] = useState("");
  const [feat2, setFeat2] = useState("");
  const [feat3, setFeat3] = useState("");

  // Local state for active collage layout
  const [tempCollage, setTempCollage] = useState({
    img1: "", img2: "", img3: "", img4: "", img5: ""
  });

  useEffect(() => {
    if (roomCollages && roomCollages[currentRoomId]) {
      setTempCollage({
        img1: "", img2: "", img3: "", img4: "", img5: "",
        ...roomCollages[currentRoomId]
      });
    } else {
      setTempCollage({
        img1: "", img2: "", img3: "", img4: "", img5: ""
      });
    }
  }, [currentRoomId, roomCollages]);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState(null); // null means "Add Mode"
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [coordX, setCoordX] = useState("");
  const [coordY, setCoordY] = useState("");
  const [coordW, setCoordW] = useState("");
  const [coordH, setCoordH] = useState("");
  const [image, setImage] = useState("");
  const [displayType, setDisplayType] = useState("both"); // "both" | "text" | "image"

  const imageRef = useRef(null);

  let editorImage = roomImage || roomImg;
  let canvasHasImage = true;

  if (activeCanvas === "collage-1") {
    editorImage = roomCollages[currentRoomId]?.img1 || "";
    canvasHasImage = !!editorImage;
  } else if (activeCanvas === "collage-2") {
    editorImage = roomCollages[currentRoomId]?.img2 || "";
    canvasHasImage = !!editorImage;
  } else if (activeCanvas === "collage-3") {
    editorImage = roomCollages[currentRoomId]?.img3 || "";
    canvasHasImage = !!editorImage;
  } else if (activeCanvas === "collage-4") {
    editorImage = roomCollages[currentRoomId]?.img4 || "";
    canvasHasImage = !!editorImage;
  } else if (activeCanvas === "collage-5") {
    editorImage = roomCollages[currentRoomId]?.img5 || "";
    canvasHasImage = !!editorImage;
  }

  const getHotspotCount = (canvasKey) => {
    return activeRoomProducts.filter(p => p.canvasType === canvasKey).length;
  };

  const handleNavigateToTagging = (canvasKey) => {
    setAdminTab("hotspots");
    setActiveCanvas(canvasKey);
    onAddToast(`สลับไปยังแคนวาส ${canvasKey === "collage-1" ? "รูปมุมย่อย 1" : canvasKey === "collage-2" ? "รูปมุมย่อย 2" : "รูปมุมย่อย 3"} แล้ว คุณสามารถคลิกบนภาพเพื่อปักหมุดสินค้าได้ทันที`, "success");
  };


  // Authenticate Admin
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passcode === "180746") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setPasscodeError("");
      onAddToast("เข้าสู่ระบบหลังบ้านสำเร็จ", "success");
    } else {
      setPasscodeError("รหัสผ่านไม่ถูกต้อง");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    onAddToast("ออกจากระบบหลังบ้านแล้ว", "info");
  };

  // Select a product to edit
  const selectProductForEditing = (prod) => {
    setSelectedProductId(prod.id);
    setName(prod.name);
    setPrice(prod.price);
    setUrl(prod.url);
    setDescription(prod.description || "");
    setCoordX(prod.x.toFixed(1));
    setCoordY(prod.y.toFixed(1));
    setCoordW((prod.w || 3.0).toFixed(1));
    setCoordH((prod.h || 3.0).toFixed(1));
    setImage(prod.image || "");
    setDisplayType(prod.displayType || "both");
    setActiveCanvas(prod.canvasType || "main");
    setSelectedCatalogIdForProduct(prod.catalogId || null);
  };

  // Reset form to Add Mode
  const resetForm = () => {
    setSelectedProductId(null);
    setName("");
    setPrice("");
    setUrl("");
    setDescription("");
    setCoordX("");
    setCoordY("");
    setCoordW("3.0");
    setCoordH("3.0");
    setImage("");
    setDisplayType("both");
    setSelectedCatalogIdForProduct(null);
  };

  // Stock Catalog State
  const [catalog, setCatalog] = useState(() => {
    const saved = localStorage.getItem("minimal_room_catalog_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: Inject image if missing for default products
        let updated = false;
        const migrated = parsed.map(item => {
          if (!item.image) {
            const defMatch = defaultProducts.find(dp => dp.name === item.name);
            if (defMatch && defMatch.image) {
              updated = true;
              return { ...item, image: defMatch.image };
            }
          }
          return item;
        });
        if (updated) {
          localStorage.setItem("minimal_room_catalog_v1", JSON.stringify(migrated));
          return migrated;
        }
        return parsed;
      } catch (e) {
        console.error("Error loading catalog", e);
      }
    }
    // Pre-populate with deduplicated defaultProducts by name
    const uniqueProducts = [];
    const seenNames = new Set();
    defaultProducts.forEach(p => {
      if (!seenNames.has(p.name)) {
        seenNames.add(p.name);
        uniqueProducts.push({
          id: `cat-${p.id}`,
          name: p.name,
          price: p.price,
          description: p.description || "",
          url: p.url || "",
          image: p.image || ""
        });
      }
    });
    localStorage.setItem("minimal_room_catalog_v1", JSON.stringify(uniqueProducts));
    return uniqueProducts;
  });

  // Catalog Form states
  const [selectedCatalogId, setSelectedCatalogId] = useState(null);
  const [catName, setCatName] = useState("");
  const [catPrice, setCatPrice] = useState("");
  const [catUrl, setCatUrl] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catImage, setCatImage] = useState("");
  const [selectedCatalogIdForProduct, setSelectedCatalogIdForProduct] = useState(null);

  const handleSaveCatalogItem = (e) => {
    e.preventDefault();
    if (!catName || !catPrice) {
      onAddToast("กรุณากรอกชื่อสินค้าและราคาสินค้า", "info");
      return;
    }

    let normalizedUrl = catUrl.trim();
    if (normalizedUrl) {
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = "https://" + normalizedUrl;
      }
    } else {
      normalizedUrl = "https://shopee.co.th";
    }

    let updatedCatalog;
    if (selectedCatalogId) {
      // Edit catalog item
      updatedCatalog = catalog.map((item) =>
        item.id === selectedCatalogId
          ? {
              ...item,
              name: catName,
              price: catPrice,
              url: normalizedUrl,
              description: catDesc,
              image: catImage
            }
          : item
      );
      onAddToast(`อัปเดตสินค้า "${catName}" ในคลังสำเร็จ`, "success");
    } else {
      // Add new catalog item
      const newItem = {
        id: `cat-${Date.now()}`,
        name: catName,
        price: catPrice,
        url: normalizedUrl,
        description: catDesc,
        image: catImage
      };
      updatedCatalog = [...catalog, newItem];
      onAddToast(`เพิ่มสินค้า "${catName}" ลงในคลังสำเร็จ`, "success");
    }

    setCatalog(updatedCatalog);
    localStorage.setItem("minimal_room_catalog_v1", JSON.stringify(updatedCatalog));
    resetCatalogForm();
  };

  const handleDeleteCatalogItem = (id, itemName, e) => {
    e.stopPropagation();
    if (window.confirm(`คุณต้องการลบสินค้า "${itemName}" ออกจากคลังสินค้าหลักใช่หรือไม่?\n* การลบนี้จะทำการลบตำแหน่งปักหมุดของสินค้านี้ออกจากทุกห้องด้วย`)) {
      const updatedCatalog = catalog.filter((item) => item.id !== id);
      setCatalog(updatedCatalog);
      localStorage.setItem("minimal_room_catalog_v1", JSON.stringify(updatedCatalog));
      
      // Also delete all product pins associated with this catalog item (by catalogId or name)
      const updatedProducts = products.filter((p) => p.catalogId !== id && p.name !== itemName);
      onUpdateProducts(updatedProducts);
      
      onAddToast(`ลบสินค้า "${itemName}" และจุดปักหมุดในห้องเรียบร้อยแล้ว`, "success");
      if (selectedCatalogId === id) {
        resetCatalogForm();
      }
    }
  };

  const resetCatalogForm = () => {
    setSelectedCatalogId(null);
    setCatName("");
    setCatPrice("");
    setCatUrl("");
    setCatDesc("");
    setCatImage("");
  };

  const selectCatalogItemForEditing = (item) => {
    setSelectedCatalogId(item.id);
    setCatName(item.name);
    setCatPrice(item.price);
    setCatUrl(item.url);
    setCatDesc(item.description || "");
    setCatImage(item.image || "");
  };

  const handleSlotImageChange = (slotKey, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTempCollage(prev => ({
        ...prev,
        [slotKey]: event.target.result
      }));
      onAddToast(`อัปโหลดรูปภาพลงช่องสำเร็จ`, "success");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSlotImage = (slotKey) => {
    setTempCollage(prev => ({
      ...prev,
      [slotKey]: ""
    }));
    onAddToast("ลบรูปภาพในช่องนี้ชั่วคราวแล้ว กรุณากดบันทึกเลย์เอาต์เพื่อยืนยันการลบ", "info");
  };

  const handleSaveCollage = () => {
    if (onUpdateRoomCollage) {
      onUpdateRoomCollage(currentRoomId, tempCollage);
      onAddToast("บันทึกเลย์เอาต์นิตยสารเรียบร้อยแล้ว", "success");
    }
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (!newRoomName || !newRoomStyleTitle || !newRoomImage) {
      onAddToast("กรุณากรอกชื่อห้อง หัวข้อสไตล์ และอัปโหลดรูปภาพห้องหลัก", "info");
      return;
    }

    const roomId = `room-${Date.now()}`;
    const newRoomObj = {
      id: roomId,
      name: newRoomName.toUpperCase(),
      image: newRoomImage,
      styleTitle: newRoomStyleTitle,
      description: newRoomDesc || "คำอธิบายภาพและอารมณ์ความรู้สึกของการตกแต่งมุมนี้",
      details: {
        concept: newRoomConcept || "Style Concept",
        colors: [
          { name: color1Name || "Color 1", hex: color1Hex || "#CCCCCC" },
          { name: color2Name || "Color 2", hex: color2Hex || "#CCCCCC" },
          { name: color3Name || "Color 3", hex: color3Hex || "#CCCCCC" }
        ],
        features: [
          feat1 || "เอกลักษณ์ที่ 1",
          feat2 || "เอกลักษณ์ที่ 2",
          feat3 || "เอกลักษณ์ที่ 3"
        ],
        tips: newRoomTips || "คำแนะนำในการจัดมุมสไตล์นี้ให้สวยงาม"
      }
    };

    if (onUpdateRooms) {
      onUpdateRooms([...rooms, newRoomObj]);
      onAddToast(`เพิ่มห้อง "${newRoomName}" เรียบร้อยแล้ว`, "success");
      
      // Reset form fields
      setNewRoomName("");
      setNewRoomStyleTitle("");
      setNewRoomDesc("");
      setNewRoomImage("");
      setNewRoomConcept("");
      setNewRoomTips("");
      setColor1Name("");
      setColor1Hex("");
      setColor2Name("");
      setColor2Hex("");
      setColor3Name("");
      setColor3Hex("");
      setFeat1("");
      setFeat2("");
      setFeat3("");
    }
  };

  const handleDeleteRoom = (roomId, roomName) => {
    if (rooms.length <= 1) {
      onAddToast("ไม่สามารถลบห้องสุดท้ายได้ ต้องเหลืออย่างน้อย 1 ห้อง", "info");
      return;
    }
    if (window.confirm(`คุณแน่ใจว่าต้องการลบห้อง "${roomName}" และข้อมูลที่เกี่ยวข้องใช่หรือไม่?`)) {
      const updatedRooms = rooms.filter((r) => r.id !== roomId);
      
      // If we deleted the active room, switch to another room
      if (roomId === currentRoomId) {
        const nextActiveRoom = updatedRooms[0] || rooms.find((r) => r.id !== roomId);
        if (nextActiveRoom && onRoomChange) {
          onRoomChange(nextActiveRoom.id);
        }
      }
      
      if (onUpdateRooms) {
        onUpdateRooms(updatedRooms);
      }

      // Clean up product pins of this room
      const updatedProducts = products.filter((p) => p.roomId !== roomId);
      onUpdateProducts(updatedProducts);

      // Clean up collage of this room
      if (onUpdateRoomCollage) {
        onUpdateRoomCollage(roomId, null);
      }

      onAddToast(`ลบห้อง "${roomName}" เรียบร้อยแล้ว`, "success");
    }
  };

  // Canvas Click handler (Single-point pin selection)
  const handleCanvasClick = (e) => {
    if (!canvasHasImage) {
      onAddToast("กรุณาอัปโหลดรูปภาพสำหรับมุมย่อยนี้ในแท็บ Collage ก่อนเพื่อวาดพิกัด", "info");
      return;
    }
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const finalX = Math.max(0, Math.min(100, x));
    const finalY = Math.max(0, Math.min(100, y));

    setCoordX(finalX.toFixed(1));
    setCoordY(finalY.toFixed(1));
    setCoordW("3.0");
    setCoordH("3.0");

    onAddToast(`เลือกตำแหน่งปักหมุดที่ X: ${finalX.toFixed(1)}%, Y: ${finalY.toFixed(1)}%`, "success");
  };

  // Save product (Create or Update)
  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !coordX || !coordY) {
      onAddToast("กรุณากรอกข้อมูลให้ครบถ้วน รวมถึงคลิกเลือกตำแหน่งจุดบนรูปภาพ", "info");
      return;
    }

    const xVal = parseFloat(coordX);
    const yVal = parseFloat(coordY);
    const wVal = coordW ? parseFloat(coordW) : 3.0;
    const hVal = coordH ? parseFloat(coordH) : 3.0;

    if (
      isNaN(xVal) || isNaN(yVal) ||
      xVal < 0 || xVal > 100 || yVal < 0 || yVal > 100
    ) {
      onAddToast("พิกัดตำแหน่งต้องถูกต้อง (อยู่ระหว่าง 0% ถึง 100%)", "info");
      return;
    }

    let normalizedUrl = url.trim();
    if (normalizedUrl) {
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = "https://" + normalizedUrl;
      }
    } else {
      normalizedUrl = "https://shopee.co.th";
    }

    let updatedList;
    if (selectedProductId) {
      // Edit mode
      updatedList = products.map((p) =>
        p.id === selectedProductId
          ? {
              ...p,
              name,
              price,
              url: normalizedUrl,
              description,
              x: xVal,
              y: yVal,
              w: wVal,
              h: hVal,
              image,
              displayType,
              canvasType: p.canvasType || activeCanvas,
              catalogId: selectedCatalogIdForProduct
            }
          : p
      );
      onAddToast(`อัปเดตข้อมูลและตำแหน่งหมุด "${name}" เรียบร้อยแล้ว`, "success");
    } else {
      // Add mode
      const newProduct = {
        id: `prod-${Date.now()}`,
        roomId: currentRoomId,
        name,
        price,
        url: normalizedUrl,
        description,
        x: xVal,
        y: yVal,
        w: wVal,
        h: hVal,
        image,
        displayType,
        canvasType: activeCanvas,
        catalogId: selectedCatalogIdForProduct
      };
      updatedList = [...products, newProduct];
      onAddToast(`เพิ่มและปักหมุดสินค้า "${name}" สำเร็จ`, "success");
    }

    onUpdateProducts(updatedList);
    resetForm();
  };

  // Delete product
  const handleDeleteProduct = (id, prodName, e) => {
    e.stopPropagation();
    if (window.confirm(`คุณต้องการลบสินค้า "${prodName}" ใช่หรือไม่?`)) {
      const updatedList = products.filter((p) => p.id !== id);
      onUpdateProducts(updatedList);
      onAddToast(`ลบสินค้า "${prodName}" เรียบร้อยแล้ว`, "success");
      if (selectedProductId === id) {
        resetForm();
      }
    }
  };

  // Reset defaults
  const handleResetToDefaults = () => {
    if (window.confirm("คุณต้องการรีเซ็ตสินค้าและคลังสินค้าทั้งหมดกลับไปเป็นค่าเริ่มต้นจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("minimal_room_products_v2");
      localStorage.removeItem("minimal_room_catalog_v1");
      window.location.reload();
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      rooms: rooms,
      roomCollages: roomCollages,
      products: products,
      catalog: catalog
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "dream_room_full_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onAddToast("ส่งออกข้อมูลระบบทั้งหมดสำเร็จ (รายชื่อห้อง, คอลลาจ, สินค้าในคลัง และจุดปักหมุด)", "success");
  };

  // Import JSON Backup
  const handleImportBackup = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        
        if (Array.isArray(imported)) {
          // Old backup format (only products)
          const isValid = imported.every(
            (p) => p.id && p.name && p.price && typeof p.x === "number" && typeof p.y === "number"
          );
          if (isValid) {
            onUpdateProducts(imported);
            onAddToast("นำเข้าตำแหน่งปักหมุดสำเร็จแล้ว ระบบกำลังรีโหลด...", "success");
            setTimeout(() => window.location.reload(), 1500);
          } else {
            alert("รูปแบบข้อมูลไฟล์สำรองไม่ถูกต้อง");
          }
        } else if (imported && typeof imported === "object") {
          // New full backup format
          const { rooms: impRooms, roomCollages: impCollages, products: impProducts, catalog: impCatalog } = imported;
          
          if (impRooms && Array.isArray(impRooms)) {
            localStorage.setItem("minimal_room_list_v1", JSON.stringify(impRooms));
          }
          if (impCollages && typeof impCollages === "object") {
            localStorage.setItem("minimal_room_collages_v1", JSON.stringify(impCollages));
          }
          if (impProducts && Array.isArray(impProducts)) {
            localStorage.setItem("minimal_room_products_v2", JSON.stringify(impProducts));
          }
          if (impCatalog && Array.isArray(impCatalog)) {
            localStorage.setItem("minimal_room_catalog_v1", JSON.stringify(impCatalog));
          }
          
          onAddToast("นำเข้าข้อมูลระบบทั้งหมดสำเร็จแล้ว! ระบบกำลังรีโหลดหน้าเว็บเพื่อแสดงผล...", "success");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          alert("รูปแบบไฟล์สำรองไม่ถูกต้อง");
        }
      } catch (err) {
        alert("เกิดข้อผิดพลาดในการอ่านไฟล์ JSON");
      }
    };
    fileReader.readAsText(file);
  };



  // Render passcode gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-gate-container">
        <div className="admin-gate-card" style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '360px' }}>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <input
                id="passcode-input"
                type="password"
                className="form-input"
                placeholder="กรอกรหัสผ่าน..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1rem', padding: '0.8rem' }}
                autoFocus
              />
              {passcodeError && <p className="form-error-msg" style={{ textAlign: 'center', marginTop: '0.6rem' }}>{passcodeError}</p>}
            </div>
            <button type="submit" className="btn-submit" style={{ margin: 0, padding: '0.8rem' }}>
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-controls-header" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: "2rem", padding: "1.5rem 2rem", borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Lora, serif', fontSize: '1.5rem', color: 'var(--color-primary)' }}>ระบบจัดการหลังบ้าน (DREAM ROOM Manager)</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              ปักหมุดสินค้าบนรูปห้องหลักและมุมย่อย หรือตั้งค่าคลังสินค้าและห้องจัดแสดงได้จากที่นี่
            </p>
          </div>
          <button className="nav-btn-admin" style={{ backgroundColor: "var(--color-danger)" }} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
        
        {/* Dynamic page/room selector and add button */}
        {onRoomChange && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#ffffff', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary)' }}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                เลือกห้องที่กำลังแก้ไข:
              </span>
              <select
                value={currentRoomId}
                onChange={(e) => onRoomChange(e.target.value)}
                className="form-input"
                style={{ 
                  width: '260px', 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.9rem', 
                  borderRadius: '6px', 
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {rooms.map(room => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.styleTitle?.split(" ")[0] || "ห้อง"})
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={() => {
                setAdminTab("rooms");
                setTimeout(() => {
                  const formInput = document.getElementById("new-room-name");
                  if (formInput) {
                    formInput.scrollIntoView({ behavior: "smooth", block: "center" });
                    formInput.focus();
                  }
                }, 100);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease'
              }}
              className="admin-btn-add-page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>เพิ่มหน้า/ห้องใหม่</span>
            </button>
          </div>
        )}
      </div>

      <div className="admin-tabs" style={{ display: 'flex', gap: '1rem', padding: '0 2rem 1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button
          type="button"
          className={`admin-tab-btn ${adminTab === "hotspots" ? "active" : ""}`}
          onClick={() => setAdminTab("hotspots")}
        >
          จัดการพิกัดสินค้า (Hotspot Editor)
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${adminTab === "collage" ? "active" : ""}`}
          onClick={() => setAdminTab("collage")}
        >
          จัดหน้า Collage นิตยสาร (Collage Layout Builder)
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${adminTab === "rooms" ? "active" : ""}`}
          onClick={() => setAdminTab("rooms")}
        >
          จัดการห้อง/พื้นที่ Lookbook (Room Manager)
        </button>
        <button
          type="button"
          className={`admin-tab-btn ${adminTab === "catalog" ? "active" : ""}`}
          onClick={() => setAdminTab("catalog")}
        >
          จัดการคลังสินค้าหลัก (Stock Catalog)
        </button>
      </div>

      {adminTab === "hotspots" && (
        <div className="admin-workspace animate-fade-in">
          {/* Left column: Bounding box editor room canvas */}
          <div className="admin-canvas-card">
            <div className="admin-canvas-instruction">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: 'var(--color-primary)', display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>
                <strong>คลิกเลือกตำแหน่งจุดปักหมุด</strong> บนภาพด้านล่างเพื่อกำหนดตำแหน่งสินค้า คุณสามารถคลิกใหม่เพื่อย้ายจุดได้ทันที
              </span>
            </div>

            {/* Canvas Selector */}
            <div className="admin-canvas-selector">
              <span className="selector-label">เลือกรูปภาพเพื่อติดป้ายราคา:</span>
              <div className="selector-buttons">
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "main" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("main"); resetForm(); }}
                >
                  ภาพห้องหลัก
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "collage-1" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("collage-1"); resetForm(); }}
                >
                  รูปมุมย่อย 1
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "collage-2" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("collage-2"); resetForm(); }}
                >
                  รูปมุมย่อย 2
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "collage-3" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("collage-3"); resetForm(); }}
                >
                  รูปมุมย่อย 3
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "collage-4" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("collage-4"); resetForm(); }}
                >
                  รูปมุมย่อย 4
                </button>
                <button
                  type="button"
                  className={`selector-btn ${activeCanvas === "collage-5" ? "active" : ""}`}
                  onClick={() => { setActiveCanvas("collage-5"); resetForm(); }}
                >
                  รูปมุมย่อย 5
                </button>
              </div>
            </div>

            <div
              ref={imageRef}
              className="admin-room-container"
              onClick={handleCanvasClick}
              style={{ position: 'relative' }}
            >
              {canvasHasImage ? (
                <>
                  <img
                    src={editorImage}
                    alt="Room Pin Editor"
                    className="room-bg-image"
                    style={{ cursor: "pointer" }}
                    draggable="false"
                  />

                  {/* Render existing product pins */}
                  {activeRoomProducts
                    .filter(p => (activeCanvas === "main" ? (!p.canvasType || p.canvasType === "main") : p.canvasType === activeCanvas))
                    .map((p) => {
                      const isSelected = selectedProductId === p.id;
                      const displayX = isSelected && coordX ? parseFloat(coordX) : p.x;
                      const displayY = isSelected && coordY ? parseFloat(coordY) : p.y;

                      return (
                        <div
                          key={p.id}
                          className={`product-hotspot-area admin-pin-editor ${isSelected ? "selected" : ""}`}
                          style={{
                            left: `${displayX}%`,
                            top: `${displayY}%`,
                            zIndex: isSelected ? 20 : 10
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectProductForEditing(p);
                          }}
                          title={`คลิกเพื่อแก้ไข: ${p.name}`}
                        >
                          <div className="ikea-pin">
                            <div className="ikea-pin-inner" style={{
                              backgroundColor: isSelected ? "var(--color-danger)" : "var(--color-primary)"
                            }}></div>
                          </div>
                          <div className="ikea-pin-price-tag" style={{
                            backgroundColor: isSelected ? "var(--color-danger)" : "var(--bg-dark)",
                            opacity: 0.9,
                            pointerEvents: "none"
                          }}>
                            {isSelected ? `${p.name} (ย้ายตำแหน่งแล้ว)` : `${p.name} (${p.price})`}
                          </div>
                        </div>
                      );
                    })}

                  {/* Temporary Pin for new unsaved position */}
                  {!selectedProductId && coordX && coordY && (
                    <div
                      className="product-hotspot-area admin-pin-editor new-pin"
                      style={{
                        left: `${coordX}%`,
                        top: `${coordY}%`,
                        zIndex: 20
                      }}
                    >
                      <div className="ikea-pin" style={{ borderColor: "var(--color-success)" }}>
                        <div className="ikea-pin-inner" style={{ backgroundColor: "var(--color-success)" }}></div>
                      </div>
                      <div className="ikea-pin-price-tag" style={{
                        backgroundColor: "var(--color-success)",
                        opacity: 0.9
                      }}>
                        ตำแหน่งใหม่ (ยังไม่บันทึก)
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="admin-canvas-empty-notice">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>ยังไม่ได้อัปโหลดรูปภาพสำหรับมุมย่อยนี้</p>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    กรุณาไปที่แท็บ <strong>"จัดหน้า Collage นิตยสาร"</strong> เพื่ออัปโหลดรูปภาพก่อน
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Form and list editor */}
          <div className="admin-controls-card">
            <div className="admin-controls-header">
              <h3>สินค้าและพื้นที่ทับซ้อน</h3>
              <div className="admin-controls-actions">
                <button className="admin-btn-secondary" onClick={handleExportBackup} title="ส่งออกข้อมูลสำรอง JSON">
                  ส่งออก
                </button>
                <label className="admin-btn-secondary" style={{ cursor: "pointer" }} title="นำเข้าข้อมูล JSON">
                  นำเข้า
                  <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: "none" }} />
                </label>
                <button className="admin-btn-danger" onClick={handleResetToDefaults} title="รีเซ็ตค่าระบบเริ่มต้น">
                  รีเซ็ต
                </button>
              </div>
            </div>

            {/* Hotspots list */}
            <div className="admin-hotspots-list">
              {activeRoomProducts.length === 0 ? (
                <p style={{ padding: "1rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  ไม่มีรายการสินค้าในห้องขณะนี้ กรุณาลากกล่องสี่เหลี่ยมบนรูปภาพเพื่อเพิ่มชิ้นแรก
                </p>
              ) : (
                activeRoomProducts.map((p) => (
                  <div
                    key={p.id}
                    className={`admin-hotspot-item ${selectedProductId === p.id ? "active" : ""}`}
                    onClick={() => selectProductForEditing(p)}
                  >
                    <div className="admin-hotspot-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span className="admin-hotspot-title">{p.name}</span>
                        <span className={`admin-location-badge ${p.canvasType || 'main'}`} style={{
                          fontSize: '0.65rem',
                          padding: '1px 5px',
                          borderRadius: '10px',
                          fontWeight: 'bold',
                          background: (!p.canvasType || p.canvasType === 'main') ? 'rgba(43,76,48,0.1)' : 'rgba(194,122,77,0.1)',
                          color: (!p.canvasType || p.canvasType === 'main') ? 'var(--color-primary)' : 'var(--color-accent)'
                        }}>
                          {!p.canvasType || p.canvasType === 'main' ? 'ภาพหลัก' : 
                           p.canvasType === 'collage-1' ? 'มุมย่อย 1' : 
                           p.canvasType === 'collage-2' ? 'มุมย่อย 2' : 
                           p.canvasType === 'collage-3' ? 'มุมย่อย 3' : 
                           p.canvasType === 'collage-4' ? 'มุมย่อย 4' : 'มุมย่อย 5'}
                        </span>
                      </div>
                      <span className="admin-hotspot-coords">
                        ราคา: {p.price} | พิกัด: (X: {p.x.toFixed(1)}%, Y: {p.y.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="admin-hotspot-actions">
                      <button
                        className="admin-icon-btn delete"
                        onClick={(e) => handleDeleteProduct(p.id, p.name, e)}
                        title="ลบสินค้านี้"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form Editor */}
            <div className="editor-form-container">
              <h4 className="editor-form-title">
                {selectedProductId ? `แก้ไขข้อมูล: ${name.slice(0, 20)}...` : "เพิ่มสินค้าและวาดขอบเขตใหม่"}
              </h4>

              <form onSubmit={handleSaveProduct}>
                <div className="form-group" style={{ borderBottom: "1px dashed var(--border-color)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <label htmlFor="catalog-select" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>ดึงข้อมูลจากคลังสินค้าหลัก (Stock Catalog)</label>
                  <select
                    id="catalog-select"
                    className="form-input"
                    value={selectedCatalogIdForProduct || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        const item = catalog.find(item => item.id === val);
                        if (item) {
                          setName(item.name);
                          setPrice(item.price);
                          setUrl(item.url || "");
                          setDescription(item.description || "");
                          setImage(item.image || "");
                          setSelectedCatalogIdForProduct(item.id);
                          onAddToast(`ดึงข้อมูลสินค้า "${item.name}" เรียบร้อย`, "success");
                        }
                      } else {
                        setSelectedCatalogIdForProduct(null);
                      }
                    }}
                  >
                    <option value="">-- เลือกสินค้าจากคลังเพื่อดึงข้อมูล --</option>
                    {catalog.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.price})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    * เลือกเพื่อคัดลอกรายละเอียดข้อมูลในคลังมาเติมในช่องด้านล่างอัตโนมัติ สะดวกต่อการระบุพิกัดปักหมุด
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="prod-name">ชื่อสินค้า *</label>
                  <input
                    id="prod-name"
                    type="text"
                    className="form-input"
                    placeholder="ตัวอย่าง: โซฟานุ่มสีครีมผ้า Bouclé"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-price">ราคาสินค้า *</label>
                  <input
                    id="prod-price"
                    type="text"
                    className="form-input"
                    placeholder="ตัวอย่าง: ฿18,500 หรือ 590 บาท"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-url">ลิงก์เว็บสั่งซื้อสินค้าปลายทาง (URL)</label>
                  <input
                    id="prod-url"
                    type="text"
                    className="form-input"
                    placeholder="ตัวอย่าง: www.shopee.co.th/... (ระบบจะเติม https:// ให้โดยอัตโนมัติ)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-desc">รายละเอียดสินค้า (เพื่อแสดงตอนชี้เมาส์)</label>
                  <textarea
                    id="prod-desc"
                    className="form-input"
                    rows="2"
                    style={{ resize: "none" }}
                    placeholder="เขียนอธิบายสรรพคุณสินค้าสั้นๆ ให้สวยงามน่าดึงดูด..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="prod-image">รูปภาพสินค้า (อัปโหลดไฟล์ หรือใส่ URL)</label>
                  <div className="image-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setImage(event.target.result);
                            onAddToast("อัปโหลดรูปภาพสินค้าสำเร็จ", "success");
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{ display: "none" }}
                      id="prod-image-file"
                    />
                    <label htmlFor="prod-image-file" className="admin-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                      เลือกไฟล์...
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="หรือใส่ URL รูปภาพ..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {image && (
                    <div className="form-image-preview" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={image} alt="Preview" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button type="button" className="btn-cancel" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setImage("")}>ลบรูปภาพ</button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="prod-display-type">รูปแบบการแสดงผล (Display Style) *</label>
                  <select
                    id="prod-display-type"
                    className="form-input"
                    value={displayType}
                    onChange={(e) => setDisplayType(e.target.value)}
                    required
                  >
                    <option value="both">แสดงรูปภาพและรายละเอียดข้อความ</option>
                    <option value="text">แสดงเฉพาะชื่อและราคา (ข้อความอย่างเดียว)</option>
                    <option value="image">แสดงเฉพาะรูปภาพ</option>
                  </select>
                </div>

                <div className="admin-coordinates-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label htmlFor="prod-x">แกน X (%)</label>
                    <input
                      id="prod-x"
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={coordX}
                      onChange={(e) => setCoordX(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="prod-y">แกน Y (%)</label>
                    <input
                      id="prod-y"
                      type="number"
                      step="0.1"
                      className="form-input"
                      value={coordY}
                      onChange={(e) => setCoordY(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="editor-actions-row">
                  <button type="submit" className="btn-primary">
                    {selectedProductId ? "บันทึกข้อมูลและขนาด" : "บันทึกข้อมูลขอบเขต"}
                  </button>
                  <button type="button" className="btn-cancel" onClick={resetForm}>
                    เคลียร์/ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {adminTab === "collage" && (
        <div className="admin-workspace admin-collage-workspace animate-fade-in">
          {/* Left column: Collage Editor Layout Preview */}
          <div className="admin-canvas-card">
            <div className="admin-canvas-instruction" style={{ marginBottom: '1.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', color: 'var(--color-primary)', display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              <span>
                <strong>จัดเลย์เอาต์ภาพนิตยสาร (Editorial Collage)</strong>: เลือกรูปภาพรายละเอียดห้องของคุณมาใส่ให้เต็มพอร์ตโฟลิโอ 5 ช่อง (เลย์เอาต์ 5 รูปมุมสะท้อนรายละเอียดตามดีไซน์ล่าสุด)
              </span>
            </div>

            <div className="editorial-collage-grid admin-mode">
              {/* Left Column (Slots 1 & 2) */}
              <div className="collage-col-side">
                {/* Slot 1 */}
                <div className="collage-slot small-slot admin-slot">
                  {tempCollage.img1 ? (
                    <>
                      <img src={tempCollage.img1} alt="Slot 1" className="collage-img" />
                      <div className="collage-slot-overlay flex-column">
                        <label className="overlay-action-btn upload-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span>อัปโหลดรูปใหม่</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img1", e)} style={{ display: 'none' }} />
                        </label>
                        <button
                          type="button"
                          className="overlay-action-btn delete-btn"
                          onClick={() => handleRemoveSlotImage("img1")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>ลบรูปภาพ</span>
                        </button>
                        <button
                          type="button"
                          className="overlay-action-btn tag-btn"
                          onClick={() => handleNavigateToTagging("collage-1")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>ปักหมุดราคา ({getHotspotCount("collage-1")} ชิ้น)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="collage-slot-uploader">
                      <div className="uploader-plus">+</div>
                      <span>อัปโหลดรูป 1</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img1", e)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                {/* Slot 2 */}
                <div className="collage-slot small-slot admin-slot">
                  {tempCollage.img2 ? (
                    <>
                      <img src={tempCollage.img2} alt="Slot 2" className="collage-img" />
                      <div className="collage-slot-overlay flex-column">
                        <label className="overlay-action-btn upload-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span>อัปโหลดรูปใหม่</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img2", e)} style={{ display: 'none' }} />
                        </label>
                        <button
                          type="button"
                          className="overlay-action-btn delete-btn"
                          onClick={() => handleRemoveSlotImage("img2")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>ลบรูปภาพ</span>
                        </button>
                        <button
                          type="button"
                          className="overlay-action-btn tag-btn"
                          onClick={() => handleNavigateToTagging("collage-2")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>ปักหมุดราคา ({getHotspotCount("collage-2")} ชิ้น)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="collage-slot-uploader">
                      <div className="uploader-plus">+</div>
                      <span>อัปโหลดรูป 2</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img2", e)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Center Column (Slot 3 - Tall) */}
              <div className="collage-col-center">
                {/* Slot 3 */}
                <div className="collage-slot tall-slot admin-slot">
                  {tempCollage.img3 ? (
                    <>
                      <img src={tempCollage.img3} alt="Slot 3" className="collage-img" />
                      <div className="collage-slot-overlay flex-column">
                        <label className="overlay-action-btn upload-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span>อัปโหลดรูปใหม่</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img3", e)} style={{ display: 'none' }} />
                        </label>
                        <button
                          type="button"
                          className="overlay-action-btn delete-btn"
                          onClick={() => handleRemoveSlotImage("img3")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>ลบรูปภาพ</span>
                        </button>
                        <button
                          type="button"
                          className="overlay-action-btn tag-btn"
                          onClick={() => handleNavigateToTagging("collage-3")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>ปักหมุดราคา ({getHotspotCount("collage-3")} ชิ้น)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="collage-slot-uploader">
                      <div className="uploader-plus">+</div>
                      <span>อัปโหลดรูป 3 (ทรงสูง)</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img3", e)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>

              {/* Right Column (Slots 4 & 5) */}
              <div className="collage-col-side">
                {/* Slot 4 */}
                <div className="collage-slot small-slot admin-slot">
                  {tempCollage.img4 ? (
                    <>
                      <img src={tempCollage.img4} alt="Slot 4" className="collage-img" />
                      <div className="collage-slot-overlay flex-column">
                        <label className="overlay-action-btn upload-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span>อัปโหลดรูปใหม่</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img4", e)} style={{ display: 'none' }} />
                        </label>
                        <button
                          type="button"
                          className="overlay-action-btn delete-btn"
                          onClick={() => handleRemoveSlotImage("img4")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>ลบรูปภาพ</span>
                        </button>
                        <button
                          type="button"
                          className="overlay-action-btn tag-btn"
                          onClick={() => handleNavigateToTagging("collage-4")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>ปักหมุดราคา ({getHotspotCount("collage-4")} ชิ้น)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="collage-slot-uploader">
                      <div className="uploader-plus">+</div>
                      <span>อัปโหลดรูป 4</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img4", e)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                {/* Slot 5 */}
                <div className="collage-slot small-slot admin-slot">
                  {tempCollage.img5 ? (
                    <>
                      <img src={tempCollage.img5} alt="Slot 5" className="collage-img" />
                      <div className="collage-slot-overlay flex-column">
                        <label className="overlay-action-btn upload-btn">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                            <circle cx="12" cy="13" r="4"></circle>
                          </svg>
                          <span>อัปโหลดรูปใหม่</span>
                          <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img5", e)} style={{ display: 'none' }} />
                        </label>
                        <button
                          type="button"
                          className="overlay-action-btn delete-btn"
                          onClick={() => handleRemoveSlotImage("img5")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          <span>ลบรูปภาพ</span>
                        </button>
                        <button
                          type="button"
                          className="overlay-action-btn tag-btn"
                          onClick={() => handleNavigateToTagging("collage-5")}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>ปักหมุดราคา ({getHotspotCount("collage-5")} ชิ้น)</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="collage-slot-uploader">
                      <div className="uploader-plus">+</div>
                      <span>อัปโหลดรูป 5</span>
                      <input type="file" accept="image/*" onChange={(e) => handleSlotImageChange("img5", e)} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Action & Info */}
          <div className="admin-controls-card">
            <div className="admin-controls-header">
              <h3>บันทึกการจัดหน้า</h3>
            </div>
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                รูปภาพที่ท่านเลือกอัปโหลด จะถูกจัดเก็บเป็น Base64 String ภายในเครื่องคอมพิวเตอร์ของคุณ (localStorage)
                และจะนำไปเรียงแสดงผลเป็น Collage 5 ช่องตามเลย์เอาต์นิตยสาร
              </p>
              <button
                type="button"
                className="btn-submit"
                onClick={handleSaveCollage}
                style={{ background: 'var(--color-primary)', display: 'block', width: '100%' }}
              >
                บันทึกเลย์เอาต์ (Save Layout)
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  if (window.confirm("ต้องการย้อนกลับไปใช้หน้าจัดวางภาพดั้งเดิมใช่หรือไม่?")) {
                    setTempCollage(roomCollages[currentRoomId] || {
                      img1: "", img2: "", img3: "", img4: "", img5: ""
                    });
                  }
                }}
                style={{ width: '100%' }}
              >
                เคลียร์การจัดวางใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {adminTab === "rooms" && (
        <div className="admin-workspace admin-rooms-workspace animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Left Column: Create New Room Form */}
          <div className="admin-canvas-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'Lora, serif', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              เพิ่มห้อง / พื้นที่จัดแสดงใหม่
            </h3>
            
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>ชื่อห้องจัดแสดง *</label>
                  <input
                    id="new-room-name"
                    type="text"
                    className="form-input"
                    placeholder="ตัวอย่าง: BOHEMIAN BALCONY"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ชื่อหัวข้อสไตล์ *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="ตัวอย่าง: ปรับระเบียงเป็นสวนโบฮีเมียน"
                    value={newRoomStyleTitle}
                    onChange={(e) => setNewRoomStyleTitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>รูปภาพห้องหลัก *</label>
                <div className="image-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setNewRoomImage(event.target.result);
                          onAddToast("อัปโหลดรูปห้องหลักสำเร็จ", "success");
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: "none" }}
                    id="new-room-image-file"
                  />
                  <label htmlFor="new-room-image-file" className="admin-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                    อัปโหลดรูปหลัก...
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="หรือใส่ URL รูปห้อง..."
                    value={newRoomImage}
                    onChange={(e) => setNewRoomImage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
                {newRoomImage && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img src={newRoomImage} alt="Main room preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>คำอธิบายโดยย่อ (Description)</label>
                <textarea
                  className="form-input"
                  rows="2"
                  placeholder="เขียนสรุปบรรยากาศหรืออารมณ์ของห้อง..."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>คอนเซปต์สไตล์ (Concept Title)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="เช่น Scandinavian / Wabi-Sabi"
                    value={newRoomConcept}
                    onChange={(e) => setNewRoomConcept(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>เคล็ดลับการจัดห้อง (Design Tips)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="คำแนะนำในการแต่งตาม เช่น หลีกเลี่ยงแสงจ้า..."
                    value={newRoomTips}
                    onChange={(e) => setNewRoomTips(e.target.value)}
                  />
                </div>
              </div>

              {/* Color Palettes inputs */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold' }}>โทนสีหลัก (Color Palette - 3 สี)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" placeholder="ชื่อสี 1 (เช่น เบจ)" value={color1Name} onChange={(e) => setColor1Name(e.target.value)} style={{ flex: 1 }} />
                    <input type="color" value={color1Hex || "#cccccc"} onChange={(e) => setColor1Hex(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
                    <input type="text" className="form-input" placeholder="#HEX 1" value={color1Hex} onChange={(e) => setColor1Hex(e.target.value)} style={{ width: '100px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" placeholder="ชื่อสี 2" value={color2Name} onChange={(e) => setColor2Name(e.target.value)} style={{ flex: 1 }} />
                    <input type="color" value={color2Hex || "#cccccc"} onChange={(e) => setColor2Hex(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
                    <input type="text" className="form-input" placeholder="#HEX 2" value={color2Hex} onChange={(e) => setColor2Hex(e.target.value)} style={{ width: '100px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="form-input" placeholder="ชื่อสี 3" value={color3Name} onChange={(e) => setColor3Name(e.target.value)} style={{ flex: 1 }} />
                    <input type="color" value={color3Hex || "#cccccc"} onChange={(e) => setColor3Hex(e.target.value)} style={{ width: '40px', height: '40px', padding: 0, border: 'none', cursor: 'pointer' }} />
                    <input type="text" className="form-input" placeholder="#HEX 3" value={color3Hex} onChange={(e) => setColor3Hex(e.target.value)} style={{ width: '100px' }} />
                  </div>
                </div>
              </div>

              {/* Key Features inputs */}
              <div className="form-group">
                <label style={{ fontWeight: 'bold' }}>เอกลักษณ์สำคัญ (Key Features - 3 อย่าง)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input type="text" className="form-input" placeholder="เช่น 1. ใช้เฟอร์นิเจอร์ไม้ไผ่ธรรมชาติ" value={feat1} onChange={(e) => setFeat1(e.target.value)} />
                  <input type="text" className="form-input" placeholder="เช่น 2. ประดับต้นตระกูลเฟิร์นใบเล็ก" value={feat2} onChange={(e) => setFeat2(e.target.value)} />
                  <input type="text" className="form-input" placeholder="เช่น 3. ใช้หมอนอิงลวดลายชนเผ่าสีสด" value={feat3} onChange={(e) => setFeat3(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="btn-submit" style={{ background: 'var(--color-primary)', marginTop: '1rem' }}>
                สร้างห้องจัดแสดงใหม่ (Create Room)
              </button>
            </form>
          </div>

          {/* Right Column: List of existing rooms with Delete actions */}
          <div className="admin-controls-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.2rem', fontFamily: 'Lora, serif' }}>
              ห้องจัดแสดงปัจจุบัน ({rooms.length})
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '550px' }}>
              {rooms.map((room) => (
                <div
                  key={room.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.8rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img
                    src={room.image || roomImg}
                    alt={room.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {room.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {room.styleTitle}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room.id, room.name)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--color-danger)',
                      border: 'none',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}
                  >
                    ลบ
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminTab === "catalog" && (
        <div className="admin-workspace admin-catalog-workspace animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Left Column: Catalog List */}
          <div className="admin-canvas-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'Lora, serif' }}>
                รายการสินค้าในคลังหลัก ({catalog.length})
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                * สามารถนำไปเลือกดึงข้อมูลตอนปักหมุดราคาได้
              </p>
            </div>
            
            <div className="catalog-grid-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem', overflowY: 'auto', maxHeight: '600px', paddingRight: '0.5rem' }}>
              {catalog.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  <p>ไม่มีสินค้าในคลังขณะนี้ กรุณาเพิ่มสินค้าชิ้นแรกของคุณ</p>
                </div>
              ) : (
                catalog.map((item) => (
                  <div
                    key={item.id}
                    className={`catalog-stock-card ${selectedCatalogId === item.id ? 'active' : ''}`}
                    onClick={() => selectCatalogItemForEditing(item)}
                    style={{
                      cursor: 'pointer',
                      border: selectedCatalogId === item.id ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedCatalogId === item.id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      minHeight: '280px',
                      flexShrink: 0
                    }}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '120px', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: '100%', height: '120px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
                        ไม่มีรูปสินค้า
                      </div>
                    )}
                    <div style={{ padding: '0.8rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                          {item.name}
                        </h4>
                        <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                          {item.price}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.description || 'ไม่มีคำอธิบายเพิ่มเติม'}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.8rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <button
                          type="button"
                          className="admin-icon-btn delete"
                          onClick={(e) => handleDeleteCatalogItem(item.id, item.name, e)}
                          title="ลบออกจากคลังหลัก"
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--color-danger)',
                            border: 'none',
                            padding: '0.3rem 0.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.7rem'
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Add/Edit catalog item form */}
          <div className="admin-controls-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.2rem', fontFamily: 'Lora, serif' }}>
              {selectedCatalogId ? 'แก้ไขข้อมูลคลังสินค้า' : 'เพิ่มสินค้าลงคลังใหม่'}
            </h3>
            
            <form onSubmit={handleSaveCatalogItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label htmlFor="cat-name">ชื่อสินค้า *</label>
                <input
                  id="cat-name"
                  type="text"
                  className="form-input"
                  placeholder="ตัวอย่าง: เก้าอี้หวายสานโมเดิร์น"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-price">ราคาสินค้า *</label>
                <input
                  id="cat-price"
                  type="text"
                  className="form-input"
                  placeholder="ตัวอย่าง: ฿3,200 หรือ 590 บาท"
                  value={catPrice}
                  onChange={(e) => setCatPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-url">ลิงก์เว็บสั่งซื้อสินค้า (URL)</label>
                <input
                  id="cat-url"
                  type="text"
                  className="form-input"
                  placeholder="ตัวอย่าง: www.shopee.co.th/..."
                  value={catUrl}
                  onChange={(e) => setCatUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-desc">รายละเอียดสินค้า (เพื่อแสดงตอนชี้เมาส์)</label>
                <textarea
                  id="cat-desc"
                  className="form-input"
                  rows="3"
                  style={{ resize: "none" }}
                  placeholder="เขียนอธิบายสรรพคุณสินค้าหรือรายละเอียดเด่น..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cat-image">รูปภาพสินค้า (อัปโหลด หรือใส่ URL)</label>
                <div className="image-upload-wrapper" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCatImage(event.target.result);
                          onAddToast("อัปโหลดรูปภาพสินค้าสำเร็จ", "success");
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ display: "none" }}
                    id="cat-image-file"
                  />
                  <label htmlFor="cat-image-file" className="admin-btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                    เลือกไฟล์...
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="หรือใส่ URL รูปภาพ..."
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    style={{ flex: 1 }}
                  />
                </div>
                {catImage && (
                  <div className="form-image-preview" style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={catImage} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    <button type="button" className="btn-cancel" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setCatImage("")}>ลบรูปภาพ</button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn-submit" style={{ flex: 1, background: 'var(--color-primary)' }}>
                  {selectedCatalogId ? "อัปเดตสินค้าในคลัง" : "เพิ่มสินค้าเข้าคลัง"}
                </button>
                <button type="button" className="btn-cancel" onClick={resetCatalogForm} style={{ flex: 0.5 }}>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
