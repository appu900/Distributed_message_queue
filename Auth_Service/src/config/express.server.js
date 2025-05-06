import app from "../expressApp.js";
const PORT = process.env.PORT | 5000;

export class ApplicationServer {
  constructor(port) {
    this.PORT = port;
  }

  //   bootstraping the server
  async BootStrap() {
    try {
      app.listen(PORT, function () {
        console.log(`server started on PORT ${PORT}`);
      });
    } catch (error) {
      console.log("Error in bootstraping Error", error);
      process.exit(1);
    }
  }
}
