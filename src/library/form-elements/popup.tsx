import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const PopupPortal = ({ children, position }) => {
    return ReactDOM.createPortal(
        <div style={position} className="popup-content">
            {children}
        </div>,
        document.body
    );
};

export const Popup = (props: { children }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({});
    const buttonRef = useRef(null);

    useEffect(() => {
        if (showPopup) {
            adjustPopupPosition();
        }
    }, [showPopup]);

    const adjustPopupPosition = () => {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const newPosition = { top: buttonRect.bottom, left: buttonRect.left };
        const estimatedPopupHeight = 200; // Assuming a fixed height for the popup
        const estimatedPopupWidth = 300; // Assuming a fixed width for the popup

        // Adjust if the popup is going out of the bottom of the viewport
        if (buttonRect.bottom + estimatedPopupHeight > viewportHeight) {
            newPosition.top = buttonRect.top - estimatedPopupHeight;
        }

        // Adjust if the popup is going out of the right of the viewport
        if (buttonRect.left + estimatedPopupWidth > viewportWidth) {
            newPosition.left = viewportWidth - estimatedPopupWidth;
        }

        // Prevent negative top values
        newPosition.top = Math.max(newPosition.top, 0);
        // Prevent negative left values
        newPosition.left = Math.max(newPosition.left, 0);

        setPopupPosition(newPosition);
    };

    return (
        <div>
            <button ref={buttonRef} onClick={() => setShowPopup((prev) => !prev)}>
                Open Popup
            </button>
            {showPopup && (
                <PopupPortal position={{ position: 'absolute', ...popupPosition }}>
                    {props.children}
                </PopupPortal>
            )}
        </div>
    );
};
