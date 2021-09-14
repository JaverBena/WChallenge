"use stritc";

class MessageBuilder {
  constructor() {
    this.success = false;
    this.status = 500;
    this.message = "Failed transaction";
    this.documents = undefined;
  }
  setSuccess(success) {
    this.success = success;
    return this;
  }
  setStatus(status) {
    this.status = status;
    return this;
  }
  setMessage(message) {
    this.message = message;
    return this;
  }
  setDocuments(documents) {
    this.documents = documents;
    return this;
  }
  build() {
    return {
      success: this.success,
      status: this.status,
      message:
        this.message ||
        (this.success ? "Execution successful" : "Failed transaction"),
      documents: this.documents
    };
  }
}

module.exports = { MessageBuilder };