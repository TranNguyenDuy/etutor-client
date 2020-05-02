import React from "react";
import { Lightbox } from "react-modal-image";
import { Col, Row } from "reactstrap";

class AttachmentsPreview extends React.Component {
  imageExtRegex = /(gif|jpe?g|tiff|png|webp|bmp)$/i;

  state = {
    previewModal: false,
  };

  render() {
    const { attachments, mode } = this.props;
    const images = [];
    const documents = [];
    attachments.forEach((attachment) => {
      const isImage = this.imageExtRegex.test(attachment.ext);
      if (isImage) return images.push(attachment);
      documents.push(attachment);
    });
    return (
      <React.Fragment>
        <Row>
          {images.map((image, index) => (
            <Col md={2} sm={4} key={index} className="p-2">
              <div
                className={`attachment-image-container ${
                  mode === "view" ? "clickable" : ""
                }`}
                style={{
                  backgroundImage: `url('${image.path}')`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
                onClick={() => {
                  if (mode !== "view") return;
                  this.setState({
                    previewModal: true,
                  });
                }}
              ></div>
              {mode === "form" && (
                <span
                  className="close"
                  onClick={() => {
                    if (this.props.removeAttachment)
                      this.props.removeAttachment(image);
                  }}
                >
                  <i className="fa fa-times"></i>
                </span>
              )}
              {this.state.previewModal && (
                <Lightbox
                  medium={image.path}
                  alt={image.actualName}
                  hideZoom
                  showRotate
                  onClose={() => {
                    this.setState({
                      previewModal: false,
                    });
                  }}
                />
              )}
            </Col>
          ))}
        </Row>

        {documents.map((document, index) => (
          <Row key={index} className="mt-3">
            <Col cols={12}>
              <div className={`attachment-document-container`}>
                <span>
                  <i className="fa fa-file-o"></i> {document.actualName}&nbsp;
                  {mode === "form" ? (
                    <i
                      className="fa fa-times"
                      onClick={() => {
                        if (this.props.removeAttachment)
                          this.props.removeAttachment(document);
                      }}
                    ></i>
                  ) : (
                    <a href={document.path} download>
                      <i className="fa fa-download"></i>
                    </a>
                  )}
                </span>
              </div>
            </Col>
          </Row>
        ))}
      </React.Fragment>
    );
  }
}

export default AttachmentsPreview;
