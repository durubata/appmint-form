import React, { useState, useEffect } from 'react';

export const ShadowElement = () => {
  const [shadowType, setShadowType] = useState('box-shadow');
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState(0.5);
  const [shadowBlur, setShadowBlur] = useState(10);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowX, setShadowX] = useState(10);
  const [shadowY, setShadowY] = useState(10);
  const [isInset, setIsInset] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [cssCode, setCssCode] = useState('');

  useEffect(() => {
    const color = shadowColor + Math.round(shadowOpacity * 255).toString(16).padStart(2, '0');
    let shadowValue = '';

    if (shadowType === 'box-shadow') {
      shadowValue = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${color}${isInset ? ' inset' : ''}`;
    } else {
      shadowValue = `${shadowX}px ${shadowY}px ${shadowBlur}px ${color}`;
    }

    setCssCode(`${shadowType}: ${shadowValue};`);
  }, [shadowType, shadowColor, shadowOpacity, shadowBlur, shadowSpread, shadowX, shadowY, isInset]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const canvasRect = e.currentTarget.getBoundingClientRect();
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    setShadowX(Math.round(mouseX - centerX));
    setShadowY(Math.round(mouseY - centerY));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getRgbaColor = () => {
    const r = parseInt(shadowColor.slice(1, 3), 16);
    const g = parseInt(shadowColor.slice(3, 5), 16);
    const b = parseInt(shadowColor.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;
  };

  return (
    <div className="flex flex-col w-full max-w-xl p-2 gap-2 border border-gray-200 rounded-lg bg-white text-sm">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            className={`px-2 py-0.5 text-xs rounded ${shadowType === 'box-shadow' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setShadowType('box-shadow')}
          >
            Box
          </button>
          <button
            className={`px-2 py-0.5 text-xs rounded ${shadowType === 'text-shadow' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setShadowType('text-shadow')}
          >
            Text
          </button>
        </div>
        <div className="text-xs">
          <button
            className="px-2 py-0.5 bg-blue-500 text-white rounded"
            onClick={() => navigator.clipboard && navigator.clipboard.writeText(cssCode)}
          >
            Copy CSS
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Canvas for shadow positioning */}
        <div
          className="relative w-32 h-32 bg-gray-100 border border-gray-300 rounded cursor-move flex-shrink-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {shadowType === 'box-shadow' ? (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded border border-gray-300"
              style={{
                boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${getRgbaColor()}${isInset ? ' inset' : ''}`
              }}
            />
          ) : (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold"
              style={{
                textShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${getRgbaColor()}`
              }}
            >
              T
            </div>
          )}

          <div className="absolute top-1/2 left-1/2 w-px h-px">
            <div className="absolute w-1.5 h-1.5 bg-red-500 rounded-full transform -translate-x-0.5 -translate-y-0.5" />
            <div
              className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full transform -translate-x-0.5 -translate-y-0.5"
              style={{ left: shadowX, top: shadowY }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-1.5 text-xs">
          <div className="flex gap-1 items-center">
            <label className="w-16">Color:</label>
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded"
            />
            <input
              type="text"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              className="w-16 px-1 py-0.5 border border-gray-300 rounded text-xs"
            />
            <label className="ml-2">Opacity:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={shadowOpacity}
              onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
              className="w-16"
            />
            <span className="w-8 text-right">{Math.round(shadowOpacity * 100)}%</span>
          </div>

          <div className="flex gap-1 items-center">
            <label className="w-16">Blur:</label>
            <input
              type="range"
              min="0"
              max="50"
              value={shadowBlur}
              onChange={(e) => setShadowBlur(parseInt(e.target.value))}
              className="w-32"
            />
            <span className="w-8 text-right">{shadowBlur}px</span>

            {shadowType === 'box-shadow' && (
              <>
                <label className="ml-2">Spread:</label>
                <input
                  type="range"
                  min="-25"
                  max="25"
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(parseInt(e.target.value))}
                  className="w-20"
                />
                <span className="w-8 text-right">{shadowSpread}px</span>
              </>
            )}
          </div>

          <div className="flex gap-1 items-center">
            <label className="w-16">Offset:</label>
            <span className="mr-1">X:</span>
            <input
              type="number"
              value={shadowX}
              onChange={(e) => setShadowX(parseInt(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
            />
            <span className="mx-1">Y:</span>
            <input
              type="number"
              value={shadowY}
              onChange={(e) => setShadowY(parseInt(e.target.value) || 0)}
              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-xs"
            />

            {shadowType === 'box-shadow' && (
              <div className="flex items-center ml-2">
                <input
                  type="checkbox"
                  id="inset"
                  checked={isInset}
                  onChange={(e) => setIsInset(e.target.checked)}
                  className="mr-1"
                />
                <label htmlFor="inset" className="text-xs">Inset</label>
              </div>
            )}
          </div>

          <div className="mt-1 text-xs">
            <pre className="p-1 bg-gray-100 rounded font-mono overflow-x-auto border border-gray-200">
              {cssCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
