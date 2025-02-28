import React from 'react';
import pdf from './adventures_of_tom.pdf';

function E_Book() {
  return (
    <div className="pdf-container">
      <iframe
        src={pdf}
        title="E-Book Viewer"
        width="100%"
        height="600px"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default E_Book;
