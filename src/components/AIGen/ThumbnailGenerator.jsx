import React, { useState, useEffect } from "react";
import { useGlobalState } from "../common/GlobalStateContext"; // Import GlobalStateContext

const ThumbnailGenerator = () => {
  const { theme } = useGlobalState(); // Get theme from GlobalStateContext
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [text, setText] = useState("Your Text Here");
  const [textColor, setTextColor] = useState("text-white");
  const [fontSize, setFontSize] = useState("text-2xl");
  const [textShadow, setTextShadow] = useState("");
  const [bgColor, setBgColor] = useState("bg-transparent");
  const [borderColor, setBorderColor] = useState("border-white");
  const [blur, setBlur] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 10, y: 10 });
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [overlays, setOverlays] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [draggingText, setDraggingText] = useState(false);
  const [draggingOverlay, setDraggingOverlay] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
    }
  };

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  }, [image]);

  const handleMouseDown = (e) => {
    // Only initiate dragging when mouse is pressed down on the text element
    setDraggingText(true);
  };

  const handleMouseMove = (e) => {
    // Allow moving the text when draggingText state is true
    if (draggingText) {
      const boundingRect = e.currentTarget.getBoundingClientRect();
      setTextPosition({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      });
    }
  };

  const handleMouseUp = () => {
    // Stop dragging when mouse is released
    setDraggingText(false);
  };

  const handleOverlayImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newOverlay = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        x: 50,
        y: 50,
      };
      setOverlays((prev) => [...prev, newOverlay]);
    }
  };

  const handleOverlayMouseDown = (id) => {
    setDraggingId(id);
  };

  const handleOverlayMouseUp = () => {
    setDraggingId(null);
  };

  const handleOverlayMouseMove = (e) => {
    if (!draggingId) return;
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const newOverlays = overlays.map((overlay) =>
      overlay.id === draggingId
        ? {
            ...overlay,
            x: e.clientX - boundingRect.left,
            y: e.clientY - boundingRect.top,
          }
        : overlay
    );
    setOverlays(newOverlays);
  };

  const handleDownload = () => {
    if (!image) return;
    // Create a canvas element
    const canvas = document.createElement('canvas');
    // Ensure canvas size matches preview (image's native aspect ratio)
    canvas.width = 2880;
    canvas.height = 1620;
    const ctx = canvas.getContext('2d');

    // Draw the uploaded image with all filters applied (brightness, contrast, blur)
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      // Apply filters before drawing image
      ctx.save();
      ctx.filter = `brightness(${brightness}) contrast(${contrast})${blur ? ' blur(5px)' : ''}`;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      // --- Font size and family logic (match preview) ---
      // Map fontSize string to px values (should match preview logic)
      let fontPx = 32;
      if (fontSize.includes("small")) fontPx = 16;
      else if (fontSize.includes("medium")) fontPx = 24;
      else if (fontSize.includes("large") && !fontSize.includes("extra")) fontPx = 32;
      else if (fontSize.includes("extra-large")) fontPx = 40;
      else if (fontSize.includes("huge") && !fontSize.includes("extra")) fontPx = 48;
      else if (fontSize.includes("extra-huge")) fontPx = 64;
      else if (fontSize.includes("giant")) fontPx = 80;
      // Use fontFamily directly (from select)
      ctx.font = `${fontPx}px ${fontFamily}`;
      ctx.textBaseline = "top";

      // --- Text shadow (as per preview) ---
      if (textShadow === "shadow-dark") {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      } else if (textShadow === "shadow-darker") {
        ctx.shadowColor = "rgba(0,0,0,0.7)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
      } else if (textShadow === "shadow-darkest") {
        ctx.shadowColor = "rgba(0,0,0,1)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // --- Text position and background/border ---
      // These paddings should match preview's style (4px 8px)
      const paddingX = 16, paddingY = 10;
      const metrics = ctx.measureText(text);
      // Height estimation: use fontPx (px) for line height
      const textWidth = metrics.width;
      const textHeight = fontPx;
      // Text position: use exact pixel values from state (matches preview)
      const textX = textPosition.x;
      const textY = textPosition.y;

      // Draw background color under text if not transparent (as per preview)
      if (
        bgColor &&
        bgColor !== "bg-transparent" &&
        bgColor !== "#00000000"
      ) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = bgColor;
        ctx.fillRect(
          textX - paddingX,
          textY - paddingY,
          textWidth + 2 * paddingX,
          textHeight + 2 * paddingY
        );
        ctx.globalAlpha = 1.0;
        ctx.restore();
      }
      // Draw border if not transparent or white (match preview logic)
      if (
        borderColor &&
        borderColor !== "border-white" &&
        borderColor !== "border-transparent" &&
        borderColor !== "#ffffff" &&
        borderColor !== "#fff" &&
        borderColor !== "#00000000"
      ) {
        ctx.save();
        ctx.strokeStyle = borderColor.startsWith("border-")
          ? borderColor.replace("border-", "#")
          : borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          textX - paddingX,
          textY - paddingY,
          textWidth + 2 * paddingX,
          textHeight + 2 * paddingY
        );
        ctx.restore();
      }
      // Draw text (color as per preview)
      ctx.save();
      ctx.fillStyle = textColor;
      ctx.fillText(text, textX, textY);
      ctx.restore();

      // --- Draw overlays (logos) matching preview size and position ---
      let loadedCount = 0;
      if (!overlays || overlays.length === 0) {
        setTimeout(() => {
          const downloadUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'thumbnail.png';
          link.click();
        }, 100);
        return;
      }
      overlays.forEach((overlay) => {
        const overlayImg = new Image();
        overlayImg.crossOrigin = "anonymous";
        overlayImg.src = overlay.url;
        overlayImg.onload = () => {
          // Overlay size: 100x100 px (matches preview: w-20 h-20 = 80px, but 100px in code)
          // To match preview exactly, use 80x80 px for overlays, since w-20 h-20 = 5*16=80px
          // If you want to match the preview's Tailwind w-20/h-20, use 80px:
          ctx.drawImage(overlayImg, overlay.x, overlay.y, 80, 80);
          loadedCount++;
          if (loadedCount === overlays.length) {
            setTimeout(() => {
              const downloadUrl = canvas.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'thumbnail.png';
              link.click();
            }, 100);
          }
        };
      });
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const isDark = theme === "dark"; // Check if the theme is dark
  return (
    <>
      <div className={`flex justify-center items-center min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-100"} p-8`}>
        <div className={`w-full ${isDark ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-black/40" : "bg-gray-100 shadow-gray-300"} p-10 rounded-lg shadow-xl`}>
          <h2 className={`text-center text-3xl font-bold mb-8 ${isDark ? "text-white" : "text-gray-800"}`}>
            Thumbnail Generator
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={` block text-lg font-medium mb-2 ${isDark ? " text-gray-100" : " text-gray-900"}`}>
                Upload Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className={`block w-full text-sm ${isDark ? "file:text-white file:bg-gray-500 file:border-gray-700" : "file:text-gray-700 file:bg-gray-50 file:border-gray-300"} file:py-3 file:px-6 file:rounded-lg shadow-sm`}
              />
            </div>

            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Enter Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className={`w-full px-6 py-3 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                placeholder="Enter Text Here"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text Color */}
              <div>
                <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                  Text Color
                </label>
                <input
                  type="color"
                  onChange={(e) => setTextColor(e.target.value)}
                  value={textColor}
                  className={`w-full h-12 p-2 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                />
              </div>

              {/* Font Size */}
              <div>
                <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                  Font Size
                </label>
                <select
                  onChange={(e) => setFontSize(e.target.value)}
                  value={fontSize}
                  className={`w-full px-6 py-3 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                >
                  <option value="text-small">Small</option>
                  <option value="text-medium">Medium</option>
                  <option value="text-large">Large</option>
                  <option value="text-extra-large">Extra Large</option>
                  <option value="text-huge">Huge</option>
                  <option value="text-extra-huge">Extra Huge</option>
                  <option value="text-giant">Giant</option>
                </select>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Font Style
              </label>
              <select
                onChange={(e) => setFontFamily(e.target.value)}
                value={fontFamily}
                className={`w-full px-6 py-3 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                style={{ fontFamily: fontFamily }}
              >
                <option
                  value='"Roboto", sans-serif'
                  style={{ fontFamily: '"Roboto", sans-serif' }}
                >
                  Roboto
                </option>
                <option
                  value='"Playfair Display", serif'
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Playfair Display
                </option>
                <option
                  value='"Pacifico", cursive'
                  style={{ fontFamily: '"Pacifico", cursive' }}
                >
                  Pacifico
                </option>
                <option
                  value='"Orbitron", sans-serif'
                  style={{ fontFamily: '"Orbitron", sans-serif' }}
                >
                  Orbitron
                </option>
                <option
                  value='"Open Sans", sans-serif'
                  style={{ fontFamily: '"Open Sans", sans-serif' }}
                >
                  Open Sans
                </option>
                <option
                  value='"Courier Prime", monospace'
                  style={{ fontFamily: '"Courier Prime", monospace' }}
                >
                  Courier Prime
                </option>
                <option
                  value='"Lobster", cursive'
                  style={{ fontFamily: '"Lobster", cursive' }}
                >
                  Lobster
                </option>
                <option
                  value='"Raleway", sans-serif'
                  style={{ fontFamily: '"Raleway", sans-serif' }}
                >
                  Raleway
                </option>
                <option
                  value='"Rubik Mono One", sans-serif'
                  style={{ fontFamily: '"Rubik Mono One", sans-serif' }}
                >
                  Rubik Mono One
                </option>
              </select>
            </div>

            {/* Text Shadow */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Text Shadow
              </label>
              <select
                onChange={(e) => setTextShadow(e.target.value)}
                value={textShadow}
                className={`w-full px-6 py-3 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
              >
                <option value="">None</option>
                <option value="shadow-dark">Dark</option>
                <option value="shadow-darker">Darker</option>
                <option value="shadow-darkest">Darkest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Background Color */}
              <div>
                <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                  Background Color
                </label>
                <input
                  type="color"
                  onChange={(e) => setBgColor(e.target.value)}
                  value={bgColor}
                  className={`w-full h-12 p-2 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                />
              </div>

              {/* Border Color */}
              <div>
                <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                  Border Color
                </label>
                <input
                  type="color"
                  onChange={(e) => setBorderColor(e.target.value)}
                  value={borderColor}
                  className={`w-full h-12 p-2 border-2 ${isDark ? "border-gray-700 bg-gray-500 text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-sm`}
                />
              </div>
            </div>

            {/* Upload Additional Image Overlays */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Add Logo
              </label>
              <input
                type="file"
                onChange={handleOverlayImageChange}
                className={`block w-full text-sm ${isDark ? "file:text-white file:bg-gray-500  file:border-gray-700" : "text-gray-700 file:bg-gray-50 file:border-gray-300"} file:py-3 file:px-6 file:rounded-lg shadow-sm`}
              />
            </div>

            {/* Blur */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Apply Blur Effect
              </label>
              <input
                type="checkbox"
                checked={blur}
                onChange={() => setBlur(!blur)}
                className={`${isDark ? "bg-gray-500 text-white" : "bg-white text-black"} w-6 h-6`}
              />
            </div>

            {/* Brightness */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Brightness
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(e.target.value)}
                className={`${isDark ? "bg-gray-500 text-white" : "bg-white text-black"} w-full`}
              />
            </div>

            {/* Contrast */}
            <div>
              <label className={`block text-lg font-medium ${isDark ? "text-gray-100" : "text-gray-900"} mb-2`}>
                Contrast
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                className={`${isDark ? "bg-gray-500 text-white" : "bg-white text-black"} w-full`}
              />
            </div>

            <div
              className="mt-6 relative"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <div
                className={`relative rounded-lg overflow-hidden ${bgColor} ${borderColor} border`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  aspectRatio: image ? `${imageDimensions.width} / ${imageDimensions.height}` : '16 / 9',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: image ? `url(${image})` : "none",
                    backgroundSize: "contain",  // This ensures the image keeps its aspect ratio
                    backgroundPosition: "center",  // Centers the image
                    backgroundRepeat: "no-repeat",  // Prevents the image from repeating
                    filter: `brightness(${brightness}) contrast(${contrast}) ${blur ? "blur(1px)" : ""}`,
                    zIndex: 0,
                  }}
                ></div>

                {/* Text Content */}
                <div
                  className={`${fontSize} ${textShadow} absolute`}
                  style={{
                    color: textColor,
                    fontFamily: fontFamily,
                    top: `${textPosition.y}px`,
                    left: `${textPosition.x}px`,
                    cursor: "move",
                    border: "2px solid",
                    borderColor: borderColor.replace("border-", ""),
                    padding: "4px 8px",
                    borderRadius: "8px",
                    backgroundColor: bgColor,
                    zIndex: 10,
                  }}
                  onMouseDown={handleMouseDown}
                >
                  {text}
                </div>

                {/* Overlay Images */}
                {overlays.map((overlay) => (
                  <img
                    key={overlay.id}
                    src={overlay.url}
                    alt="Overlay"
                    className="absolute w-20 h-20 object-contain"
                    style={{
                      transform: `translate(${overlay.x}px, ${overlay.y}px)`,
                      zIndex: 20,
                    }}
                    onMouseDown={() => handleOverlayMouseDown(overlay.id)}
                    onMouseMove={handleOverlayMouseMove}
                    onMouseUp={handleOverlayMouseUp}
                  />
                ))}
              </div>
            </div>

            <div
              type="button"
              
              className="disabled  bg-blue-500 text-white px-6 py-3 rounded-lg mt-6 w-full focus:outline-none"
            >
             <center> Take A ScreenShot</center>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ThumbnailGenerator;