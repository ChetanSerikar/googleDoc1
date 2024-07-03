const { Socket } = require("socket.io");

const mongoose = require("mongoose");
const Document = require("./Document");

// const connectionStr =
//   "mongodb+srv://chetanserikar87:dWjz2KTuuxxPalGz@cluster0.3pdfput.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// mongoose.set("strictQuery", true);
// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://chetan3587:ChetanSerikar@cluster0.3pdfput.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`Mongodb connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();
// mongoose.connect(connectionStr);

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const deafultValue = "";
io.on("connection", (socket) => {
  socket.on("get-document", (documentId) => {
    const document = findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({
    _id: id,
    data: deafultValue,
  });
}
