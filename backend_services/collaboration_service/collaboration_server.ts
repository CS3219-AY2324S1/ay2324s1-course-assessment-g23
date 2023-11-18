import { Server, Socket } from "socket.io";
import * as http from "http";
import { ChangeSet, Text } from "@codemirror/state";
import { Update } from "@codemirror/collab";

const server = http.createServer();

class Room {
    updates: Update[] = [];
    doc: Text = Text.of([""]);
    pending: ((value: any) => void)[] = [];
}

interface RoomsDict {
    [roomId: string]: Room;
}

const rooms: RoomsDict = {};

let io = new Server(server, {
    path: "/room",
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// listening for connections from clients
io.on("connection", (socket: Socket) => {
    let room: Room | null = null;
    socket.on("join-room", (roomId) => {
        if (typeof roomId != "string") return;

        room = rooms[roomId];
        if (!room) {
            room = new Room();
            rooms[roomId] = room;
        }
    });

    socket.on("pullUpdates", (version: number) => {
        if (room == null) return;
        if (version < room.updates.length) {
            socket.emit(
                "pullUpdateResponse",
                JSON.stringify(room.updates.slice(version))
            );
        } else {
            room.pending.push((updates) => {
                socket.emit(
                    "pullUpdateResponse",
                    JSON.stringify(updates.slice(version))
                );
            });
        }
    });

    socket.on("pushUpdates", (version, docUpdates) => {
        if (room == null) return;
        docUpdates = JSON.parse(docUpdates);

        try {
            if (version != room.updates.length) {
                socket.emit("pushUpdateResponse", false);
            } else {
                for (let update of docUpdates) {
                    // Convert the JSON representation to an actual ChangeSet
                    // instance
                    let changes = ChangeSet.fromJSON(update.changes);
                    room.updates.push({ changes, clientID: update.clientID });
                    room.doc = changes.apply(room.doc);
                }
                socket.emit("pushUpdateResponse", true);

                while (room.pending.length) room.pending.pop()!(room.updates);
            }
        } catch (error) {
            console.error(error);
        }
    });

    socket.on("getDocument", () => {
        if (room == null) return;
        socket.emit(
            "getDocumentResponse",
            room.updates.length,
            room.doc.toString()
        );
    });
});

const port = 8000;
server.listen(port, () => console.log(`Server listening on port: ${port}`));
