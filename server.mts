import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);


const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        },
    });

    io.on("connection", (socket) => {

        socket.on('new_booking', (booking) => {
            socket.join(booking.id)
            io.emit('new_booking', booking)
        })

        socket.on('accepted_booking', (booking) => {
            socket.join(booking.id)
            io.to(booking.id).emit('accepted_booking', booking)
        })

        socket.on('pickup_passenger', (booking) => {
            io.to(booking.id).emit('pickup_passenger', booking)
        })

        socket.on('dropoff_passenger', (booking) => {
            io.to(booking.id).emit('dropoff_passenger', booking)
        })

        // socket.on('disconnect', () => {
        //     console.log('A user disconnected');
        // });

    });


    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});