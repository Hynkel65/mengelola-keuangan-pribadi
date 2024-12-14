import React, { useState } from 'react';
import '../style/ImageModal.css'

const ImageModal = ({ image, closeModal }) => {
  const [zoomed, setZoomed] = useState(false);

  const toggleZoom = () => {
    setZoomed(!zoomed);
  };

  return (
    <div className= {`modal-overlay ${zoomed ? 'zoomed' : ''}`} onClick= {closeModal}>
      <div className= {`img-modal-content ${zoomed ? 'zoomed' : ''}`} onClick= {(e) => e.stopPropagation()}>
        <img
        src= {`uploads/${image}`}
        alt= ""
        className= {`modal-image ${zoomed ? 'zoomed' : ''}`}
        onClick= {toggleZoom}
        draggable= "false"
        />
      </div>
    </div>
  );
};

export default ImageModal;
