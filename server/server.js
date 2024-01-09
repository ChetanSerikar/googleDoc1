const { Socket } = require('socket.io')

const mongoose = require("mongoose"); 
const Document = require('./Document')

const connectionStr = "mongodb://localhost:/googledocs"; 
mongoose.set("strictQuery", true); 
const options = { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
}; 

mongoose.connect(connectionStr);


const io = require( 'socket.io')(3001 , {
    cors : {
        origin: 'http://localhost:3000',
        methods : [ 'GET' , 'POST']
    }
})


const deafultValue = ""
io.on( 'connection' , socket =>{
    socket.on('get-document', documentId => {
        const document=findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit('load-document',document.data)
        socket.on('send-changes' , delta => {

            socket.broadcast.to(documentId).emit('receive-changes' , delta)
        })

        socket.on('save-document',async data => {
            await Document.findByIdAndUpdate(documentId,{data})
        })
    })
    
   
})

async function findOrCreateDocument(id){
    if(id == null) return

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({
        _id:id,
        data :deafultValue
    })
}